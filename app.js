// ============================================================
// ===== ONENESS BIBLE — app.js ===============================
// ============================================================

// ============================================================
// ===== Splash screen controller =============================
// Shows once per session, except on Android installed PWA
// (Android shows its own native splash).
// ============================================================
(function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    const SPLASH_KEY = 'oneness_splash_shown';
    const DURATION = 1400;

    if (sessionStorage.getItem(SPLASH_KEY) === '1') {
        splash.remove();
        return;
    }

    const isAndroidInstalled =
        /Android/i.test(navigator.userAgent) &&
        window.matchMedia('(display-mode: standalone)').matches;

    if (isAndroidInstalled) {
        splash.remove();
        sessionStorage.setItem(SPLASH_KEY, '1');
        return;
    }

    let dismissed = false;

    function dismissSplash() {
        if (dismissed) return;
        dismissed = true;
        sessionStorage.setItem(SPLASH_KEY, '1');
        splash.classList.add('dismissing');
        setTimeout(() => splash.remove(), 600);
    }

    setTimeout(dismissSplash, DURATION);
    splash.addEventListener('click', dismissSplash);
    splash.addEventListener('touchstart', dismissSplash, { passive: true });
    document.addEventListener('keydown', function onKey() {
        if (!dismissed) {
            dismissSplash();
            document.removeEventListener('keydown', onKey);
        }
    });
})();

function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// ============================================================
// ===== Constants ============================================
// ============================================================
const APP_VERSION = '1.2';
const SETTINGS_KEY = 'readerSettings';
const ANNOTATIONS_KEY = 'annotations';
const STATS_KEY = 'readingStats';
const OFFLINE_STATE_KEY = 'offlineDownloadState';
const TRANSLATION_KEY = 'currentTranslation';

const DEFAULT_SETTINGS = {
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.7,
    contentWidth: 720,
    startScreen: 'home'
};

const FONT_FAMILIES = {
    serif: "Georgia, 'Times New Roman', serif",
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "'Consolas', 'Monaco', monospace",
    dyslexic: "'Comic Sans MS', 'Trebuchet MS', sans-serif"
};

const TRANSLATIONS = {
    kjv: { id: 'kjv', label: 'KJV', fullName: 'King James Version', folder: '', copyright: 'Public Domain' },
    yoruba: { id: 'yoruba', label: 'Yoruba', fullName: 'Bíbélì Mímọ́', folder: 'yoruba', copyright: 'Biblica® Open Yoruba Contemporary Bible™ · CC BY-SA 4.0' },
    igbo: { id: 'igbo', label: 'Igbo', fullName: 'Baịbụl Nsọ', folder: 'igbo', copyright: 'Biblica® Open Igbo Contemporary Bible™ · CC BY-SA 4.0' },
    hausa: { id: 'hausa', label: 'Hausa', fullName: 'Litafi Mai Tsarki', folder: 'hausa', copyright: 'Biblica® Open Hausa Contemporary Bible™ · CC BY-SA 4.0' }
};

const TRANSLATION_IDS = Object.keys(TRANSLATIONS);

const TRANSLATION_SHORT = { kjv: 'KJV', yoruba: 'Yor', igbo: 'Igbo', hausa: 'Haus' };

const BOOK_ABBREV = {
    "Genesis": "Gen", "Exodus": "Exo", "Leviticus": "Lev", "Numbers": "Num", "Deuteronomy": "Deut",
    "Joshua": "Josh", "Judges": "Judg", "Ruth": "Ruth", "1 Samuel": "1 Sam", "2 Samuel": "2 Sam",
    "1 Kings": "1 Kgs", "2 Kings": "2 Kgs", "1 Chronicles": "1 Chr", "2 Chronicles": "2 Chr",
    "Ezra": "Ezra", "Nehemiah": "Neh", "Esther": "Esth", "Job": "Job", "Psalms": "Ps",
    "Proverbs": "Prov", "Ecclesiastes": "Eccl", "Song of Solomon": "Song", "Isaiah": "Isa",
    "Jeremiah": "Jer", "Lamentations": "Lam", "Ezekiel": "Ezek", "Daniel": "Dan",
    "Hosea": "Hos", "Joel": "Joel", "Amos": "Amos", "Obadiah": "Obad", "Jonah": "Jonah",
    "Micah": "Mic", "Nahum": "Nah", "Habakkuk": "Hab", "Zephaniah": "Zeph", "Haggai": "Hag",
    "Zechariah": "Zech", "Malachi": "Mal", "Matthew": "Matt", "Mark": "Mark", "Luke": "Luke",
    "John": "John", "Acts": "Acts", "Romans": "Rom", "1 Corinthians": "1 Cor",
    "2 Corinthians": "2 Cor", "Galatians": "Gal", "Ephesians": "Eph", "Philippians": "Phil",
    "Colossians": "Col", "1 Thessalonians": "1 Thess", "2 Thessalonians": "2 Thess",
    "1 Timothy": "1 Tim", "2 Timothy": "2 Tim", "Titus": "Titus", "Philemon": "Phlm",
    "Hebrews": "Heb", "James": "Jas", "1 Peter": "1 Pet", "2 Peter": "2 Pet",
    "1 John": "1 John", "2 John": "2 John", "3 John": "3 John", "Jude": "Jude", "Revelation": "Rev"
};

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
const $ = id => document.getElementById(id);

