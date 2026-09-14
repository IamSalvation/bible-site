// ============================================================
// ===== Book registry ========================================
// ============================================================
const BOOKS = {
    "Genesis": { file: "genesis", chapters: 50 },
    "Exodus": { file: "exodus", chapters: 40 },
    "Leviticus": { file: "leviticus", chapters: 27 },
    "Numbers": { file: "numbers", chapters: 36 },
    "Deuteronomy": { file: "deuteronomy", chapters: 34 },
    "Joshua": { file: "joshua", chapters: 24 },
    "Judges": { file: "judges", chapters: 21 },
    "Ruth": { file: "ruth", chapters: 4 },
    "1 Samuel": { file: "1-samuel", chapters: 31 },
    "2 Samuel": { file: "2-samuel", chapters: 24 },
    "1 Kings": { file: "1-kings", chapters: 22 },
    "2 Kings": { file: "2-kings", chapters: 25 },
    "1 Chronicles": { file: "1-chronicles", chapters: 29 },
    "2 Chronicles": { file: "2-chronicles", chapters: 36 },
    "Ezra": { file: "ezra", chapters: 10 },
    "Nehemiah": { file: "nehemiah", chapters: 13 },
    "Esther": { file: "esther", chapters: 10 },
    "Job": { file: "job", chapters: 42 },
    "Psalms": { file: "psalms", chapters: 150 },
    "Proverbs": { file: "proverbs", chapters: 31 },
    "Ecclesiastes": { file: "ecclesiastes", chapters: 12 },
    "Song of Solomon": { file: "songofsolomon", chapters: 8 },
    "Isaiah": { file: "isaiah", chapters: 66 },
    "Jeremiah": { file: "jeremiah", chapters: 52 },
    "Lamentations": { file: "lamentations", chapters: 5 },
    "Ezekiel": { file: "ezekiel", chapters: 48 },
    "Daniel": { file: "daniel", chapters: 12 },
    "Hosea": { file: "hosea", chapters: 14 },
    "Joel": { file: "joel", chapters: 3 },
    "Amos": { file: "amos", chapters: 9 },
    "Obadiah": { file: "obadiah", chapters: 1 },
    "Jonah": { file: "jonah", chapters: 4 },
    "Micah": { file: "micah", chapters: 7 },
    "Nahum": { file: "nahum", chapters: 3 },
    "Habakkuk": { file: "habakkuk", chapters: 3 },
    "Zephaniah": { file: "zephaniah", chapters: 3 },
    "Haggai": { file: "haggai", chapters: 2 },
    "Zechariah": { file: "zechariah", chapters: 14 },
    "Malachi": { file: "malachi", chapters: 4 },
    "Matthew": { file: "matthew", chapters: 28 },
    "Mark": { file: "mark", chapters: 16 },
    "Luke": { file: "luke", chapters: 24 },
    "John": { file: "john", chapters: 21 },
    "Acts": { file: "acts", chapters: 28 },
    "Romans": { file: "romans", chapters: 16 },
    "1 Corinthians": { file: "1-corinthians", chapters: 16 },
    "2 Corinthians": { file: "2-corinthians", chapters: 13 },
    "Galatians": { file: "galatians", chapters: 6 },
    "Ephesians": { file: "ephesians", chapters: 6 },
    "Philippians": { file: "philippians", chapters: 4 },
    "Colossians": { file: "colossians", chapters: 4 },
    "1 Thessalonians": { file: "1-thessalonians", chapters: 5 },
    "2 Thessalonians": { file: "2-thessalonians", chapters: 3 },
    "1 Timothy": { file: "1-timothy", chapters: 6 },
    "2 Timothy": { file: "2-timothy", chapters: 4 },
    "Titus": { file: "titus", chapters: 3 },
    "Philemon": { file: "philemon", chapters: 1 },
    "Hebrews": { file: "hebrews", chapters: 13 },
    "James": { file: "james", chapters: 5 },
    "1 Peter": { file: "1-peter", chapters: 5 },
    "2 Peter": { file: "2-peter", chapters: 3 },
    "1 John": { file: "1-john", chapters: 5 },
    "2 John": { file: "2-john", chapters: 1 },
    "3 John": { file: "3-john", chapters: 1 },
    "Jude": { file: "jude", chapters: 1 },
    "Revelation": { file: "revelation", chapters: 22 }
};

