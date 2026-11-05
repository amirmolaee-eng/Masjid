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

## Round 4 (November 2026) - feedback review
**Fonts (embedded)**
- All fonts are now served from `fonts/` - nothing is fetched from Google or left to the visitor's computer, so Chrome, Safari, Firefox, Edge and phones all draw the same letters.
- Headings: Libertinus Sans (Regular + Bold). Body: Cabin. Arabic: Noto Sans Arabic. All SIL Open Font Licence (licence texts are in `fonts/OFL-*.txt`).
- Optima and Gill Sans (the brand fonts) are commercial and cannot legally be put on a website without a web-font licence. Libertinus Sans and Cabin are the closest free matches. If the mosque buys web licences, save the woff2 files in `fonts/` and un-comment the block at the bottom of `fonts/fonts.css` - nothing else needs changing.
- Removed: Outfit, Belleza and the Bengali font (no longer used).

**Home page**
- Left column: logo + Next Jama'at + date, Salah timetable, Jumu'ah, Connect With Us. Right column: mosque photo with Donate over its bottom-centre, Announcements, Visit Us.
- Donate over the photo: delete the class `donate-on-photo` in `index.html` to put the button back underneath the photo.
- Phone order: header, Salah, Jumu'ah, photo + Donate, Announcements, Visit Us, Connect With Us (change the `order:` numbers in `overrides.css` to rearrange).
- Logos swapped: Secondary (stacked) logo on the home page, Primary (wide) logo in the top bar on every page (151px wide, above the 150px brand minimum).
- Photo compressed from 836 KB to 136 KB (same file name, so it can be replaced later).

**Text and typography**
- All Bengali removed (timetable labels, Jumu'ah card, ticker, Islamic events). Arabic kept; the ticker still has its Urdu line.
- Timetable: prayer names and start times regular, Iqamah times bold, header row bold, current/next row bold; Sunrise is now the same size as the other rows.
- "1st / 2nd Khutbah" no longer shows as "1ST / 2ND" (Jumu'ah card and Next Jama'at line).
- Footer is one small line on every page (charity number, address, Contact us, Privacy & cookies, copyright); the name line is gone.
- Small fixes: darker "Get Directions" text, the timetable table scroll area is keyboard-reachable, CSV button reads "Download spreadsheet (CSV)".

**Not done on purpose:** offline/PWA app, hosting, and the official PDF timetable (waiting on the old site's file).

## Round 5 (November 2026)
- Home page on desktop is now an even 50 / 50 split between the left and right columns.
- New prayer-hall photo behind the Donate button (`mosque-prayer-hall.jpg`, resized to 301 KB). The old `latest_instagram_post.jpg` was removed.
- Timetable page: CSV download removed; the button now downloads the official **2026** timetable PDF (`Cambridge-Prayer-Times-2026.pdf`). The old generated PDF and CSV files were deleted.
- Announcements page now uses the same layout, title size, card style and text sizes as the other pages.
- Footer now sits at the bottom of the window on short pages (it used to float halfway up the Announcements page).
- Clean-up: removed a leftover Perplexity editor script (about 15 KB, about 440 lines) from every page. It was not part of the site and allowed messages from perplexity.ai when the page was framed.
- When 2027 arrives: replace the PDF, update the button text in `timetable.html`, and load the new year into `prayer_data.js`.
- Timetable PDF replaced with the new brand-styled 2026 timetable (built from the mosque's CSV: Myrtle / Magnolia / Light Grey Green, brand logo, Fridays highlighted, clock changes marked).

## Round 6 (November 2026) - mobile browsers
Tested on iPhone SE / 15 Pro / 15 Pro Max (landscape), Pixel 7, Galaxy S24, A55, Z Fold 7 cover, S9+ (landscape) sizes.
- Every page: `viewport-fit=cover` + safe-area padding (notch, Dynamic Island, home bar), and phone/date/address auto-linking turned off (stops iOS/Samsung turning the bank account number into a phone link).
- Status bar on home-screen (installed) use is now "default", so the top bar is never hidden behind the clock.
- Menu drawer: scroll lock that works on iOS (the page behind no longer scrolls), closes itself if the phone is rotated to a wide screen, 44px tap targets.
- No text enlargement when phones are turned sideways; sideways phones get a compact header so prayer times show straight away.
- Contact form fields use 16px text so iOS does not zoom in on tap.
- No "stuck" hover effects after tapping cards on touch screens; pulsing animations stop for people who turn on Reduce Motion.
- 320-360px phones: Announcements header no longer pushes the page sideways; "View all" is a bigger tap target.

## Round 6 (November 2026) - folder reorganisation
- Pages now live in one folder each (`about/index.html`, ...); shared code/images/fonts moved under `assets/`; home-only files under `home/`. See `README.md` at the site root for the full map.
- Removed exact duplicates: `OFM-Prayer-Timetable-2026.pdf` (same file as `Cambridge-Prayer-Times-2026.pdf`) and the zip copies of the brand kit and commercial fonts (the extracted folders are kept).
- Renamed `Logo - Large.jpeg` to `home/logo-avatar.jpeg` (no spaces). `Logo -1/-2.jpeg` were unreferenced and are in `_unused/`.
- Paths in the "Where to edit things" table above are now under `assets/` (see README).

## Round 7 (November 2026)
- Home page top bar: the logo is replaced by a **Donate** button (Light Grey Green `#EAF0DF` with Myrtle text, pill shape). Other pages still show the logo.
- Home photo: the Donate button is gone from the photo; a welcome message ("Assalamu Alaikum / Welcome to Omar Faruque Mosque.") sits over the top of the image.
- Menu: "Help Us" renamed **Support Us** on every page (menu, drawer, page title) and it no longer has button styling. The folder is still `help-us/`.
- Home header: the date sits under the logo in one block with Next Jama'at on the same line, the same width as the Salah table, e.g. "Thurs, 5 Nov 2026 · Next Jama'at: Asr 15:30". Same lettering as the prayer names (not bold). The Islamic year is removed.
- Fonts: the real brand fonts are now served from `assets/fonts/`: `optima-regular.ttf`, `optima-bold.ttf`, `gill-sans-regular.otf` (copied from `commercial-not-deployed/`). Phones do not have Optima or Gill Sans installed, which is why they showed the stand-in fonts before. **Check the mosque has a web licence for these before going live.**
- Jumu'ah: winter 2nd Khutbah is now **13:15** (was 13:25) in `jumuah-times.js`, so the home card, ticker, Next Jama'at and Jumu'ah page all update. Summer times (13:25 / 14:25) are unchanged.
- Home header logo is now the **Primary** (wide) logo, `assets/images/logo/OMF-Primary-Myrtle.png` (420px wide on large screens, 380px on desktop, up to 340px on phones). `home/OMF-Secondary-Myrtle.png` is no longer used.
- Bottom ticker on phones: the whole message now shows, wrapping onto two lines instead of being cut off with "...". The bar keeps a fixed height, so it doesn't jump as messages change.
- Location page on phones: the "Location" title and address are centred. Desktop is unchanged.
- Home Jumu'ah card: the line "Assalamu Alaykum • Please arrive early to listen to the Khutbah." is removed.