const homeScreen = $('home');
const readerHeader = $('readerHeader');
const readerMain = $('reader');
const readerFooter = $('readerFooter');

const headerRow1 = $('headerRow1');
const headerRow2 = $('headerRow2');

const votdText = $('votdText');
const votdRef = $('votdRef');
const votdReadBtn = $('votdReadBtn');
const votdRefreshBtn = $('votdRefreshBtn');
const continueTitle = $('continueTitle');
const continueSub = $('continueSub');
const continueBtn = $('continueBtn');
const statBookmarks = $('statBookmarks');
const statHighlights = $('statHighlights');
const statStreak = $('statStreak');
const startReadingBtn = $('startReadingBtn');
const homeSearchBtn = $('homeSearchBtn');
const homeAboutBtn = $('homeAboutBtn');
const homeShareBtn = $('homeShareBtn');
const homeInstallBtn = $('homeInstallBtn');

const offlinePrompt = $('offlinePrompt');
const offlineProgress = $('offlineProgress');
const offlineComplete = $('offlineComplete');
const offlineProgressText = $('offlineProgressText');
const offlineProgressFill = $('offlineProgressFill');
const offlineProgressPercent = $('offlineProgressPercent');
const downloadAllBtn = $('downloadAllBtn');
const downloadBtnLabel = $('downloadBtnLabel');
const redownloadBtn = $('redownloadBtn');
const offlineLabel = $('offlineLabel');
const offlineCompleteText = $('offlineCompleteText');
const offlineMetaText = $('offlineMetaText');

const homeBtn = $('homeBtn');
const bookmarksBtn = $('bookmarksBtn');
const settingsBtn = $('settingsBtn');
const themeBtn = $('themeBtn');

const translationSelect = $('translationSelect');
const searchInput = $('searchInput');
const clearSearchBtn = $('clearSearchBtn');
const searchResults = $('searchResults');
const searchStatus = $('searchStatus');
const searchList = $('searchResultsList');
const closeSearchBtn = $('closeSearchBtn');

const verseToolbar = $('verseToolbar');
const vtBookmark = $('vtBookmark');
const vtCopy = $('vtCopy');
const vtLink = $('vtLink');
const vtClear = $('vtClear');
const vtClose = $('vtClose');
const vtColors = document.querySelectorAll('.vt-color');

const bookmarksPanel = $('bookmarksPanel');
const bookmarksList = $('bookmarksList');
const closeBookmarksBtn = $('closeBookmarksBtn');

const settingsPanel = $('settingsPanel');
const closeSettingsBtn = $('closeSettingsBtn');
const fontSizeRange = $('fontSizeRange');
const fontSizeVal = $('fontSizeVal');
const fontFamilySelect = $('fontFamilySelect');
const lineHeightRange = $('lineHeightRange');
const lineHeightVal = $('lineHeightVal');
const contentWidthRange = $('contentWidthRange');
const contentWidthVal = $('contentWidthVal');
const startScreenSelect = $('startScreenSelect');
const resetSettingsBtn = $('resetSettingsBtn');

const aboutPanel = $('aboutPanel');
const closeAboutBtn = $('closeAboutBtn');

const installBanner = $('installBanner');
const installAcceptBtn = $('installAcceptBtn');
const installDismissBtn = $('installDismissBtn');

const toast = $('toast');

