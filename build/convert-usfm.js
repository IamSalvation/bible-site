// ============================================================
// build/convert-usfm.js
// Converts USFM Bible files (Yoruba, Igbo, Hausa) to per-book JSON
// matching the same format as the KJV data.
//
// Run: node build/convert-usfm.js
// ============================================================

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------
// USFM 3-letter book codes → our slug (must match data/kjv slugs)
// ------------------------------------------------------------
const BOOK_CODE_TO_SLUG = {
    GEN: 'genesis',
    EXO: 'exodus',
    LEV: 'leviticus',
    NUM: 'numbers',
    DEU: 'deuteronomy',
    JOS: 'joshua',
    JDG: 'judges',
    RUT: 'ruth',
    '1SA': '1-samuel',
    '2SA': '2-samuel',
    '1KI': '1-kings',
    '2KI': '2-kings',
    '1CH': '1-chronicles',
    '2CH': '2-chronicles',
    EZR: 'ezra',
    NEH: 'nehemiah',
    EST: 'esther',
    JOB: 'job',
    PSA: 'psalms',
    PRO: 'proverbs',
    ECC: 'ecclesiastes',
    SNG: 'songofsolomon',
    ISA: 'isaiah',
    JER: 'jeremiah',
    LAM: 'lamentations',
    EZK: 'ezekiel',
    DAN: 'daniel',
    HOS: 'hosea',
    JOL: 'joel',
    AMO: 'amos',
    OBA: 'obadiah',
    JON: 'jonah',
    MIC: 'micah',
    NAM: 'nahum',
    HAB: 'habakkuk',
    ZEP: 'zephaniah',
    HAG: 'haggai',
    ZEC: 'zechariah',
    MAL: 'malachi',
    MAT: 'matthew',
    MRK: 'mark',
    LUK: 'luke',
    JHN: 'john',
    ACT: 'acts',
    ROM: 'romans',
    '1CO': '1-corinthians',
    '2CO': '2-corinthians',
    GAL: 'galatians',
    EPH: 'ephesians',
    PHP: 'philippians',
    COL: 'colossians',
    '1TH': '1-thessalonians',
    '2TH': '2-thessalonians',
    '1TI': '1-timothy',
    '2TI': '2-timothy',
    TIT: 'titus',
    PHM: 'philemon',
    HEB: 'hebrews',
    JAS: 'james',
    '1PE': '1-peter',
    '2PE': '2-peter',
    '1JN': '1-john',
    '2JN': '2-john',
    '3JN': '3-john',
    JUD: 'jude',
    REV: 'revelation'
};

// ------------------------------------------------------------
// Strip USFM inline markers from a verse's text.
// Keeps the visible text, drops the markup.
// ------------------------------------------------------------
function cleanVerseText(text) {
    let t = text;

    // Remove footnotes entirely: \f ... \f*
    t = t.replace(/\\f\s+[^]*?\\f\*/g, '');

    // Remove cross-references entirely: \x ... \x*
    t = t.replace(/\\x\s+[^]*?\\x\*/g, '');

    // Remove word-level markers but keep their content:
    //   \wj ... \wj*     (words of Jesus)
    //   \add ... \add*   (translator's addition)
    //   \nd ... \nd*     (divine name)
    //   \qs ... \qs*     (selah)
    //   \w ... \w*       (word markup)
    // Generic pattern: \\[a-z]+\* closes; \\[a-z0-9]+ opens
    t = t.replace(/\\[a-z][a-z0-9]*\*?/gi, '');

    // Collapse multiple spaces
    t = t.replace(/\s+/g, ' ').trim();

    return t;
}

