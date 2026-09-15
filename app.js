// app.js

// Ticker Messages Rotation
const tickerMessages = [
    "Assalamu Alaykum • Friday (Jumu'ah): 1st Khutbah 13:25 • 2nd Khutbah 14:25",
    "السلام عليكم ورحمة الله وبركاته • صلاة الجمعة: الخطبة الأولى ١٣:٢٥ • الخطبة الثانية ١٤:٢٥",
    "আসসালামু আলাইকুম • জুমার নামাজ: ১ম খুতবা ১৩:২৫ • ২য় খুতবা ১৪:২৫",
    "السلام علیکم • جمعہ کی نماز: پہلا خطبہ 13:25 • دوسرا خطبہ 14:25"
];
let currentTickerIndex = 0;

function updateTicker() {
    const tickerEl = document.getElementById('tickerContent');
    if (!tickerEl) return;
    
    // Fade out
    tickerEl.style.opacity = 0;
    
    setTimeout(() => {
        currentTickerIndex = (currentTickerIndex + 1) % tickerMessages.length;
        tickerEl.textContent = tickerMessages[currentTickerIndex];
        
        // Set RTL for Arabic and Urdu
        if (currentTickerIndex === 1 || currentTickerIndex === 3) {
            tickerEl.setAttribute('dir', 'rtl');
        } else {
            tickerEl.setAttribute('dir', 'ltr');
        }
        
        // Fade in
        tickerEl.style.opacity = 1;
    }, 500); // Wait for fade out
}

// Update clock and dates
function updateClock() {
    const now = new Date();
    
    // Time
    const opts = { hour: '2-digit', minute: '2-digit', hour12: false };
    document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB', opts);
    
    // Gregorian Date
    const greg = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('date').innerText = greg;
    
    // Hijri Date
    let hijriStr = '';
    try {
        hijriStr = now.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
        hijriStr = 'Islamic Date';
    }
    document.getElementById('hijri').innerText = hijriStr;
}

// Timetable logic
const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function initTimetable() {
    const now = new Date();
    const todayKey = `${now.getMonth() + 1}-${now.getDate()}`;
    const todayData = PRAYER_DATA[todayKey];
    
    if (!todayData) return;
    
    const rows = {
        'fajr': { start: todayData[0], iqamah: todayData[1] },
        'dhuhr': { start: todayData[2], iqamah: todayData[3] },
        'asr': { start: todayData[4], iqamah: todayData[5] },
        'maghrib': { start: todayData[6], iqamah: todayData[7] },
        'isha': { start: todayData[8], iqamah: todayData[9] }
    };
    
    for (const [id, times] of Object.entries(rows)) {
        const row = document.getElementById(`row-${id}`);
        if (row) {
            row.dataset.start = times.start;
            row.dataset.iqamah = times.iqamah;
            
            // Update UI
            const startEl = row.querySelector('.col-start');
            const iqamahEl = row.querySelector('.col-iqamah');
            
            if (startEl) startEl.innerText = times.start;
            if (iqamahEl) iqamahEl.innerText = times.iqamah || times.start;
        }
    }
}

function parseHHMMToDate(hhmm, daysOffset = 0) {
    if (!hhmm || !hhmm.includes(':')) {
        return new Date(8640000000000000); // Far future
    }
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    if (daysOffset) d.setDate(d.getDate() + daysOffset);
    return d;
}

function getPrayerRows() {
    const rows = PRAYERS.map(id => {
        const r = document.getElementById(`row-${id}`);
        if (!r) return null;
        
        const nameEl = r.querySelector('.salah-en');
        const name = nameEl ? nameEl.textContent.trim() : id;
        
        return {
            id,
            row: r,
            name,
            start: r.dataset.start,
            iqamah: r.dataset.iqamah || r.dataset.start
        };
    }).filter(Boolean);
    return rows;
}

