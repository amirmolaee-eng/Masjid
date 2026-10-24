/* Renders announcements from announcements-data.js
   - #homeAnnouncements  : latest 3 (home page)
   - #allAnnouncements   : everything (announcements page) */
(function () {
    function today() { var d = new Date(); d.setHours(0,0,0,0); return d; }
    function parse(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1]-1, +p[2]); }
    function fmt(s) {
        return parse(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function active() {
        var t = today();
        return (window.MOSQUE_ANNOUNCEMENTS || [])
            .filter(function (a) { return !a.expires || parse(a.expires) >= t; })
            .sort(function (a, b) {
                if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
                return parse(b.date) - parse(a.date);
            });
    }
    function card(a, level) {
        var c = el("article", "ann-card" + (a.pinned ? " is-pinned" : ""));
        var meta = el("div", "ann-meta");
        if (a.tag) meta.appendChild(el("span", "ann-tag", a.tag));
        meta.appendChild(el("time", null, fmt(a.date)));
        c.appendChild(meta);
        c.appendChild(el(level || "h4", "ann-title", a.title));
        c.appendChild(el("p", "ann-body", a.body));
        if (a.link && a.link.href) {
            var l = el("a", "ann-link", a.link.text || "Read more");
            l.href = a.link.href;
            c.appendChild(l);
        }
        return c;
    }
    function render(id, limit, level) {
        var box = document.getElementById(id);
        if (!box) return;
        var items = active();
        if (limit) items = items.slice(0, limit);
        box.textContent = "";
        if (!items.length) {
            box.appendChild(el("div", "ann-empty", "There are no announcements at the moment."));
            return;
        }
        items.forEach(function (a) { box.appendChild(card(a, level)); });
    }
    render("homeAnnouncements", 3, "h3");
    render("allAnnouncements", 0, "h2");
})();
