(function () {
    const rowEl = document.getElementById('yearlyPrayerRows');
    const intro = document.getElementById('timetableIntro');
    const status = document.getElementById('timetableStatus');
    const download = document.getElementById('downloadTimetable');
    if (typeof PRAYER_DATA === 'undefined' || !rowEl) return;

    const year = Number(PRAYER_DATA_YEAR || new Date().getFullYear());
    const rows = [];
    const csvEscape = value => '"' + String(value ?? '').replace(/"/g, '""') + '"';
    const pad = n => String(n).padStart(2, '0');
    const dates = [];
    for (let month = 1; month <= 12; month++) {
        const days = new Date(year, month, 0).getDate();
        for (let day = 1; day <= days; day++) {
            const key = `${month}-${day}`;
            const data = PRAYER_DATA[key];
            if (!data) continue;
            const date = new Date(year, month - 1, day);
            const friday = date.getDay() === 5;
            const d = `${year}-${pad(month)}-${pad(day)}`;
            let dhuhrIqamah = data[3] || data[2];
            if (friday || dhuhrIqamah === "Jumu'ah") dhuhrIqamah = "Jumu'ah";
            const j = friday && typeof window.getJumuahTimes === 'function' ? window.getJumuahTimes(date) : {first:'',second:''};
            const values = [d, data[0], data[1], data[10], data[2], dhuhrIqamah, data[4], data[5], data[6], data[7], data[8], data[9], j.first, j.second];
            dates.push(values);
            rows.push(`<tr>${values.map(v => `<td>${String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</td>`).join('')}</tr>`);
        }
    }
    rowEl.innerHTML = rows.join('') || '<tr><td colspan="14">No timetable data is available.</td></tr>';
    if (intro) intro.textContent = `Prayer start and Jama'at times for Cambridge, ${year}. Friday khutbah times are included where available.`;
    if (status && year !== new Date().getFullYear()) status.textContent = `Note: the bundled timetable is for ${year}; please confirm the current year's times with the mosque.`;
    if (download) download.addEventListener('click', function () {
        const headers = ['Date','Fajr Start','Fajr Jamaat','Sunrise','Dhuhr Start','Dhuhr Jamaat','Asr Start','Asr Jamaat','Maghrib Start','Maghrib Jamaat','Isha Start','Isha Jamaat','1st Khutbah','2nd Khutbah'];
        const csv = [headers, ...dates].map(row => row.map(csvEscape).join(',')).join('\r\n');
        const blob = new Blob(['﻿', csv], {type:'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `omar-faruque-mosque-prayer-timetable-${year}.csv`;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        if (status) status.textContent = `Your ${year} timetable download has started.`;
    });
})();