const BOOK_NAMES = Object.keys(BOOKS);

// ============================================================
// ===== DOM refs =============================================
// ============================================================
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const reader = document.getElementById('reader');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const themeBtn = document.getElementById('themeBtn');
const bookmarksBtn = document.getElementById('bookmarksBtn');
const settingsBtn = document.getElementById('settingsBtn');

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchResults = document.getElementById('searchResults');
const searchStatus = document.getElementById('searchStatus');
const searchList = document.getElementById('searchResultsList');
const closeSearchBtn = document.getElementById('closeSearchBtn');

const verseToolbar = document.getElementById('verseToolbar');
const vtBookmark = document.getElementById('vtBookmark');
const vtCopy = document.getElementById('vtCopy');
const vtLink = document.getElementById('vtLink');
const vtClear = document.getElementById('vtClear');
const vtClose = document.getElementById('vtClose');
const vtColors = document.querySelectorAll('.vt-color');

const bookmarksPanel = document.getElementById('bookmarksPanel');
const bookmarksList = document.getElementById('bookmarksList');
const closeBookmarksBtn = document.getElementById('closeBookmarksBtn');

const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeVal = document.getElementById('fontSizeVal');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const lineHeightRange = document.getElementById('lineHeightRange');
const lineHeightVal = document.getElementById('lineHeightVal');
const contentWidthRange = document.getElementById('contentWidthRange');
const contentWidthVal = document.getElementById('contentWidthVal');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');

const toast = document.getElementById('toast');

// ============================================================
// ===== State ================================================
// ============================================================
let currentBook = localStorage.getItem('book') || 'John';
let currentChapter = parseInt(localStorage.getItem('chapter')) || 3;

const bibleCache = {};
let allBooksLoaded = false;

let annotations = JSON.parse(localStorage.getItem('annotations') || '{}');

let selectedVerseEl = null;
let selectedVerseKey = null;

// Reading settings
const DEFAULT_SETTINGS = {
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.7,
    contentWidth: 720
};

let settings = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('readerSettings') || '{}') };

// ============================================================
// ===== Helpers ==============================================
// ============================================================
function verseKey(book, chapter, verse) {
    return `${book} ${chapter}:${verse}`;
}

function saveAnnotations() {
    localStorage.setItem('annotations', JSON.stringify(annotations));
}

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugifyBook(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

function showToast(msg, ms = 1800) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, ms);
}

// ============================================================
// ===== Panel management (only one open at a time) ===========
// ============================================================
function closeAllPanels(except = null) {
    if (except !== 'bookmarks') bookmarksPanel.classList.add('hidden');
    if (except !== 'settings') settingsPanel.classList.add('hidden');
    if (except !== 'search') searchResults.classList.add('hidden');
}

// ============================================================
// ===== Reading settings =====================================
// ============================================================
const FONT_FAMILIES = {
    serif: "Georgia, 'Times New Roman', serif",
    sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
    mono: "'Consolas', 'Monaco', monospace",
    dyslexic: "'Comic Sans MS', 'Trebuchet MS', sans-serif"
};

function applySettings() {
    const root = document.documentElement;
    root.style.setProperty('--reader-font-size', settings.fontSize + 'px');
    root.style.setProperty('--reader-line-height', settings.lineHeight);
    root.style.setProperty('--reader-font-family', FONT_FAMILIES[settings.fontFamily] || FONT_FAMILIES.serif);
    root.style.setProperty('--reader-max-width', settings.contentWidth + 'px');

    fontSizeVal.textContent = settings.fontSize + 'px';
    lineHeightVal.textContent = settings.lineHeight.toFixed(1);
    contentWidthVal.textContent = settings.contentWidth + 'px';

    fontSizeRange.value = settings.fontSize;
    fontFamilySelect.value = settings.fontFamily;
    lineHeightRange.value = settings.lineHeight;
    contentWidthRange.value = settings.contentWidth;

    localStorage.setItem('readerSettings', JSON.stringify(settings));
}