// ============================================================
// ===== State ================================================
// ============================================================
let currentBook = localStorage.getItem('book') || 'John';
let currentChapter = parseInt(localStorage.getItem('chapter')) || 3;
let currentTranslation = localStorage.getItem(TRANSLATION_KEY) || 'kjv';
if (!TRANSLATIONS[currentTranslation]) currentTranslation = 'kjv';

const bibleCache = {};
let allBooksLoaded = false;

let annotations = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY) || '{}');

let selectedVerseEl = null;
let selectedVerseKey = null;

let settings = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };

let stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');

let votdList = [];
let votdIndexOverride = null;

let deferredInstallPrompt = null;

// ============================================================
// ===== Helpers ==============================================
// ============================================================
function verseKey(book, chapter, verse) {
    return `${book} ${chapter}:${verse}`;
}

function saveAnnotations() {
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
}

function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
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

function normalizeForSearch(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ọ/g, 'o')
        .replace(/ẹ/g, 'e')
        .replace(/ṣ/g, 's')
        .replace(/ụ/g, 'u')
        .replace(/ị/g, 'i')
        .replace(/ṅ/g, 'n')
        .replace(/ń/g, 'n')
        .replace(/ɓ/g, 'b')
        .replace(/ɗ/g, 'd')
        .replace(/ƙ/g, 'k');
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
// ===== Translation helpers ==================================
// ============================================================
function getCurrentTranslation() {
    return TRANSLATIONS[currentTranslation];
}

function dataUrl(translationId, bookFile) {
    const t = TRANSLATIONS[translationId];
    if (!t) return `./data/${bookFile}.json`;
    if (t.folder) return `./data/${t.folder}/${bookFile}.json`;
    return `./data/${bookFile}.json`;
}

// ============================================================
// ===== Search placeholder (mobile vs desktop) ===============
// ============================================================
let lastIsMobile = null;

function updateSearchPlaceholder() {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile === lastIsMobile) return;
    lastIsMobile = isMobile;
    if (searchInput) {
        searchInput.placeholder = isMobile ? 'Search…' : 'Search the Bible…';
    }
}

// ============================================================
// ===== Auto-hide header =====================================
// - Reader opens / refreshes → both rows visible
// - Initial/browser scroll events → do not hide header
// - User scrolls down (20px) → both rows hide
// - User scrolls up (15px)   → Row 2 shows
// - User returns to top       → both rows show
// - Small movements accumulate until a threshold is crossed
// ============================================================
let lastScrollY = 0;
let headerState = 'both';
let scrollTicking = false;
let userScrollIntent = false;

function setHeaderState(state) {
    if (!headerRow1 || !headerRow2) return;

    if (state === 'both') {
        headerRow1.classList.remove('hidden-row');
        headerRow2.classList.remove('hidden-row');
    }
    if (state === 'row2') {
        headerRow1.classList.add('hidden-row');
        headerRow2.classList.remove('hidden-row');
    }
    if (state === 'hidden') {
        headerRow1.classList.add('hidden-row');
        headerRow2.classList.add('hidden-row');
    }
}

function resetHeaderState() {
    headerState = 'both';
    userScrollIntent = false;
    lastScrollY = window.scrollY;
    setHeaderState('both');
}

function readerIsActive() {
    return (
        readerHeader &&
        !readerHeader.classList.contains('hidden') &&
        homeScreen &&
        homeScreen.classList.contains('hidden')
    );
}

window.addEventListener('wheel', () => {
    if (!readerIsActive()) return;
    userScrollIntent = true;
}, { passive: true });

window.addEventListener('touchmove', () => {
    if (!readerIsActive()) return;
    userScrollIntent = true;
}, { passive: true });

window.addEventListener('keydown', (event) => {
    if (!readerIsActive()) return;
    const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
    if (scrollKeys.includes(event.key)) {
        userScrollIntent = true;
    }
}, { passive: true });

