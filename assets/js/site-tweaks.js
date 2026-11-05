/* Small site-wide tweaks (loaded before app.js) */
(function () {
    /* 1. Dark mode is disabled: the dark rules were removed from styles.css,
          and the page also declares color-scheme "only light". */
    document.documentElement.setAttribute("data-theme", "light");

    /* 2. "This week's Khutbah times" line on the Jumu'ah page */
    var wk = document.getElementById("jumuahWeek");
    if (wk && window.getJumuahTimes) {
        var j = window.getJumuahTimes();
        wk.textContent = "1st Khutbah " + j.first + " \u2022 2nd Khutbah " + j.second;
    }

    /* 3. Location page: the Google map only loads when the visitor asks for it */
    var mapBtn = document.getElementById("mapShowBtn");
    if (mapBtn) {
        mapBtn.addEventListener("click", function () {
            var frame = document.createElement("iframe");
            frame.src = mapBtn.getAttribute("data-src");
            frame.title = "Map showing Omar Faruque Mosque location";
            frame.referrerPolicy = "no-referrer-when-downgrade";
            var box = document.getElementById("mapConsent");
            box.parentNode.replaceChild(frame, box);
        });
    }

    /* 4. Footer year */
    var fy = document.getElementById("footerYear");
    if (fy) fy.textContent = new Date().getFullYear();
})();
