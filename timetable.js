/* ==========================================================================
   timetable.js - yearly prayer times page.
   Reads the same data as the home page (prayer_data.js + jumuah-times.js),
   so there is only ONE place to edit times.
   ========================================================================== */
(function () {
    'use strict';

    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var TIME_RE = /^\d{1,2}:\d{2}$/;

    // month is 0-based; PRAYER_DATA keys use the calendar month (1-12), e.g. "10-29"
    function monthDays(month) {
        var prefix = (month + 1) + '-';
        return Object.keys(PRAYER_DATA)
            .filter(function (k) { return k.indexOf(prefix) === 0; })
            .map(function (k) { return parseInt(k.split('-')[1], 10); })
            .sort(function (a, b) { return a - b; });
    }

    // The two Khutbah times for a given Friday (BST/GMT aware, like the rest of the site).
    function jumuahTimesFor(date) {
        var j = window.getJumuahTimes(date);
        return j.first + ' / ' + j.second;
    }

    function renderMonth(month) {
        var body = document.getElementById('ttBody');
        var title = document.getElementById('ttCardTitle');
        if (!body) return;

        title.textContent = MONTHS[month] + ' ' + PRAYER_DATA_YEAR;

        var days = monthDays(month);
        body.innerHTML = '';

        var now = new Date();
        var todayKey = now.getFullYear() === PRAYER_DATA_YEAR
            ? ((now.getMonth() + 1) + '-' + now.getDate()) : null;

        days.forEach(function (day) {
            var raw = PRAYER_DATA[(month + 1) + '-' + day];
            var dt = new Date(PRAYER_DATA_YEAR, month, day);
            var friday = dt.getDay() === 5;

            var tr = document.createElement('tr');
            if (friday) tr.className = 'friday';
            if (todayKey === (month + 1) + '-' + day) tr.className += ' today';

            var dhuhrCell = friday
                ? '<td><span class="tt-start">Jumu&rsquo;ah</span><span class="tt-iqamah">' + jumuahTimesFor(dt) + '</span></td>'
                : '<td><span class="tt-start">' + raw[2] + '</span><span class="tt-iqamah">' + raw[3] + '</span></td>';

            tr.innerHTML =
                '<td class="tt-date">' + day + ' ' + MONTHS[month].slice(0, 3) + '</td>' +
                '<td><span class="tt-start">' + raw[0] + '</span><span class="tt-iqamah">' + raw[1] + '</span></td>' +
                '<td>' + raw[10] + '</td>' +
                dhuhrCell +
                '<td><span class="tt-start">' + raw[4] + '</span><span class="tt-iqamah">' + raw[5] + '</span></td>' +
                '<td><span class="tt-start">' + raw[6] + '</span><span class="tt-iqamah">' + raw[7] + '</span></td>' +
                '<td><span class="tt-start">' + raw[8] + '</span><span class="tt-iqamah">' + raw[9] + '</span></td>';
            body.appendChild(tr);
        });

        // tabs active state
        var tabs = document.querySelectorAll('#ttTabs .tt-tab');
        tabs.forEach(function (t) {
            var active = parseInt(t.getAttribute('data-month'), 10) === month;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function init() {
        if (typeof PRAYER_DATA === 'undefined') { setTimeout(init, 100); return; }

        var tabs = document.getElementById('ttTabs');
        var now = new Date();

        // Stale-year notice (same wording as the home page)
        var notice = document.getElementById('timetableNotice');
        if (notice && now.getFullYear() !== PRAYER_DATA_YEAR) {
            notice.hidden = false;
            notice.textContent = 'These are the ' + PRAYER_DATA_YEAR +
                ' times. The ' + now.getFullYear() +
                ' timetable is being prepared, so please check with the mosque if in doubt.';
        }

        // Jumu'ah note
        var jn = document.getElementById('ttJumuahNote');
        if (jn) {
            var j = window.getJumuahTimes();
            var other = j.summer ? window.JUMUAH_TIMES.winter : window.JUMUAH_TIMES.summer;
            var season = j.summer ? 'BST (summer)' : 'GMT (winter)';
            var otherSeason = j.summer ? 'GMT (winter)' : 'BST (summer)';
            jn.innerHTML = '<strong>Jumu&rsquo;ah Khutbahs (Fridays):</strong> ' +
                j.first + ' & ' + j.second + ' during ' + season +
                ' &bull; ' + other.first + ' & ' + other.second + ' during ' + otherSeason +
                '. No pre-booking required.';
        }

        // Month tabs
        if (tabs) {
            for (var m = 0; m < 12; m++) {
                if (!monthDays(m).length) continue;
                (function (m) {
                    var b = document.createElement('button');
                    b.className = 'tt-tab';
                    b.type = 'button';
                    b.setAttribute('role', 'tab');
                    b.setAttribute('data-month', m);
                    b.textContent = MONTHS[m].slice(0, 3);
                    b.addEventListener('click', function () { renderMonth(m); });
                    tabs.appendChild(b);
                })(m);
            }
        }

        // Open on the current month when the data is for this year, else January
        var startMonth = (now.getFullYear() === PRAYER_DATA_YEAR) ? now.getMonth() : 0;
        renderMonth(startMonth);

        // Print button
        var printBtn = document.getElementById('ttPrintBtn');
        if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