window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
        if (!readerIsActive()) {
            scrollTicking = false;
            return;
        }

        const y = window.scrollY;

        // No user scroll intent yet → keep both rows visible
        if (!userScrollIntent) {
            lastScrollY = y;
            if (headerState !== 'both') {
                headerState = 'both';
                setHeaderState('both');
            }
            scrollTicking = false;
            return;
        }

        // Near the top → always show both rows
        if (y <= 60) {
            headerState = 'both';
            setHeaderState('both');
            userScrollIntent = false;
            lastScrollY = y;
            scrollTicking = false;
            return;
        }

        const delta = y - lastScrollY;

        // Scrolling DOWN — threshold 20px
        if (delta > 20) {
            if (headerState !== 'hidden') {
                headerState = 'hidden';
                setHeaderState('hidden');
            }
            lastScrollY = y;
            scrollTicking = false;
            return;
        }

        // Scrolling UP — threshold 15px
        if (delta < -15) {
            if (headerState !== 'row2') {
                headerState = 'row2';
                setHeaderState('row2');
            }
            lastScrollY = y;
            scrollTicking = false;
            return;
        }

        // Movement was too small → DO NOT update lastScrollY.
        // This lets small movements accumulate until a threshold is crossed.
        scrollTicking = false;
    });
}, { passive: true });

window.addEventListener('load', () => {
    resetHeaderState();
    updateSearchPlaceholder();
});

window.addEventListener('resize', updateSearchPlaceholder);

// ============================================================
// ===== Panel management =====================================
// ============================================================
function closeAllPanels(except = null) {
    if (except !== 'bookmarks') bookmarksPanel.classList.add('hidden');
    if (except !== 'settings') settingsPanel.classList.add('hidden');
    if (except !== 'search') searchResults.classList.add('hidden');
    if (except !== 'about') aboutPanel.classList.add('hidden');
}

// ============================================================
// ===== Screen routing =======================================
// ============================================================
function showHome() {
    homeScreen.classList.remove('hidden');
    readerHeader.classList.add('hidden');
    readerMain.classList.add('hidden');
    readerFooter.classList.add('hidden');

    closeAllPanels();
    hideVerseToolbar();
    deselectVerse();

    updateHomeStats();
    updateContinueCard();
    renderVotd();
    renderOfflineCard();
    refreshLucideIcons();
}

function showReader() {
    homeScreen.classList.add('hidden');
    readerHeader.classList.remove('hidden');
    readerMain.classList.remove('hidden');
    readerFooter.classList.remove('hidden');
    resetHeaderState();
    refreshLucideIcons();
}

// ============================================================
// ===== Stats tracking =======================================
// ============================================================
function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function updateStreakOnOpen() {
    const today = todayISO();
    const last = stats.lastOpenedDate;
    if (last === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === yesterday) {
        stats.streak = (stats.streak || 0) + 1;
    } else {
        stats.streak = 1;
    }
    stats.lastOpenedDate = today;
    saveStats();
}

function trackChapterRead(book, chapter) {
    const key = `${book} ${chapter}`;
    stats.chaptersRead = stats.chaptersRead || {};
    stats.chaptersRead[key] = (stats.chaptersRead[key] || 0) + 1;
    saveStats();
}

function updateHomeStats() {
    const bookmarks = Object.values(annotations).filter(a => a.bookmarked).length;
    const highlights = Object.values(annotations).filter(a => a.color).length;
    statBookmarks.textContent = bookmarks;
    statHighlights.textContent = highlights;
    statStreak.textContent = stats.streak || 0;
}

function updateContinueCard() {
    const book = localStorage.getItem('book') || 'John';
    const chapter = localStorage.getItem('chapter') || '3';
    const t = getCurrentTranslation();
    continueTitle.textContent = `${book} ${chapter}`;
    continueSub.textContent = `Continue in ${t.label}`;
}

// ============================================================
// ===== Verse of the Day =====================================
// ============================================================
async function loadVotdList() {
    if (votdList.length) return votdList;
    try {
        const res = await fetch('./votd.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        votdList = await res.json();
    } catch (err) {
        console.warn('VOTD list not available:', err.message);
        votdList = [];
    }
    return votdList;
}

function dayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
}

async function renderVotd() {
    const list = await loadVotdList();

    if (!list.length) {
        votdText.textContent = '"The Lord is my shepherd; I shall not want."';
        votdRef.textContent = '— Psalm 23:1 (KJV)';
        return;
    }

    const idx = votdIndexOverride !== null
        ? votdIndexOverride % list.length
        : dayOfYear() % list.length;

    const v = list[idx];
    votdText.textContent = `"${v.text}"`;
    votdRef.textContent = `— ${v.book} ${v.chapter}:${v.verse} (KJV)`;

    votdReadBtn.onclick = () => {
        jumpToVerse(v.book, v.chapter, v.verse);
    };
}

votdRefreshBtn.addEventListener('click', () => {
    const list = votdList;
    if (!list.length) return;
    votdIndexOverride = ((votdIndexOverride ?? dayOfYear()) + 1) % list.length;
    renderVotd();
});