fontSizeRange.addEventListener('input', e => {
    settings.fontSize = parseInt(e.target.value);
    applySettings();
});
fontFamilySelect.addEventListener('change', e => {
    settings.fontFamily = e.target.value;
    applySettings();
});
lineHeightRange.addEventListener('input', e => {
    settings.lineHeight = parseFloat(e.target.value);
    applySettings();
});
contentWidthRange.addEventListener('input', e => {
    settings.contentWidth = parseInt(e.target.value);
    applySettings();
});
resetSettingsBtn.addEventListener('click', () => {
    settings = { ...DEFAULT_SETTINGS };
    applySettings();
});

// ============================================================
// ===== URL hash routing =====================================
// ============================================================
// Format: #book-slug/chapter[/verse]
//   #john/3
//   #john/3/16
//   #1-samuel/17/45

function parseHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return null;
    const parts = hash.split('/');
    if (parts.length < 2) return null;

    const bookSlug = parts[0];
    const chapter = parseInt(parts[1]);
    const verse = parts[2] ? parseInt(parts[2]) : null;

    if (!chapter || isNaN(chapter)) return null;

    const book = BOOK_NAMES.find(b => slugifyBook(b) === bookSlug);
    if (!book) return null;

    return { book, chapter, verse };
}

function updateHash(book, chapter, verse = null) {
    const slug = slugifyBook(book);
    const hash = verse ? `#${slug}/${chapter}/${verse}` : `#${slug}/${chapter}`;
    if (window.location.hash !== hash) {
        history.replaceState(null, '', hash);
    }
}

async function handleHashChange() {
    const target = parseHash();
    if (!target) return;

    currentBook = target.book;
    currentChapter = target.chapter;
    bookSelect.value = currentBook;
    fillChapters(currentBook);
    chapterSelect.value = currentChapter;

    await loadChapter(currentBook, currentChapter);

    if (target.verse) {
        const verseEl = document.querySelector(`#reader .verse[data-verse="${target.verse}"]`);
        if (verseEl) {
            setTimeout(() => {
                verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                verseEl.classList.add('highlight');
                setTimeout(() => verseEl.classList.remove('highlight'), 2500);
            }, 100);
        }
    }
}

window.addEventListener('hashchange', handleHashChange);

// ============================================================
// ===== Book / chapter dropdowns =============================
// ============================================================
BOOK_NAMES.forEach(book => {
    const opt = document.createElement('option');
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
});

function fillChapters(book) {
    chapterSelect.innerHTML = '';
    const count = BOOKS[book]?.chapters || 1;
    for (let i = 1; i <= count; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Chapter ${i}`;
        chapterSelect.appendChild(opt);
    }
}

// ============================================================
// ===== Load a chapter =======================================
// ============================================================
async function loadChapter(book, chapter) {
    reader.innerHTML = '<p class="loading">Loading…</p>';
    hideVerseToolbar();
    selectedVerseEl = null;
    selectedVerseKey = null;

    const file = BOOKS[book]?.file;
    if (!file) {
        reader.innerHTML = '<p class="error">Unknown book.</p>';
        return;
    }

    try {
        let bookData = bibleCache[book];
        if (!bookData) {
            const res = await fetch(`./data/${file}.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            bookData = await res.json();
            bibleCache[book] = bookData;
        }

        const verses = bookData[String(chapter)];
        if (!verses || verses.length === 0) {
            reader.innerHTML = '<p class="error">No verses found.</p>';
            return;
        }

        const html = `
      <h2 class="chapter-title">${book} ${chapter}</h2>
      ${verses.map((text, i) => {
            const vNum = i + 1;
            const key = verseKey(book, chapter, vNum);
            const ann = annotations[key] || {};
            const cls = [
                'verse',
                ann.color ? `hl-${ann.color}` : '',
                ann.bookmarked ? 'bookmarked' : ''
            ].filter(Boolean).join(' ');
            return `
          <p class="${cls}"
             data-verse="${vNum}"
             data-book="${book}"
             data-chapter="${chapter}">
            <span class="verse-num">${vNum}</span>${text}
          </p>
        `;
        }).join('')}
    `;
        reader.innerHTML = html;

        reader.querySelectorAll('.verse').forEach(el => {
            el.addEventListener('click', onVerseClick);
        });

        localStorage.setItem('book', book);
        localStorage.setItem('chapter', chapter);
        updateHash(book, chapter);

    } catch (err) {
        console.error(err);
        reader.innerHTML = `<p class="error">Failed to load: ${err.message}</p>`;
    }
}

