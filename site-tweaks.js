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

    /* 3. Footer year */
    var fy = document.getElementById("footerYear");
    if (fy) fy.textContent = new Date().getFullYear();
})();