// ============================================================
// ===== Offline download =====================================
// ============================================================
function getSelectedTranslationsToDownload() {
    const checked = offlinePrompt.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checked).map(cb => cb.value);
}

function updateDownloadButtonLabel() {
    const selected = getSelectedTranslationsToDownload();
    if (selected.length === 0) {
        downloadBtnLabel.textContent = 'Select at least one';
        downloadAllBtn.disabled = true;
        return;
    }
    downloadAllBtn.disabled = false;
    const sizeMb = (selected.length * 4.5).toFixed(1);
    downloadBtnLabel.textContent = `Download ${selected.length} translation${selected.length === 1 ? '' : 's'} · ~${sizeMb} MB`;
}

async function downloadSelectedTranslations() {
    const selected = getSelectedTranslationsToDownload();
    if (selected.length === 0) return;

    downloadAllBtn.disabled = true;
    redownloadBtn.disabled = true;

    offlinePrompt.classList.add('hidden');
    offlineComplete.classList.add('hidden');
    offlineProgress.classList.remove('hidden');

    offlineLabel.textContent = 'Downloading…';

    const totalSteps = selected.length * BOOK_NAMES.length;
    let done = 0;
    const failures = [];

    for (const tId of selected) {
        for (const book of BOOK_NAMES) {
            const file = BOOKS[book].file;
            const url = dataUrl(tId, file);
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                if ('caches' in window) {
                    const cache = await caches.open('bible-kjv-v19');
                    await cache.put(url, res.clone());
                }

                if (!bibleCache[tId]) bibleCache[tId] = {};
                if (!bibleCache[tId][book]) {
                    const data = await res.json();
                    bibleCache[tId][book] = data;
                }
            } catch (err) {
                console.warn(`Failed to download ${tId}/${book}:`, err.message);
                failures.push(`${tId}/${book}`);
            }

            done++;
            const percent = Math.round((done / totalSteps) * 100);
            offlineProgressText.textContent = `Downloading… ${done} / ${totalSteps}`;
            offlineProgressFill.style.width = `${percent}%`;
            offlineProgressPercent.textContent = `${percent}%`;

            await new Promise(r => setTimeout(r, 15));
        }
    }

    const success = failures.length === 0;
    const state = JSON.parse(localStorage.getItem(OFFLINE_STATE_KEY) || '{}');
    state.translations = Array.from(new Set([...(state.translations || []), ...selected]));
    state.completed = success;
    state.completedAt = Date.now();
    state.failed = failures;
    localStorage.setItem(OFFLINE_STATE_KEY, JSON.stringify(state));

    offlineProgress.classList.add('hidden');

    if (success) {
        offlineComplete.classList.remove('hidden');
        showToast(`✅ ${selected.length} translation${selected.length === 1 ? '' : 's'} available offline`);
    } else {
        offlinePrompt.classList.remove('hidden');
        showToast(`⚠️ ${failures.length} books failed — try again`);
        updateDownloadButtonLabel();
    }

    downloadAllBtn.disabled = false;
    redownloadBtn.disabled = false;
    renderOfflineCard();
}

function renderOfflineCard() {
    const raw = localStorage.getItem(OFFLINE_STATE_KEY);
    const state = raw ? JSON.parse(raw) : null;

    offlinePrompt.classList.add('hidden');
    offlineProgress.classList.add('hidden');
    offlineComplete.classList.add('hidden');

    const downloaded = (state && state.translations) || [];

    if (state && state.completed && downloaded.length > 0) {
        offlineComplete.classList.remove('hidden');
        offlineLabel.textContent = 'Offline Reading';

        const labels = downloaded
            .map(id => (TRANSLATIONS[id]?.label || id))
            .join(', ');
        offlineCompleteText.textContent = `Available offline: ${labels}`;

        if (state.completedAt) {
            const d = new Date(state.completedAt);
            const dateStr = d.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const sizeMb = (downloaded.length * 4.5).toFixed(1);
            offlineMetaText.textContent = `Downloaded ${dateStr} · ~${sizeMb} MB`;
        }
    } else {
        offlinePrompt.classList.remove('hidden');
        offlineLabel.textContent = 'Offline Reading';

        const checkboxes = offlinePrompt.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = (cb.value === currentTranslation);
        });

        if (!renderOfflineCard._wired) {
            checkboxes.forEach(cb => cb.addEventListener('change', updateDownloadButtonLabel));
            renderOfflineCard._wired = true;
        }

        updateDownloadButtonLabel();
    }

    refreshLucideIcons();
}

