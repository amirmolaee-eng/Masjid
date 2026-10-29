# WebApp changes (October 2026)

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


## Homepage redesign and timetable download
- Homepage uses an explicit desktop two-column layout: prayer information and announcements stay in the left column; a mosque interior photo and donation button sit in the right column. Mobile stacks the columns.
- Replaced the live clock/countdown presentation with a static “Next Jama'at [prayer] [time]” label.
- Matched the Announcements heading size to Jumu'ah Prayer and set the type stack to Optima for headings/subheadings and Gill Sans for body text, with fallbacks when the fonts are not installed.
- Added the Timetable navigation link and `timetable.html`, which displays the bundled annual data and exports it to CSV. The downloadable year comes from `PRAYER_DATA_YEAR` in `prayer_data.js`.
- The linked OMF PNGs were inaccessible in this environment, so `OMF-Secondary-Myrtle.png` and `OMF-Primary-Myrtle.png` are prepared from the closest logo assets already bundled with the app. Swap these for the exact supplied PNGs when they are available locally.