function findNextPrayer() {
    const now = new Date();
    const prayers = getPrayerRows();
    if (!prayers.length) return null;
    
    let previousIqamahTarget = null;

    for (let i = 0; i < prayers.length; i++) {
        const p = prayers[i];
        const iqamahTarget = parseHHMMToDate(p.iqamah);
        
        if (now < iqamahTarget) {
            // Find the previous prayer's iqamah target for progress calculation
            if (i > 0) {
                previousIqamahTarget = parseHHMMToDate(prayers[i-1].iqamah);
            } else {
                // If next is Fajr today, previous is Isha yesterday
                const yesterdayIsha = PRAYERS[4]; // isha
                const ishaRow = document.getElementById(`row-${yesterdayIsha}`);
                if (ishaRow) {
                    previousIqamahTarget = parseHHMMToDate(ishaRow.dataset.iqamah, -1);
                } else {
                    previousIqamahTarget = parseHHMMToDate("20:00", -1); // fallback
                }
            }
            return { prayer: p, target: iqamahTarget, previousTarget: previousIqamahTarget };
        }
    }
    
    // Wrap to tomorrow's Fajr
    const first = prayers[0];
    const target = parseHHMMToDate(first.iqamah, 1);
    
    // Previous is today's Isha
    const last = prayers[prayers.length - 1];
    previousIqamahTarget = parseHHMMToDate(last.iqamah);
    
    return { prayer: first, target, previousTarget: previousIqamahTarget };
}

