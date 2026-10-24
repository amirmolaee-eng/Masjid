/* ==========================================================================
   JUMU'AH TIMES - the ONE place to change Khutbah times.
   Everything on the site (home card, ticker, Jumu'ah page) reads from here.

   Times follow UK clock changes:
     summer = while the UK is on BST, winter = while on GMT.
   Edit the four times below when the mosque changes them.
   ========================================================================== */
window.JUMUAH_TIMES = {
    summer: { first: "13:25", second: "14:25" },
    winter: { first: "12:25", second: "13:25" }
};

(function () {
    /* Is the UK on summer time (BST) on this date? Uses London time wherever the visitor is. */
    function isBST(date) {
        try {
            var label = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", timeZoneName: "short" }).format(date);
            return /BST|GMT\+1|UTC\+1/.test(label);
        } catch (e) { return false; }
    }

    /* The Friday we are talking about: today if it is Friday, otherwise the next one. */
    function jumuahDay(from) {
        var d = new Date(from || Date.now());
        d.setHours(12, 0, 0, 0);
        var add = (5 - d.getDay() + 7) % 7;
        d.setDate(d.getDate() + add);
        return d;
    }

    window.getJumuahTimes = function (from) {
        var day = jumuahDay(from);
        var set = isBST(day) ? window.JUMUAH_TIMES.summer : window.JUMUAH_TIMES.winter;
        return { first: set.first, second: set.second, date: day, summer: isBST(day) };
    };
})();
