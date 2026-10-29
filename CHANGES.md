# WebApp changes (October 2026)

## Round 3 (late October 2026)
- Brand typography: main headers Optima Bold, sub-headers Optima Regular, body Gill Sans Regular. These are commercial fonts, so the site uses system font stacks (Optima/Gill Sans render natively on Apple devices; Candara/Segoe UI are the Windows/Android stand-ins). If you later get web-licensed font files, put them in `fonts/` and add @font-face rules.
- New logos from the brand guidelines: `OMF-Secondary-Myrtle.png` fills the white menu bar height (all pages); `OMF-Primary-Myrtle.png` replaces the old circular emblem in the home header.
- Home page: the clock and countdown are gone. It now shows "Next Jama'at" with the prayer name and time (e.g. "Asr 15:30"), including the two Jumu'ah Khutbahs on Fridays.
- Home page layout: on desktop the content sits in a left column; the right column has the mosque photo with the Donate button underneath it. Announcements stay in a single column.
- New "Timetable" link in the top menu (all pages) → `timetable.html`, a full-year prayer times page with month tabs and downloads: `OMF-Prayer-Times-2026.pdf` (one page per month, Jumu'ah highlighted) and `OMF-Prayer-Times-2026.csv`, both generated from `prayer_data.js`. When you load a new year's timetable, regenerate these two files (or ask for them to be regenerated).
- Files added: `OMF-Primary-Myrtle.png`, `OMF-Secondary-Myrtle.png`, `timetable.html`, `timetable.js`, `OMF-Prayer-Times-2026.pdf`, `OMF-Prayer-Times-2026.csv`.


## Where to edit things
| What | File |
|---|---|
| Jumu'ah Khutbah times (summer / winter) | `jumuah-times.js` - the only place; home card, ticker and Jumu'ah page all read it |
| Announcements | `announcements-data.js` |
| Prayer timetable | `prayer_data.js` (and change `PRAYER_DATA_YEAR` when you load a new year) |
| Colours / fonts / sizes added this round | `overrides.css` |

## Switching sections back on
Remove the word `hidden` from the section in `index.html`:
`islamicEventsSection`, `facebookFeedSection`, `instagramFeedSection`.
(While hidden they make no network requests. The Facebook SDK script is commented out near the top of the page.)

## Added in round 2
- Jumu'ah is 12:25 and 13:25 from the clock change onwards (winter times). The summer pair in `jumuah-times.js` (13:25 / 14:25) only applies from the end of March, when the UK goes back on BST. Change it there if the summer times are different.
- Fonts are now hosted in `fonts/` (open licence), so the site no longer contacts Google Fonts.
- Favicon, home-screen icons (`icons/`), `manifest.webmanifest` and social-preview tags on every page.
- `privacy.html` (Privacy & cookies), linked from the footer. Please have a trustee read it before publishing.
- Location page: the Google map loads only after a visitor clicks "Show map".

## Files
New: `jumuah-times.js`, `overrides.css`, `announcements.html`, `announcements.js`, `announcements-data.js`, `site-tweaks.js`
Changed: every `.html` page, `app.js`, `nav.js`, `prayer_data.js`, `styles.css` (dark-mode rules removed)
