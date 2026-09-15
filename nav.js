// Shared site navigation: mobile/tablet drawer toggle.
// Included on every page. Safe to run even if some elements are absent.
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    var overlay = document.getElementById('navOverlay');
    var closeBtn = document.getElementById('navClose');

    if (!toggle || !drawer || !overlay) return;

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        toggle.focus();
    }

    toggle.addEventListener('click', function () {
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    var drawerLinks = drawer.querySelectorAll('a');
    for (var i = 0; i < drawerLinks.length; i++) {
        drawerLinks[i].addEventListener('click', closeDrawer);
    }
});
