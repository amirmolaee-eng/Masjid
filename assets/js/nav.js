// Shared site navigation: mobile/tablet drawer toggle.
// Included on every page. Safe to run even if some elements are absent.
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    var overlay = document.getElementById('navOverlay');
    var closeBtn = document.getElementById('navClose');

    if (!toggle || !drawer || !overlay) return;

    // Scroll lock that also works on iOS Safari (overflow:hidden alone does not stop the page behind scrolling)
    var savedY = 0;
    function lockScroll() {
        savedY = window.scrollY || window.pageYOffset || 0;
        var b = document.body.style;
        b.position = 'fixed'; b.top = (-savedY) + 'px'; b.left = '0'; b.right = '0'; b.width = '100%';
    }
    function unlockScroll() {
        var b = document.body.style;
        b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = '';
        window.scrollTo(0, savedY);
    }

    function openDrawer() {
        lockScroll();
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        drawer.removeAttribute('inert');
        if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
        if (!drawer.classList.contains('open')) return;
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.classList.remove('nav-open');
        unlockScroll();
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('inert', '');
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

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1100 && drawer.classList.contains('open')) closeDrawer();
    });

    var drawerLinks = drawer.querySelectorAll('a');
    for (var i = 0; i < drawerLinks.length; i++) {
        drawerLinks[i].addEventListener('click', closeDrawer);
    }
});
