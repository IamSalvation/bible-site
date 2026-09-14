// ===== Book registry: display name -> { file slug, chapter count } =====
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

// ===== DOM refs =====
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const reader = document.getElementById('reader');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const themeBtn = document.getElementById('themeBtn');

// ===== State =====
let currentBook = localStorage.getItem('book') || 'John';
let currentChapter = parseInt(localStorage.getItem('chapter')) || 3;

// ===== Populate book dropdown =====
BOOK_NAMES.forEach(book => {
    const opt = document.createElement('option');
    opt.value = book;
    opt.textContent = book;
    bookSelect.appendChild(opt);
});

// ===== Populate chapter dropdown =====
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

// ===== Load a chapter from LOCAL JSON =====
async function loadChapter(book, chapter) {
    reader.innerHTML = '<p class="loading">Loading…</p>';

    const file = BOOKS[book]?.file;
    if (!file) {
        reader.innerHTML = '<p class="error">Unknown book.</p>';
        return;
    }

    try {
        const res = await fetch(`./data/${file}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bookData = await res.json();

        const verses = bookData[String(chapter)];
        if (!verses || verses.length === 0) {
            reader.innerHTML = '<p class="error">No verses found.</p>';
            return;
        }

        const html = `
      <h2 class="chapter-title">${book} ${chapter}</h2>
      ${verses.map((text, i) => `
        <p class="verse">
          <span class="verse-num">${i + 1}</span>${text}
        </p>
      `).join('')}
    `;
        reader.innerHTML = html;

        localStorage.setItem('book', book);
        localStorage.setItem('chapter', chapter);
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error(err);
        reader.innerHTML = `<p class="error">Failed to load: ${err.message}</p>`;
    }
}

// ===== Navigation =====
function goPrev() {
    let ch = currentChapter - 1;
    let bk = currentBook;
    if (ch < 1) {
        const idx = BOOK_NAMES.indexOf(currentBook);
        if (idx > 0) {
            bk = BOOK_NAMES[idx - 1];
            ch = BOOKS[bk].chapters;
        } else {
            return;
        }
    }
    currentBook = bk;
    currentChapter = ch;
    bookSelect.value = bk;
    fillChapters(bk);
    chapterSelect.value = ch;
    loadChapter(bk, ch);
}

function goNext() {
    let ch = currentChapter + 1;
    let bk = currentBook;
    if (ch > BOOKS[currentBook].chapters) {
        const idx = BOOK_NAMES.indexOf(currentBook);
        if (idx < BOOK_NAMES.length - 1) {
            bk = BOOK_NAMES[idx + 1];
            ch = 1;
        } else {
            return;
        }
    }
    currentBook = bk;
    currentChapter = ch;
    bookSelect.value = bk;
    fillChapters(bk);
    chapterSelect.value = ch;
    loadChapter(bk, ch);
}

// ===== Event listeners =====
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

// ===== Init =====
(function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    bookSelect.value = currentBook;
    fillChapters(currentBook);
    chapterSelect.value = currentChapter;

    loadChapter(currentBook, currentChapter);
})();

// ===== Service worker registration (added later) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('✅ SW registered'))
            .catch(err => console.error('SW registration failed:', err));
    });
}