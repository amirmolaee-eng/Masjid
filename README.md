# Omar Faruque Mosque website

Static site (plain HTML/CSS/JS, no build step). Open `index.html` directly, or serve the folder with any static host.

## Structure

```
index.html                  Home page (root, so the site address works as normal)
home/                       Files used only by the home page (app.js, mosque photo, stacked logo, avatar)
about/ announcements/ contact/ etiquette/ help-us/ jumuah/ links/ location/ privacy/ timetable/
  index.html                One folder per page; page-only files live beside it
                            (timetable/ also holds timetable.js and the downloadable PDF)
assets/
  css/                      styles.css (base) + overrides.css (later tweaks, loaded second)
  js/                       Shared scripts: nav.js, site-tweaks.js, jumuah-times.js, announcements.js
  data/                     Content you edit: announcements-data.js, prayer_data.js
  fonts/                    Self-hosted web fonts + fonts.css + OFL licences
    commercial-not-deployed/  Optima / Gill Sans (need a web licence; NOT used by the site)
  icons/                    Favicons, app icons, social preview
  images/logo/              Logo used in the top bar on every page
  images/brand-kit/         Full brand kit by logo type / format (reference, not used by pages)
docs/CHANGES.md             Change log and "where to edit things"
_unused/                    Files no page references (safe to delete)
favicon.ico, manifest.webmanifest, serve.json   Must stay at the root
```

## Where to edit
| What | File |
|---|---|
| Jumu'ah times | `assets/js/jumuah-times.js` |
| Announcements | `assets/data/announcements-data.js` |
| Prayer timetable | `assets/data/prayer_data.js` |
| Colours / fonts / sizes | `assets/css/overrides.css` |

## Path rules
- Page links are `folder/index.html` (so they work on any host and when opened from disk).
- Each page sets `<html data-root="../">` (home: `""`). Announcement links are written relative to the site root and prefixed from this.