// ============================================================
// ===== Navigation ===========================================
// ============================================================
function goPrev() {
    let ch = currentChapter - 1;
    let bk = currentBook;
    if (ch < 1) {
        const idx = BOOK_NAMES.indexOf(currentBook);
        if (idx > 0) { bk = BOOK_NAMES[idx - 1]; ch = BOOKS[bk].chapters; }
        else return;
    }
    currentBook = bk; currentChapter = ch;
    bookSelect.value = bk; fillChapters(bk); chapterSelect.value = ch;
    loadChapter(bk, ch).then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function goNext() {
    let ch = currentChapter + 1;
    let bk = currentBook;
    if (ch > BOOKS[currentBook].chapters) {
        const idx = BOOK_NAMES.indexOf(currentBook);
        if (idx < BOOK_NAMES.length - 1) { bk = BOOK_NAMES[idx + 1]; ch = 1; }
        else return;
    }
    currentBook = bk; currentChapter = ch;
    bookSelect.value = bk; fillChapters(bk); chapterSelect.value = ch;
    loadChapter(bk, ch).then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// ===== Reader listeners =====================================
// ============================================================
bookSelect.addEventListener('change', e => {
    currentBook = e.target.value;
    currentChapter = 1;
    fillChapters(currentBook);
    chapterSelect.value = 1;
    loadChapter(currentBook, 1);
});

chapterSelect.addEventListener('change', e => {
    currentChapter = parseInt(e.target.value);
    loadChapter(currentBook, currentChapter);
});

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// ============================================================
// ===== Verse toolbar ========================================
// ============================================================
function onVerseClick(e) {
    if (e.target.closest('.verse-toolbar')) return;
    const el = e.currentTarget;
    if (selectedVerseEl === el) { deselectVerse(); return; }
    selectVerse(el);
}

function selectVerse(el) {
    if (selectedVerseEl) selectedVerseEl.classList.remove('selected');
    reader.querySelectorAll('.verse.selected').forEach(v => v.classList.remove('selected'));

    selectedVerseEl = el;
    el.classList.add('selected');

    const book = el.dataset.book;
    const chapter = parseInt(el.dataset.chapter);
    const verse = parseInt(el.dataset.verse);
    selectedVerseKey = verseKey(book, chapter, verse);

    showVerseToolbar(el, selectedVerseKey);
}

function deselectVerse() {
    if (selectedVerseEl) selectedVerseEl.classList.remove('selected');
    selectedVerseEl = null;
    selectedVerseKey = null;
    hideVerseToolbar();
}

function showVerseToolbar(verseEl, key) {
    const ann = annotations[key] || {};
    vtBookmark.classList.toggle('active', !!ann.bookmarked);
    vtColors.forEach(btn => btn.classList.toggle('active', btn.dataset.color === ann.color));

    verseToolbar.classList.remove('hidden');
    const verseRect = verseEl.getBoundingClientRect();
    const toolbarRect = verseToolbar.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = verseRect.top + scrollY - toolbarRect.height - 8;
    let left = verseRect.left + scrollX + (verseRect.width / 2) - (toolbarRect.width / 2);

    const minLeft = scrollX + 8;
    const maxLeft = scrollX + window.innerWidth - toolbarRect.width - 8;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    if (verseRect.top < toolbarRect.height + 16) {
        top = verseRect.bottom + scrollY + 8;
    }

    verseToolbar.style.top = `${top}px`;
    verseToolbar.style.left = `${left}px`;
}

function hideVerseToolbar() {
    verseToolbar.classList.add('hidden');
}

// Bookmark toggle
vtBookmark.addEventListener('click', () => {
    if (!selectedVerseKey || !selectedVerseEl) return;
    const ann = annotations[selectedVerseKey] || {};
    ann.bookmarked = !ann.bookmarked;
    if (!ann.bookmarked && !ann.color) delete annotations[selectedVerseKey];
    else annotations[selectedVerseKey] = ann;
    saveAnnotations();
    selectedVerseEl.classList.toggle('bookmarked', !!ann.bookmarked);
    vtBookmark.classList.toggle('active', !!ann.bookmarked);
    showToast(ann.bookmarked ? '🔖 Bookmarked' : 'Bookmark removed');
});

// Copy verse text
vtCopy.addEventListener('click', async () => {
    if (!selectedVerseEl) return;
    const book = selectedVerseEl.dataset.book;
    const chapter = selectedVerseEl.dataset.chapter;
    const verse = selectedVerseEl.dataset.verse;

    const clone = selectedVerseEl.cloneNode(true);
    const numSpan = clone.querySelector('.verse-num');
    if (numSpan) numSpan.remove();
    const text = clone.textContent.trim();

    const formatted = `${book} ${chapter}:${verse} — ${text} (KJV)`;

    try {
        await navigator.clipboard.writeText(formatted);
        showToast('✓ Copied verse');
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = formatted;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✓ Copied verse');
    }
});

// Copy link to verse
vtLink.addEventListener('click', async () => {
    if (!selectedVerseEl) return;
    const book = selectedVerseEl.dataset.book;
    const chapter = selectedVerseEl.dataset.chapter;
    const verse = selectedVerseEl.dataset.verse;

    const url = `${window.location.origin}${window.location.pathname}#${slugifyBook(book)}/${chapter}/${verse}`;

    try {
        await navigator.clipboard.writeText(url);
        showToast('🔗 Link copied');
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('🔗 Link copied');
    }
});

// Color dots
vtColors.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!selectedVerseKey || !selectedVerseEl) return;
        const color = btn.dataset.color;
        const ann = annotations[selectedVerseKey] || {};

        ['yellow', 'green', 'blue', 'pink', 'purple'].forEach(c => {
            selectedVerseEl.classList.remove(`hl-${c}`);
        });

        if (ann.color === color) {
            delete ann.color;
        } else {
            ann.color = color;
            selectedVerseEl.classList.add(`hl-${color}`);
        }

        if (!ann.bookmarked && !ann.color) delete annotations[selectedVerseKey];
        else annotations[selectedVerseKey] = ann;
        saveAnnotations();

        vtColors.forEach(b => b.classList.toggle('active', b.dataset.color === ann.color));
    });
});