// ------------------------------------------------------------
// Parse a single USFM file → { "1": ["v1","v2",...], "2":[...] }
// ------------------------------------------------------------
function parseUsfm(rawText) {
    // Normalize line endings
    const lines = rawText.replace(/\r\n/g, '\n').split('\n');

    const chapters = {};
    let currentChapter = null;
    let currentVerse = null;
    let verseBuffer = '';

    function flushVerse() {
        if (currentChapter !== null && currentVerse !== null && verseBuffer) {
            const clean = cleanVerseText(verseBuffer);
            if (!chapters[currentChapter]) chapters[currentChapter] = [];
            // verse numbers may be strings like "1" or "1-2"
            const vNum = parseInt(String(currentVerse).split('-')[0], 10);
            chapters[currentChapter][vNum - 1] = clean;
        }
        verseBuffer = '';
    }

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // Chapter marker: \c 1
        const chapterMatch = line.match(/^\\c\s+(\d+)/);
        if (chapterMatch) {
            flushVerse();
            currentChapter = parseInt(chapterMatch[1], 10);
            currentVerse = null;
            continue;
        }

        // Verse marker: \v 1 (text)
        const verseMatch = line.match(/^\\v\s+(\d+[a-z]?(?:-\d+[a-z]?)?)\s+(.*)$/);
        if (verseMatch) {
            flushVerse();
            currentVerse = verseMatch[1];
            verseBuffer = verseMatch[2];
            continue;
        }

        // Poetry continuation: \q1, \q2, \q3
        const poetryMatch = line.match(/^\\q[123]?\s+(.*)$/);
        if (poetryMatch) {
            if (currentVerse !== null) {
                verseBuffer += ' ' + poetryMatch[1];
            }
            continue;
        }

        // Paragraph continuation that's part of a verse (rare):
        // \p alone = paragraph break (end verse), \p text = continue
        const paraMatch = line.match(/^\\p\s+(.*)$/);
        if (paraMatch) {
            if (currentVerse !== null && paraMatch[1]) {
                verseBuffer += ' ' + paraMatch[1];
            } else {
                flushVerse();
                currentVerse = null;
            }
            continue;
        }

        // \p without text → end current verse
        if (/^\\p$/.test(line)) {
            flushVerse();
            currentVerse = null;
            continue;
        }

        // \b (blank line) → skip
        if (/^\\b$/.test(line)) {
            continue;
        }

        // Other markers to skip entirely (metadata, headers, sections):
        //   \id \h \toc1 \toc2 \toc3 \mt1 \mt2 \s1 \s2 \r \d \sp \mr \ms \cl \cp
        if (/^\\(id|h|toc[0-9]|mt[0-9]?|s[0-9]?|r|d|sp|mr|ms|cl|cp|rem|sts)\b/.test(line)) {
            continue;
        }

        // Unknown marker that starts with backslash → skip
        if (/^\\/.test(line)) {
            continue;
        }

        // Plain text with no marker — append to current verse if we have one
        if (currentVerse !== null) {
            verseBuffer += ' ' + line;
        }
    }

    // Flush the last verse
    flushVerse();

    return chapters;
}

// ------------------------------------------------------------
// Convert one language folder
// ------------------------------------------------------------
function convertLanguage(langName, sourceDir, outputDir) {
    console.log(`\n📖 Converting ${langName.toUpperCase()}...`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir).filter(f => f.toLowerCase().endsWith('.usfm'));
    let converted = 0;
    let skipped = 0;

    for (const file of files) {
        // Extract book code from filename, e.g.:
        //   "02-GENyor.usfm"     → GEN
        //   "10-1SAyor.usfm"     → 1SA
        //   "58-1THhausa.usfm"   → 1TH
        //   "49-JHNyor.usfm"     → JHN
        // Language suffix is one of: yor, ibo, hausa
        const m = file.match(/-([1-3]?[A-Z]+)(yor|ibo|hausa)\.usfm$/i);
        if (!m) {
            console.log(`   ⏭️  Skipping ${file} (no book code)`);
            skipped++;
            continue;
        }
        const bookCode = m[1].toUpperCase();

        const slug = BOOK_CODE_TO_SLUG[bookCode];
        if (!slug) {
            console.log(`   ⚠️  Unknown book code "${bookCode}" in ${file} — skipping`);
            skipped++;
            continue;
        }

        const rawText = fs.readFileSync(path.join(sourceDir, file), 'utf8');
        const chapters = parseUsfm(rawText);

        // Count verses for logging
        let verseCount = 0;
        for (const ch of Object.keys(chapters)) {
            verseCount += chapters[ch].filter(v => v && v.length > 0).length;
        }

        const outPath = path.join(outputDir, `${slug}.json`);
        fs.writeFileSync(outPath, JSON.stringify(chapters), 'utf8');

        const chapterCount = Object.keys(chapters).length;
        console.log(`   ✅ ${slug}.json — ${chapterCount} chapters, ${verseCount} verses`);
        converted++;
    }

    console.log(`   Done: ${converted} books written, ${skipped} skipped`);
    return { converted, skipped };
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
function main() {
    const root = path.join(__dirname, '..');
    const sourcesRoot = path.join(root, 'build', 'sources');
    const dataRoot = path.join(root, 'data');

    const languages = [
        { name: 'yoruba', source: path.join(sourcesRoot, 'yoruba'), output: path.join(dataRoot, 'yoruba') },
        { name: 'igbo', source: path.join(sourcesRoot, 'igbo'), output: path.join(dataRoot, 'igbo') },
        { name: 'hausa', source: path.join(sourcesRoot, 'hausa'), output: path.join(dataRoot, 'hausa') }
    ];

    for (const lang of languages) {
        if (!fs.existsSync(lang.source)) {
            console.log(`\n⚠️  Source folder not found: ${lang.source}`);
            continue;
        }
        convertLanguage(lang.name, lang.source, lang.output);
    }

    console.log('\n🎉 All conversions complete!');
}

main();