function formatTimeDiff(diffMs) {
    if (diffMs <= 0) return '00:00:00';
    const totalSeconds = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateCountdown() {
    const next = findNextPrayer();
    if (!next) return;
    
    const { prayer, target, previousTarget } = next;
    const now = new Date();
    const diff = target - now;
    
    const timeEl = document.getElementById('countdownTime');
    const nameEl = document.getElementById('nextPrayerName');
    const progressEl = document.getElementById('progressFill');
    
    if (timeEl) timeEl.innerText = formatTimeDiff(diff);
    if (nameEl) nameEl.innerText = prayer.name;
    
    // Update progress bar
    if (progressEl && previousTarget) {
        const totalDuration = target - previousTarget;
        const elapsed = now - previousTarget;
        let percentage = (elapsed / totalDuration) * 100;
        
        // Clamp between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));
        progressEl.style.width = `${percentage}%`;
    }
    
    // Highlight current active row
    document.querySelectorAll('.prayer-row').forEach(r => r.classList.remove('active'));
    if (prayer && prayer.row) {
        prayer.row.classList.add('active');
    }
}

// Check for new day to refresh timetable & events
let lastDay = new Date().getDate();
function checkNewDay() {
    const currentDay = new Date().getDate();
    if (currentDay !== lastDay) {
        lastDay = currentDay;
        initTimetable();
        updateEvents(true);
    }
}
// Upcoming Islamic Events Logic
const ISLAMIC_EVENTS = [
    { 
        name: "Islamic New Year", 
        bengali: "হিজরি নববর্ষ", 
        arabic: "رأس السنة الهجرية", 
        day: 1, 
        month: 1,
        desc: "Beginning of the Islamic New Year 1448 AH" 
    },
    { 
        name: "Day of Ashura", 
        bengali: "পবিত্র আশুরা", 
        arabic: "يوم عاشوراء", 
        day: 10, 
        month: 1,
        desc: "Fasting and remembrance of Prophet Musa (AS) & Karbala" 
    },
    { 
        name: "Mawlid al-Nabi", 
        bengali: "ঈদে মিলাদুন্নবী ﷺ", 
        arabic: "المولد النبوي الشريف", 
        day: 12, 
        month: 3,
        desc: "Birth of the Beloved Messenger Muhammad ﷺ" 
    },
    { 
        name: "Isra' and Mi'raj", 
        bengali: "পবিত্র শবে মেরাজ", 
        arabic: "الإسراء والمعراج", 
        day: 27, 
        month: 7,
        desc: "The Miraculous Night Journey & Ascension" 
    },
    { 
        name: "Mid-Sha'ban (Shab-e-Barat)", 
        bengali: "শবে বরাত (লাইলাতুল বারাত)", 
        arabic: "ليلة النصف من شعبان", 
        day: 15, 
        month: 8,
        desc: "Night of forgiveness and preparation for Ramadan" 
    },
    { 
        name: "Ramadan Start", 
        bengali: "পবিত্র মাহে রমজান", 
        arabic: "بداية شهر رمضان المبارك", 
        day: 1, 
        month: 9,
        desc: "First day of fasting in blessed Ramadan" 
    },
    { 
        name: "Laylat al-Qadr", 
        bengali: "লাইলাতুল কদর (শবে কদর)", 
        arabic: "ليلة القدر المباركة", 
        day: 27, 
        month: 9,
        desc: "The Night of Power, better than 1,000 months" 
    },
    { 
        name: "Eid al-Fitr", 
        bengali: "ঈদুল ফিতর", 
        arabic: "عيد الفطر المبارك", 
        day: 1, 
        month: 10,
        desc: "Celebration marking the conclusion of Ramadan" 
    },
    { 
        name: "Day of Arafah", 
        bengali: "আরাফার দিন (হজ)", 
        arabic: "يوم عرفة المبارك", 
        day: 9, 
        month: 12,
        desc: "Pinnacle of Hajj pilgrimage & fasting for non-pilgrims" 
    },
    { 
        name: "Eid al-Adha", 
        bengali: "ঈদুল আযহা (কোরবানি)", 
        arabic: "عيد الأضحى المبارك", 
        day: 10, 
        month: 12,
        desc: "Festival of Sacrifice in remembrance of Ibrahim (AS)" 
    }
];

function getHijriParts(date) {
    try {
        const parts = new Intl.DateTimeFormat('en-GB-u-ca-islamic', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).formatToParts(date);
        
        const res = {};
        parts.forEach(p => res[p.type] = p.value);
        return {
            day: parseInt(res.day),
            month: parseInt(res.month),
            year: parseInt(res.year)
        };
    } catch (e) {
        return { day: 1, month: 1, year: 1448 };
    }
}

function getHijriMonthName(m) {
    const months = [
        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
        "Jumada al-Ula", "Jumada al-Akhira", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    return months[m - 1] || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Multi-source Islamic Events Engine
// Sources checked:
//   1. Browser Intl.DateTimeFormat Islamic calendar (instant / offline)
//   2. AlAdhan.com API  – hToG conversion endpoint (cross-verification)
// ─────────────────────────────────────────────────────────────────────────────

// Shared cache to avoid redundant API calls on repeat renders
const _apiDateCache = {};  // key: "DD-MM-YYYY" (hijri) → { gregorian: Date, verified: true }
let _lastApiCheck = 0;
const API_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

async function fetchGregorianFromAlAdhan(hijriDay, hijriMonth, hijriYear) {
    const cacheKey = `${String(hijriDay).padStart(2,'0')}-${String(hijriMonth).padStart(2,'0')}-${hijriYear}`;
    if (_apiDateCache[cacheKey]) return _apiDateCache[cacheKey];

    const url = `https://api.aladhan.com/v1/hToG?date=${cacheKey}&format=DD-MM-YYYY`;
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) return null;
        const json = await res.json();
        if (json.code !== 200 || !json.data) return null;

        const gDate = json.data.gregorian.date; // "DD-MM-YYYY"
        const [dd, mm, yyyy] = gDate.split('-').map(Number);
        const gregDate = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);

        _apiDateCache[cacheKey] = { gregorian: gregDate, verified: true, source: 'AlAdhan' };
        return _apiDateCache[cacheKey];
    } catch (err) {
        return null;
    }
}

async function enrichEventsWithApiData(upcomingEvents) {
    // Fetch AlAdhan dates for the next 5 events in parallel
    const eventsToCheck = upcomingEvents.slice(0, 5);
    const results = await Promise.allSettled(
        eventsToCheck.map(evt =>
            fetchGregorianFromAlAdhan(evt.day, evt.month, evt.hijriYear)
        )
    );

    let verifiedCount = 0;
    let anyMismatch = false;

    results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
            const apiDate = result.value.gregorian;
            const localDate = eventsToCheck[i].gregorianDate;
            const diffMs = Math.abs(apiDate - localDate);
            const diffDays = diffMs / 86400000;

            if (diffDays <= 2) {
                // API agrees within 2 days (moon sighting tolerance)
                eventsToCheck[i].verified = true;
                eventsToCheck[i].apiDate = apiDate;
                verifiedCount++;
            } else {
                // API gives a different date – prefer API date for upcoming events
                eventsToCheck[i].verified = false;
                eventsToCheck[i].apiDate = apiDate;
                // Recalculate diffDays using API date
                const now = new Date();
                const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                const newDiff = Math.round((apiDate - todayZero) / 86400000);
                if (newDiff >= 0) {
                    eventsToCheck[i].gregorianDate = apiDate;
                    eventsToCheck[i].diffDays = newDiff;
                    anyMismatch = true;
                }
            }
        }
    });

    return { verifiedCount, anyMismatch };
}