// Clear
vtClear.addEventListener('click', () => {
    if (!selectedVerseKey || !selectedVerseEl) return;
    delete annotations[selectedVerseKey];
    saveAnnotations();

    ['yellow', 'green', 'blue', 'pink', 'purple'].forEach(c => {
        selectedVerseEl.classList.remove(`hl-${c}`);
    });
    selectedVerseEl.classList.remove('bookmarked');
    vtBookmark.classList.remove('active');
    vtColors.forEach(b => b.classList.remove('active'));
});

vtClose.addEventListener('click', deselectVerse);

document.addEventListener('click', e => {
    if (verseToolbar.classList.contains('hidden')) return;
    if (e.target.closest('.verse-toolbar')) return;
    if (e.target.closest('.verse')) return;
    deselectVerse();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !verseToolbar.classList.contains('hidden')) deselectVerse();
});

// ============================================================
// ===== Bookmarks panel ======================================
// ============================================================
function renderBookmarks() {
    const entries = Object.entries(annotations)
        .filter(([, ann]) => ann.bookmarked)
        .map(([key, ann]) => {
            const m = key.match(/^(.+)\s(\d+):(\d+)$/);
            if (!m) return null;
            return { key, book: m[1], chapter: parseInt(m[2]), verse: parseInt(m[3]), ann };
        })
        .filter(Boolean);

    if (entries.length === 0) {
        bookmarksList.innerHTML = '<p class="empty-state">No bookmarks yet.<br><br>Click any verse and tap 🔖 to save it.</p>';
        return;
    }

    bookmarksList.innerHTML = entries.map(({ key, book, chapter, verse, ann }) => {
        let text = '';
        if (bibleCache[book] && bibleCache[book][String(chapter)]) {
            text = bibleCache[book][String(chapter)][verse - 1] || '';
        }
        if (text.length > 120) text = text.slice(0, 120) + '…';

        const colorBg = ann.color
            ? ({
                yellow: 'rgba(255,235,59,0.25)',
                green: 'rgba(76,175,80,0.18)',
                blue: 'rgba(33,150,243,0.16)',
                pink: 'rgba(233,30,99,0.15)',
                purple: 'rgba(156,39,176,0.15)'
            }[ann.color] || 'var(--card)')
            : 'var(--card)';
        const colorBorder = ann.color ? 'var(--accent)' : 'transparent';

        return `
      <div class="bookmark-item"
           style="background:${colorBg};border-left-color:${colorBorder}">
        <span class="bookmark-ref">${book} ${chapter}:${verse}</span>
        ${text ? `<span class="bookmark-text">${escapeHtml(text)}</span>` : ''}
        <div class="bookmark-actions">
          <button type="button" data-action="goto" data-book="${book}" data-chapter="${chapter}" data-verse="${verse}">Open</button>
          <button type="button" data-action="remove" data-key="${escapeHtml(key)}">Remove</button>
        </div>
      </div>
    `;
    }).join('');

    bookmarksList.querySelectorAll('button[data-action="goto"]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            jumpToVerse(btn.dataset.book, parseInt(btn.dataset.chapter), parseInt(btn.dataset.verse));
            closeAllPanels();
        });
    });

    bookmarksList.querySelectorAll('button[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            delete annotations[btn.dataset.key];
            saveAnnotations();
            renderBookmarks();
            loadChapter(currentBook, currentChapter);
        });
    });
}

