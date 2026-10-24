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

## Files
New: `jumuah-times.js`, `overrides.css`, `announcements.html`, `announcements.js`, `announcements-data.js`, `site-tweaks.js`
Changed: every `.html` page, `app.js`, `nav.js`, `prayer_data.js`, `styles.css` (dark-mode rules removed)