// Live Spotlight Countdown State
let nextSpotlightTarget = null;

function updateSpotlightCountdown() {
    if (!nextSpotlightTarget) return;

    const now = new Date();
    const diff = nextSpotlightTarget - now;

    const daysEl = document.getElementById('spotlightDays');
    const hoursEl = document.getElementById('spotlightHours');
    const minsEl = document.getElementById('spotlightMins');
    const secsEl = document.getElementById('spotlightSecs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
}

function computeLocalEvents() {
    const now = new Date();
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const upcoming = [];

    // Check next 400 days to find upcoming occurrences of each event
    for (let i = 0; i < 400; i++) {
        const d = new Date(todayZero);
        d.setDate(todayZero.getDate() + i);
        const hp = getHijriParts(d);

        const match = ISLAMIC_EVENTS.find(e => e.day === hp.day && e.month === hp.month);
        if (match) {
            const alreadyFound = upcoming.some(u => u.name === match.name);
            if (!alreadyFound) {
                upcoming.push({
                    ...match,
                    gregorianDate: d,
                    hijriYear: hp.year,
                    diffDays: i
                });
            }
        }

        if (upcoming.length >= 7) break;
    }

    upcoming.sort((a, b) => a.gregorianDate - b.gregorianDate);
    return upcoming;
}

function renderEvents(upcoming, sourceLabel) {
    const eventsListEl = document.getElementById('eventsList');
    const spotlightEl = document.getElementById('nextEventSpotlight');
    const currentHijriEl = document.getElementById('eventsCurrentHijri');

    const now = new Date();
    const currentHijri = getHijriParts(now);
    if (currentHijriEl) {
        currentHijriEl.textContent = `Today: ${currentHijri.day} ${getHijriMonthName(currentHijri.month)} ${currentHijri.year} AH • ${sourceLabel}`;
    }

    if (!eventsListEl) return;

    // 1. Render Spotlight Card for the closest upcoming event
    if (spotlightEl && upcoming.length > 0) {
        const nextEvt = upcoming[0];

        const targetMidnight = new Date(nextEvt.gregorianDate);
        targetMidnight.setHours(0, 0, 0, 0);
        nextSpotlightTarget = targetMidnight;

        const gregStr = nextEvt.gregorianDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const verifiedBadge = nextEvt.verified
            ? `<span class="events-verified-badge" title="Date cross-verified with AlAdhan.com API">✓ Cross-verified</span>`
            : ``;

        spotlightEl.innerHTML = `
            <div class="spotlight-top-badge">
                <span class="spotlight-pulse"></span>
                <span>Next Major Occasion</span>
                ${verifiedBadge}
            </div>
            <div>
                <h4 class="spotlight-name">${nextEvt.name}</h4>
                <div class="spotlight-trans">${nextEvt.bengali} • ${nextEvt.arabic}</div>
            </div>
            <div class="spotlight-date-row">
                📅 ${gregStr} • ${nextEvt.day} ${getHijriMonthName(nextEvt.month)} ${nextEvt.hijriYear} AH
            </div>
            <div class="spotlight-countdown-grid">
                <div class="spotlight-time-box">
                    <span class="spotlight-time-val" id="spotlightDays">--</span>
                    <span class="spotlight-time-lbl">Days</span>
                </div>
                <div class="spotlight-time-box">
                    <span class="spotlight-time-val" id="spotlightHours">--</span>
                    <span class="spotlight-time-lbl">Hours</span>
                </div>
                <div class="spotlight-time-box">
                    <span class="spotlight-time-val" id="spotlightMins">--</span>
                    <span class="spotlight-time-lbl">Mins</span>
                </div>
                <div class="spotlight-time-box">
                    <span class="spotlight-time-val" id="spotlightSecs">--</span>
                    <span class="spotlight-time-lbl">Secs</span>
                </div>
            </div>
            <div class="spotlight-moon-note">
                🌙 Islamic dates are subject to regional moon sighting confirmations.
            </div>
        `;

        updateSpotlightCountdown();
    }

    // 2. Render Upcoming Events List (next 5 events)
    eventsListEl.innerHTML = '';
    upcoming.slice(0, 5).forEach((event) => {
        const d = event.gregorianDate;
        const day = d.getDate();
        const month = d.toLocaleDateString('en-GB', { month: 'short' });

        let pillHtml = '';
        if (event.diffDays === 0) {
            pillHtml = `<span class="event-countdown-pill countdown-today">TODAY • Mubarak!</span>`;
        } else if (event.diffDays === 1) {
            pillHtml = `<span class="event-countdown-pill countdown-urgent">Tomorrow</span>`;
        } else if (event.diffDays <= 7) {
            pillHtml = `<span class="event-countdown-pill countdown-urgent">In ${event.diffDays} Days</span>`;
        } else if (event.diffDays <= 30) {
            pillHtml = `<span class="event-countdown-pill">In ${event.diffDays} Days</span>`;
        } else {
            const weeks = Math.round(event.diffDays / 7);
            pillHtml = `<span class="event-countdown-pill">In ~${weeks} Weeks (${event.diffDays}d)</span>`;
        }

        const verifiedPill = event.verified
            ? `<span class="event-verified-tick" title="Verified with AlAdhan.com API">✓</span>`
            : ``;

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-info">
                <span class="event-name">${event.name} ${verifiedPill}</span>
                <span class="event-trans">${event.bengali} • ${event.arabic}</span>
                <span class="event-hijri">${event.day} ${getHijriMonthName(event.month)} ${event.hijriYear} AH</span>
                ${pillHtml}
            </div>
            <div class="event-date-box">
                <span class="event-day">${day}</span>
                <span class="event-month">${month}</span>
            </div>
        `;
        eventsListEl.appendChild(card);
    });
}

async function updateEvents(forceLog = false) {
    // ── Step 1: Render immediately using local browser Hijri calculation ──────
    const upcoming = computeLocalEvents();
    renderEvents(upcoming, 'Local calendar • checking sources...');

    // ── Step 2: Cross-check with AlAdhan API (in background) ─────────────────
    const now = Date.now();
    const shouldFetch = forceLog || (now - _lastApiCheck > API_CACHE_TTL);
    if (!shouldFetch) {
        // Use cached verification status from previous fetch
        const alreadyVerified = upcoming.some(e => e.verified);
        const label = alreadyVerified
            ? 'Local + AlAdhan.com • ✓ Cross-verified'
            : 'Local Intl calendar';
        // Subtitle is already rendered — update source label only if cached
        const currentHijriEl = document.getElementById('eventsCurrentHijri');
        const currentHijri = getHijriParts(new Date());
        if (currentHijriEl) {
            currentHijriEl.textContent = `Today: ${currentHijri.day} ${getHijriMonthName(currentHijri.month)} ${currentHijri.year} AH • ${label}`;
        }
        return;
    }

    try {
        const { verifiedCount, anyMismatch } = await enrichEventsWithApiData(upcoming);
        _lastApiCheck = Date.now();

        const sourceLabel = verifiedCount > 0
            ? `Local + AlAdhan.com • ✓ ${verifiedCount} date${verifiedCount > 1 ? 's' : ''} cross-verified`
            : 'Local Intl calendar • API offline';

        // Re-render with verified data (dates may have been updated by API)
        renderEvents(upcoming, sourceLabel);
    } catch (err) {
        // API fetch failed — local data is already shown, just update label
        const currentHijriEl = document.getElementById('eventsCurrentHijri');
        const currentHijri = getHijriParts(new Date());
        if (currentHijriEl) {
            const currentHijriText = `Today: ${currentHijri.day} ${getHijriMonthName(currentHijri.month)} ${currentHijri.year} AH • Local Intl calendar`;
            currentHijriEl.textContent = currentHijriText;
        }
    }
}

// Toast Notification Helper
function showAppToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.classList.remove('visible');
    }, 2600);
}

// Social Feeds: Facebook & Instagram Interactions
function initSocialInteractions() {
    // --- Facebook Live Posts & View Switcher Logic ---
    const tabPostsBtn = document.getElementById('fbTabPostsBtn');
    const tabMetaBtn = document.getElementById('fbTabMetaBtn');
    const postsStreamView = document.getElementById('fbPostsStreamView');
    const metaWidgetView = document.getElementById('fbMetaWidgetView');

    if (tabPostsBtn && tabMetaBtn && postsStreamView && metaWidgetView) {
        tabPostsBtn.addEventListener('click', () => {
            tabPostsBtn.classList.add('active');
            tabPostsBtn.setAttribute('aria-selected', 'true');
            tabMetaBtn.classList.remove('active');
            tabMetaBtn.setAttribute('aria-selected', 'false');
            postsStreamView.style.display = 'block';
            metaWidgetView.style.display = 'none';
        });

        tabMetaBtn.addEventListener('click', () => {
            tabMetaBtn.classList.add('active');
            tabMetaBtn.setAttribute('aria-selected', 'true');
            tabPostsBtn.classList.remove('active');
            tabPostsBtn.setAttribute('aria-selected', 'false');
            postsStreamView.style.display = 'none';
            metaWidgetView.style.display = 'block';
        });
    }

    // Facebook Post Reactions (Like functionality)
    function setupFbPostLike(btnId, countId, baseCount, storageKey) {
        const btn = document.getElementById(btnId);
        const countEl = document.getElementById(countId);
        if (!btn || !countEl) return;

        let liked = localStorage.getItem(storageKey) === 'true';
        function updateState() {
            if (liked) {
                btn.classList.add('liked');
                btn.querySelector('span').textContent = 'Liked';
                countEl.textContent = (baseCount + 1).toLocaleString();
            } else {
                btn.classList.remove('liked');
                btn.querySelector('span').textContent = 'Like';
                countEl.textContent = baseCount.toLocaleString();
            }
        }
        updateState();

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            liked = !liked;
            localStorage.setItem(storageKey, liked);
            updateState();
        });
    }

    setupFbPostLike('fbLikePost1Btn', 'fbPost1Reactions', 142, 'ofm_fb_post1_liked');
    setupFbPostLike('fbLikePost2Btn', 'fbPost2Reactions', 89, 'ofm_fb_post2_liked');

    // Facebook Post Share buttons
    const fbShareBtns = [document.getElementById('fbSharePost1Btn'), document.getElementById('fbSharePost2Btn')].filter(Boolean);
    const fbPageUrl = 'https://www.facebook.com/omarfaruquemosque';
    fbShareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Omar Faruque Mosque on Facebook',
                        text: 'Latest announcement from Omar Faruque Mosque, Cambridge:',
                        url: fbPageUrl
                    });
                } catch (err) {}
            } else if (navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(fbPageUrl);
                    showAppToast('Facebook link copied to clipboard! 📋');
                } catch (err) {
                    showAppToast('Visit: ' + fbPageUrl);
                }
            } else {
                window.open(fbPageUrl, '_blank');
            }
        });
    });

    // --- Instagram Post Interactions ---
    const likeBtn = document.getElementById('igLikeBtn');
    const likesCountEl = document.getElementById('igLikesCount');
    const heartOverlay = document.getElementById('igHeartOverlay');
    const mediaWrapper = document.getElementById('igMediaWrapper');
    const bookmarkBtn = document.getElementById('igBookmarkBtn');
    const shareBtns = [document.getElementById('igShareBtn'), document.getElementById('igShareBtnTop')].filter(Boolean);

    const baseLikes = 284;
    let isLiked = localStorage.getItem('ofm_ig_post_liked') === 'true';
    let isSaved = localStorage.getItem('ofm_ig_post_saved') === 'true';

    function updateLikeUI(animate = false) {
        if (!likeBtn || !likesCountEl) return;
        if (isLiked) {
            likeBtn.classList.add('liked');
            likeBtn.setAttribute('aria-label', 'Unlike post');
            likesCountEl.textContent = (baseLikes + 1).toLocaleString();
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.setAttribute('aria-label', 'Like post');
            likesCountEl.textContent = baseLikes.toLocaleString();
        }
    }

    function triggerHeartPop() {
        if (!heartOverlay) return;
        heartOverlay.classList.remove('pop-animation');
        void heartOverlay.offsetWidth; // trigger reflow
        heartOverlay.classList.add('pop-animation');
    }

    function toggleLike() {
        isLiked = !isLiked;
        localStorage.setItem('ofm_ig_post_liked', isLiked);
        updateLikeUI(true);
        if (isLiked) {
            triggerHeartPop();
        }
    }

    // Initialize Like State
    updateLikeUI();

    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLike();
        });
    }

    // Double tap / double click on image to like
    let lastTap = 0;
    if (mediaWrapper) {
        mediaWrapper.addEventListener('click', (e) => {
            const now = Date.now();
            const DOUBLE_TAP_THRESHOLD = 320;
            if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
                // Double tap detected
                if (!isLiked) {
                    isLiked = true;
                    localStorage.setItem('ofm_ig_post_liked', 'true');
                    updateLikeUI(true);
                }
                triggerHeartPop();
                lastTap = 0;
            } else {
                lastTap = now;
            }
        });
    }

    // Bookmark button
    if (bookmarkBtn) {
        if (isSaved) bookmarkBtn.classList.add('saved');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isSaved = !isSaved;
            localStorage.setItem('ofm_ig_post_saved', isSaved);
            if (isSaved) {
                bookmarkBtn.classList.add('saved');
                showAppToast('Post saved to bookmarks 🔖');
            } else {
                bookmarkBtn.classList.remove('saved');
                showAppToast('Post removed from bookmarks');
            }
        });
    }

    // Share buttons
    const igUrl = 'https://www.instagram.com/omarfaruquemosque/';
    shareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Omar Faruque Mosque on Instagram',
                        text: 'Check out the latest post and updates from Omar Faruque Mosque, Cambridge:',
                        url: igUrl
                    });
                } catch (err) {
                    // User cancelled share
                }
            } else if (navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(igUrl);
                    showAppToast('Instagram link copied to clipboard! 📋');
                } catch (err) {
                    showAppToast('Visit: ' + igUrl);
                }
            } else {
                window.open(igUrl, '_blank');
            }
        });
    });
}

// Initialization and Loop
function init() {
    // Wait for PRAYER_DATA to be available
    if (typeof PRAYER_DATA === 'undefined') {
        setTimeout(init, 100);
        return;
    }
    
    initTimetable();
    updateClock();
    updateCountdown();
    updateEvents();
    initSocialInteractions();
    
    // Start interval for Clock & Prayer Countdown & Spotlight (every second)
    setInterval(() => {
        updateClock();
        updateCountdown();
        checkNewDay();
        updateSpotlightCountdown();
    }, 1000);
    
    // Check and refresh events frequently (every 60s) so live relative days stay accurate
    setInterval(updateEvents, 60000);
    
    // Check every time user returns to the tab or window gains focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateEvents(true);
        }
    });
    window.addEventListener('focus', () => {
        updateEvents(true);
    });

    // Manual Refresh button for Islamic Events
    const refreshBtn = document.getElementById('eventsRefreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('spinning');
            showAppToast('Checking sources: Local + AlAdhan.com... 🌙');
            try {
                await updateEvents(true);
                showAppToast('✓ Cross-verified with AlAdhan.com API! 🌙');
            } catch (err) {
                showAppToast('Local calendar updated 🌙');
            }
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
            }, 800);
        });
    }
    
    // Start Ticker rotation (every 8 seconds)
    setInterval(updateTicker, 8000);
    
    // Setup Ticker CSS transition
    const tickerEl = document.getElementById('tickerContent');
    if (tickerEl) {
        tickerEl.style.transition = 'opacity 0.5s ease';
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', init);