downloadAllBtn.addEventListener('click', downloadSelectedTranslations);
redownloadBtn.addEventListener('click', () => {
    localStorage.removeItem(OFFLINE_STATE_KEY);
    renderOfflineCard();
});

// ============================================================
// ===== Reading settings =====================================
// ============================================================
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
    startScreenSelect.value = settings.startScreen;

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
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
startScreenSelect.addEventListener('change', e => {
    settings.startScreen = e.target.value;
    applySettings();
});
resetSettingsBtn.addEventListener('click', () => {
    settings = { ...DEFAULT_SETTINGS };
    applySettings();
    showToast('Settings reset');
});

// ============================================================
// ===== URL hash routing =====================================
// ============================================================
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

    showReader();

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
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

BOOK_NAMES.forEach(book => {
    const opt = document.createElement('option');
    opt.value = book;
    opt.textContent = BOOK_ABBREV[book] || book;
    opt.title = book;
    bookSelect.appendChild(opt);
});

function fillChapters(book) {
    chapterSelect.innerHTML = '';
    const count = BOOKS[book]?.chapters || 1;
    for (let i = 1; i <= count; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        opt.title = `Chapter ${i}`;
        chapterSelect.appendChild(opt);
    }
}

TRANSLATION_IDS.forEach(id => {
    const t = TRANSLATIONS[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = TRANSLATION_SHORT[id] || t.label;
    opt.title = `${t.label} — ${t.fullName}`;
    translationSelect.appendChild(opt);
});
translationSelect.value = currentTranslation;

translationSelect.addEventListener('change', async e => {
    currentTranslation = e.target.value;
    localStorage.setItem(TRANSLATION_KEY, currentTranslation);

    allBooksLoaded = false;
    updateContinueCard();

    if (!homeScreen.classList.contains('hidden')) return;
    await loadChapter(currentBook, currentChapter);

    showToast(`Switched to ${getCurrentTranslation().label}`);
});

// ============================================================
// ===== Load a chapter =======================================
// ============================================================
async function loadChapter(book, chapter) {
    readerMain.innerHTML = '<p class="loading">Loading…</p>';
    hideVerseToolbar();
    selectedVerseEl = null;
    selectedVerseKey = null;

    const file = BOOKS[book]?.file;
    if (!file) {
        readerMain.innerHTML = '<p class="error">Unknown book.</p>';
        return;
    }

    try {
        if (!bibleCache[currentTranslation]) bibleCache[currentTranslation] = {};
        let bookData = bibleCache[currentTranslation][book];

        if (!bookData) {
            const url = dataUrl(currentTranslation, file);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            bookData = await res.json();
            bibleCache[currentTranslation][book] = bookData;
        }

        const verses = bookData[String(chapter)];
        if (!verses || verses.length === 0) {
            readerMain.innerHTML = '<p class="error">No verses found.</p>';
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
        readerMain.innerHTML = html;

        readerMain.querySelectorAll('.verse').forEach(el => {
            el.addEventListener('click', onVerseClick);
        });

        localStorage.setItem('book', book);
        localStorage.setItem('chapter', chapter);
        updateHash(book, chapter);
        trackChapterRead(book, chapter);

        window.scrollTo({ top: 0, behavior: 'auto' });
        resetHeaderState();

    } catch (err) {
        console.error(err);
        readerMain.innerHTML = `<p class="error">Failed to load: ${err.message}</p>`;
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
    loadChapter(bk, ch);
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
    loadChapter(bk, ch);
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
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    refreshLucideIcons();
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
    readerMain.querySelectorAll('.verse.selected').forEach(v => v.classList.remove('selected'));

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

vtBookmark.addEventListener('click', () => {
    if (!selectedVerseKey || !selectedVerseEl) return;
    const ann = annotations[selectedVerseKey] || {};
    ann.bookmarked = !ann.bookmarked;
    if (!ann.bookmarked && !ann.color) delete annotations[selectedVerseKey];
    else annotations[selectedVerseKey] = ann;
    saveAnnotations();
    selectedVerseEl.classList.toggle('bookmarked', !!ann.bookmarked);
    vtBookmark.classList.toggle('active', !!ann.bookmarked);
    showToast(ann.bookmarked ? 'Bookmarked' : 'Bookmark removed');
});

vtCopy.addEventListener('click', async () => {
    if (!selectedVerseEl) return;
    const book = selectedVerseEl.dataset.book;
    const chapter = selectedVerseEl.dataset.chapter;
    const verse = selectedVerseEl.dataset.verse;

    const clone = selectedVerseEl.cloneNode(true);
    const numSpan = clone.querySelector('.verse-num');
    if (numSpan) numSpan.remove();
    const text = clone.textContent.trim();

    const t = getCurrentTranslation();
    const formatted = `${book} ${chapter}:${verse} — ${text} (${t.label})`;

    try {
        await navigator.clipboard.writeText(formatted);
        showToast('Copied verse');
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = formatted;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied verse');
    }
});

vtLink.addEventListener('click', async () => {
    if (!selectedVerseEl) return;
    const book = selectedVerseEl.dataset.book;
    const chapter = selectedVerseEl.dataset.chapter;
    const verse = selectedVerseEl.dataset.verse;

    const url = `${window.location.origin}${window.location.pathname}#${slugifyBook(book)}/${chapter}/${verse}`;

    try {
        await navigator.clipboard.writeText(url);
        showToast('Link copied');
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Link copied');
    }
});

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
        updateHomeStats();
    });
});

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
    updateHomeStats();
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
        bookmarksList.innerHTML = '<p class="empty-state">No bookmarks yet.<br><br>Click any verse and tap the bookmark icon to save it.</p>';
        return;
    }

    bookmarksList.innerHTML = entries.map(({ key, book, chapter, verse, ann }) => {
        let text = '';
        const cache = bibleCache[currentTranslation] || {};
        if (cache[book] && cache[book][String(chapter)]) {
            text = cache[book][String(chapter)][verse - 1] || '';
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
        const colorBorder = ann.color ? 'var(--gold)' : 'transparent';

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
            updateHomeStats();
        });
    });
}

