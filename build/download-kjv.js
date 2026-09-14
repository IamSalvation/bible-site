// build/download-kjv.js
// Downloads the KJV Bible from aruljohn/Bible-kjv as per-book JSON files.
// Run: node build/download-kjv.js

const fs = require('fs');
const path = require('path');

// Base URL for raw files on GitHub
const BASE_URL = 'https://raw.githubusercontent.com/aruljohn/Bible-kjv/master';

// List of all 66 book names (must match filenames exactly)
const BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1Samuel", "2Samuel",
    "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "SongofSolomon", "Isaiah", "Jeremiah", "Lamentations",
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts",
    "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy",
    "2Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1Peter", "2Peter", "1John", "2John", "3John",
    "Jude", "Revelation"
];

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper to slugify filenames for our app (e.g., "1Samuel" -> "1-samuel")
function slug(name) {
    // Insert hyphen between number and letter, then lowercase
    return name.replace(/^(\d+)/, '$1-').toLowerCase();
}

async function main() {
    console.log(`Downloading ${BOOKS.length} books from aruljohn/Bible-kjv...\n`);

    for (const book of BOOKS) {
        const url = `${BASE_URL}/${book}.json`;
        const outPath = path.join(DATA_DIR, `${slug(book)}.json`);

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // The aruljohn format is an object: { "1": { "1": "In the beginning...", "2": "..." }, "2": {...} }
            // We need to convert it to our simpler format: { "1": ["verse1", "verse2", ...], "2": [...] }
            const chapters = {};
            for (const ch of data.chapters) {
                chapters[String(ch.chapter)] = ch.verses.map(v => v.text);
            }

            fs.writeFileSync(outPath, JSON.stringify(chapters));
            const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
            console.log(`   ✅ ${slug(book)}.json (${kb} KB)`);

            // Be polite to GitHub's servers
            await new Promise(r => setTimeout(r, 100));
        } catch (err) {
            console.error(`   ❌ ${book}: ${err.message}`);
        }
    }

    console.log('\n🎉 Done! All books saved to ./data/');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});