// ============================================================
// ===== Panel open/close handlers ============================
// ============================================================

// Bookmarks
bookmarksBtn.addEventListener('click', e => {
    e.stopPropagation();
    closeAllPanels('bookmarks');
    renderBookmarks();
    bookmarksPanel.classList.remove('hidden');
});

closeBookmarksBtn.addEventListener('click', () => {
    bookmarksPanel.classList.add('hidden');
});

// Settings
settingsBtn.addEventListener('click', e => {
    e.stopPropagation();
    closeAllPanels('settings');
    settingsPanel.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
});

// Click outside any panel → close it
document.addEventListener('click', e => {
    const insideBookmarks = bookmarksPanel.contains(e.target);
    const insideSettings = settingsPanel.contains(e.target);
    const insideSearch = searchResults.contains(e.target);

    // If the click is inside a currently open panel, let it be
    if (insideBookmarks || insideSettings || insideSearch) return;

    // If the click is on the opener button, the button's own handler already ran
    if (e.target.closest('#bookmarksBtn')) return;
    if (e.target.closest('#settingsBtn')) return;

    closeAllPanels();
});

// ============================================================
// ===== Search ===============================================
// ============================================================
async function ensureBookLoaded(bookName) {
    if (bibleCache[bookName]) return bibleCache[bookName];
    const file = BOOKS[bookName].file;
    const res = await fetch(`./data/${file}.json`);
    if (!res.ok) throw new Error(`Failed to load ${bookName}`);
    const data = await res.json();
    bibleCache[bookName] = data;
    return data;
}

async function loadAllBooks(onProgress) {
    if (allBooksLoaded) return;
    let done = 0;
    const total = BOOK_NAMES.length;
    for (const book of BOOK_NAMES) {
        if (!bibleCache[book]) {
            try { await ensureBookLoaded(book); }
            catch (err) { console.warn(`Skipping ${book}:`, err.message); }
        }
        done++;
        if (onProgress) onProgress(done, total);
    }
    allBooksLoaded = true;
}

function highlightMatches(text, query) {
    const safe = escapeHtml(text);
    const re = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
}