bookmarksBtn.addEventListener('click', e => {
    e.stopPropagation();
    closeAllPanels('bookmarks');
    renderBookmarks();
    bookmarksPanel.classList.remove('hidden');
});

closeBookmarksBtn.addEventListener('click', () => bookmarksPanel.classList.add('hidden'));

settingsBtn.addEventListener('click', e => {
    e.stopPropagation();
    closeAllPanels('settings');
    settingsPanel.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => settingsPanel.classList.add('hidden'));

homeAboutBtn.addEventListener('click', () => {
    closeAllPanels('about');
    aboutPanel.classList.remove('hidden');
});

closeAboutBtn.addEventListener('click', () => aboutPanel.classList.add('hidden'));

document.addEventListener('click', e => {
    const insideBookmarks = bookmarksPanel.contains(e.target);
    const insideSettings = settingsPanel.contains(e.target);
    const insideSearch = searchResults.contains(e.target);
    const insideAbout = aboutPanel.contains(e.target);

    if (insideBookmarks || insideSettings || insideSearch || insideAbout) return;
    if (e.target.closest('#bookmarksBtn')) return;
    if (e.target.closest('#settingsBtn')) return;
    if (e.target.closest('#homeAboutBtn')) return;

    closeAllPanels();
});

// ============================================================
// ===== Search ===============================================
// ============================================================
async function ensureBookLoaded(bookName, translationId) {
    const tId = translationId || currentTranslation;
    if (!bibleCache[tId]) bibleCache[tId] = {};
    if (bibleCache[tId][bookName]) return bibleCache[tId][bookName];

    const file = BOOKS[bookName].file;
    const url = dataUrl(tId, file);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${bookName}`);
    const data = await res.json();
    bibleCache[tId][bookName] = data;
    return data;
}

async function loadAllBooks(onProgress) {
    if (allBooksLoaded) return;
    let done = 0;
    const total = BOOK_NAMES.length;
    for (const book of BOOK_NAMES) {
        if (!bibleCache[currentTranslation]?.[book]) {
            try { await ensureBookLoaded(book, currentTranslation); }
            catch (err) { console.warn(`Skipping ${book}:`, err.message); }
        }
        done++;
        if (onProgress) onProgress(done, total);
    }
    allBooksLoaded = true;
}

function highlightMatches(text, query) {
    const safe = escapeHtml(text);
    const normalizedQuery = normalizeForSearch(query);
    const normalizedText = normalizeForSearch(safe);
    let result = '';
    let i = 0;
    while (i < safe.length) {
        if (
            i + query.length <= safe.length &&
            normalizedText.substring(i, i + normalizedQuery.length) === normalizedQuery
        ) {
            result += '<mark>' + safe.substring(i, i + query.length) + '</mark>';
            i += query.length;
        } else {
            result += safe[i];
            i++;
        }
    }
    return result;
}

function performSearch(query) {
    const q = normalizeForSearch(query.trim());
    if (q.length < 2) {
        searchList.innerHTML = '<p class="search-progress">Type at least 2 characters.</p>';
        searchStatus.textContent = 'Search';
        return;
    }
    const results = [];
    const MAX_RESULTS = 300;

    const cache = bibleCache[currentTranslation] || {};

    outer:
    for (const book of BOOK_NAMES) {
        const bookData = cache[book];
        if (!bookData) continue;
        for (const chNum of Object.keys(bookData)) {
            const verses = bookData[chNum];
            for (let i = 0; i < verses.length; i++) {
                if (normalizeForSearch(verses[i]).includes(q)) {
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
    const t = getCurrentTranslation();
    searchStatus.textContent =
        `${results.length}${truncated ? '+' : ''} result${results.length === 1 ? '' : 's'} for “${query}” in ${t.label}`;

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

    showReader();

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
        const t = getCurrentTranslation();
        searchStatus.textContent = `Loading ${t.label}…`;
        searchList.innerHTML = `<p class="search-progress">First search downloads all 66 books for ${t.label}. One-time only.</p>`;
        await loadAllBooks((done, total) => {
            searchList.innerHTML = `<p class="search-progress">Loading… ${done} / ${total} books</p>`;
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

closeSearchBtn.addEventListener('click', () => searchResults.classList.add('hidden'));

// ============================================================
// ===== Home actions =========================================
// ============================================================
homeBtn.addEventListener('click', () => {
    showHome();
    history.replaceState(null, '', window.location.pathname);
});

startReadingBtn.addEventListener('click', () => {
    showReader();
    loadChapter(currentBook, currentChapter);
});

continueBtn.addEventListener('click', () => {
    showReader();
    loadChapter(currentBook, currentChapter);
});

homeSearchBtn.addEventListener('click', () => {
    showReader();
    setTimeout(() => searchInput.focus(), 100);
});

homeShareBtn.addEventListener('click', async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const shareData = {
        title: 'Oneness Bible',
        text: 'One with The Word — a beautiful, offline Bible reader in English, Yoruba, Igbo, and Hausa.',
        url
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            if (err.name !== 'AbortError') console.warn(err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(url);
            showToast('Link copied');
        } catch {
            showToast('Share: ' + url);
        }
    }
});

// ============================================================
// ===== Install prompt =======================================
// ============================================================
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;

    const dismissed = localStorage.getItem('installDismissedAt');
    const dayMs = 7 * 86400000;
    if (dismissed && Date.now() - parseInt(dismissed) < dayMs) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    installBanner.classList.remove('hidden');
});

installAcceptBtn.addEventListener('click', async () => {
    installBanner.classList.add('hidden');
    if (!deferredInstallPrompt) {
        showToast('Use Share → Add to Home Screen');
        return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') showToast('Installing…');
    deferredInstallPrompt = null;
});

installDismissBtn.addEventListener('click', () => {
    installBanner.classList.add('hidden');
    localStorage.setItem('installDismissedAt', Date.now().toString());
});

homeInstallBtn.addEventListener('click', () => {
    if (deferredInstallPrompt) {
        installAcceptBtn.click();
    } else if (window.matchMedia('(display-mode: standalone)').matches) {
        showToast('Already installed');
    } else {
        showToast('Share → Add to Home Screen');
    }
});

// ============================================================
// ===== Init =================================================
// ============================================================
(async function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    applySettings();
    updateStreakOnOpen();
    updateSearchPlaceholder();

    bookSelect.value = currentBook;
    fillChapters(currentBook);
    chapterSelect.value = currentChapter;

    await loadVotdList();

    const fromHash = parseHash();
    if (fromHash) {
        await handleHashChange();
    } else if (settings.startScreen === 'reader') {
        showReader();
        await loadChapter(currentBook, currentChapter);
    } else {
        showHome();
    }

    updateHomeStats();
    renderOfflineCard();
    refreshLucideIcons();
})();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('✅ SW now controlling the page');
    });
}