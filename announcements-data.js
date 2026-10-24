/* ==========================================================
   ANNOUNCEMENTS  -  edit this file to add / remove items.
   Newest first is not required; they are sorted by date.
   Fields:
     date     "YYYY-MM-DD"  (required)
     title    short heading (required)
     body     text; line breaks are kept (required)
     tag      optional small label e.g. "Jumu'ah", "Events", "Notice"
     pinned   true = shown first, highlighted
     expires  optional "YYYY-MM-DD" - hidden after this date
     link     optional { text: "Read more", href: "page-or-url" }
   ========================================================== */
window.MOSQUE_ANNOUNCEMENTS = [
    {
        date: "2026-10-24",
        title: "Welcome to our new website",
        body: "Assalamu Alaykum. Prayer times, Jumu'ah timings and mosque news are all here. Announcements will be posted on this page.",
        tag: "Notice",
        pinned: true
    },
    {
        date: "2026-10-23",
        title: "Jumu'ah reminder",
        body: "Please arrive early to listen to the Khutbah, park considerately and be mindful of our neighbours.",
        tag: "Jumu'ah",
        link: { text: "Jumu'ah details", href: "jumuah.html" }
    }
];