function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
        searchList.innerHTML = '<p class="search-progress">Type at least 2 characters.</p>';
        searchStatus.textContent = 'Search';
        return;
    }
    const results = [];
    const MAX_RESULTS = 300;

    outer:
    for (const book of BOOK_NAMES) {
        const bookData = bibleCache[book];
        if (!bookData) continue;
        for (const chNum of Object.keys(bookData)) {
            const verses = bookData[chNum];
            for (let i = 0; i < verses.length; i++) {
                if (verses[i].toLowerCase().includes(q)) {
                    results.push({ book, chapter: parseInt(chNum), verse: i + 1, text: verses[i] });
                    if (results.length >= MAX_RESULTS) break outer;
                }
            }
        }
    }
    renderResults(results, query, results.length >= MAX_RESULTS);
}

function renderResults(results, query, truncated) {
    if (results.length === 0) {
        searchStatus.textContent = 'No matches found';
        searchList.innerHTML = '<p class="search-progress">Try a different word or phrase.</p>';
        return;
    }
    searchStatus.textContent =
        `${results.length}${truncated ? '+' : ''} result${results.length === 1 ? '' : 's'} for “${query}”`;

    searchList.innerHTML = results.map(r => `
    <button class="result-item" type="button"
            data-book="${escapeHtml(r.book)}"
            data-chapter="${r.chapter}"
            data-verse="${r.verse}">
      <span class="result-ref">${escapeHtml(r.book)} ${r.chapter}:${r.verse}</span>
      <span class="result-text">${highlightMatches(r.text, query)}</span>
    </button>
  `).join('');

    searchList.querySelectorAll('.result-item').forEach(btn => {
        btn.addEventListener('click', () => {
            jumpToVerse(btn.dataset.book, parseInt(btn.dataset.chapter), parseInt(btn.dataset.verse));
        });
    });
}

async function jumpToVerse(book, chapter, verse) {
    closeAllPanels();
    searchInput.value = '';

    currentBook = book;
    currentChapter = chapter;
    bookSelect.value = book;
    fillChapters(book);
    chapterSelect.value = chapter;

    await loadChapter(book, chapter);
    updateHash(book, chapter, verse);

    const verseEl = document.querySelector(`#reader .verse[data-verse="${verse}"]`);
    if (verseEl) {
        verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        verseEl.classList.add('highlight');
        setTimeout(() => verseEl.classList.remove('highlight'), 2500);
    }
}

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

async function runSearch() {
    const q = searchInput.value.trim();
    if (q.length < 2) return;
    closeAllPanels('search');
    searchResults.classList.remove('hidden');

    if (!allBooksLoaded) {
        searchStatus.textContent = 'Loading Bible…';
        searchList.innerHTML = '<p class="search-progress">First search downloads all 66 books (~4.5 MB). One-time only.</p>';
        await loadAllBooks((done, total) => {
            searchList.innerHTML = `<p class="search-progress">Loading Bible… ${done} / ${total} books</p>`;
        });
    }
    performSearch(q);
}

const debouncedSearch = debounce(runSearch, 300);
searchInput.addEventListener('input', debouncedSearch);

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
    if (e.key === 'Escape') {
        searchResults.classList.add('hidden');
        searchInput.value = '';
        searchInput.blur();
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.classList.add('hidden');
    searchInput.focus();
});

closeSearchBtn.addEventListener('click', () => {
    searchResults.classList.add('hidden');
});

// ============================================================
// ===== Init =================================================
// ============================================================
(async function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    applySettings();

    bookSelect.value = currentBook;
    fillChapters(currentBook);
    chapterSelect.value = currentChapter;

    const fromHash = parseHash();
    if (fromHash) {
        currentBook = fromHash.book;
        currentChapter = fromHash.chapter;
        bookSelect.value = currentBook;
        fillChapters(currentBook);
        chapterSelect.value = currentChapter;
    }

    await loadChapter(currentBook, currentChapter);

    if (fromHash && fromHash.verse) {
        const verseEl = document.querySelector(`#reader .verse[data-verse="${fromHash.verse}"]`);
        if (verseEl) {
            setTimeout(() => {
                verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                verseEl.classList.add('highlight');
                setTimeout(() => verseEl.classList.remove('highlight'), 2500);
            }, 150);
        }
    }
})();

// ============================================================
// ===== Service worker =======================================
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('✅ SW registered'))
            .catch(err => console.error('SW registration failed:', err));
    });
}