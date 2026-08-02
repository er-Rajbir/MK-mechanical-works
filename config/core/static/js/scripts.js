document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================
       PAGE LOADER
       (this is what was missing — nothing was
       ever adding "loaded", so the loader stayed
       on screen forever)
    ========================================== */
    var loader = document.querySelector('.page-loader');

    function hideLoader() {
        if (!loader) return;
        loader.classList.add('loaded');
        window.setTimeout(function () {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 500);
    }

    if (loader) {
        // Hide as soon as everything (images, fonts) has loaded...
        window.addEventListener('load', hideLoader);
        // ...but never make someone wait more than 1.5s for it.
        window.setTimeout(hideLoader, 1500);
    }

    /* ==========================================
       STICKY NAVBAR
    ========================================== */
    var navbar = document.querySelector('.custom-navbar');

    function onNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    /* ==========================================
       BACK TO TOP BUTTON
    ========================================== */
    var backTop = document.getElementById('backToTop');

    function onBackTopScroll() {
        if (!backTop) return;
        if (window.scrollY > 300) backTop.classList.add('show');
        else backTop.classList.remove('show');
    }
    window.addEventListener('scroll', onBackTopScroll, { passive: true });
    onBackTopScroll();

    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================
       ACTIVE NAV LINK (on click)
    ========================================== */
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(function (item) {
                item.classList.remove('active');
            });
            link.classList.add('active');
        });
    });

    /* ==========================================
       ANIMATED STAT COUNTERS (.counter, e.g. "15+" / "100%")
    ========================================== */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var counters = document.querySelectorAll('.counter');

    function animateCounter(el) {
        var raw = el.textContent.trim();
        var suffix = raw.replace(/[0-9.]/g, ''); // "+", "%", etc.
        var target = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
        var duration = 1200;
        var start = null;

        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
            else el.textContent = target + suffix;
        }
        window.requestAnimationFrame(step);
    }

    if (counters.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            // leave the static values as-is
        } else {
            var countIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        countIO.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(function (el) { countIO.observe(el); });
        }
    }

    /* ==========================================
       SECTION FADE-IN ON SCROLL
    ========================================== */
    var sections = document.querySelectorAll('section');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        sections.forEach(function (el) { el.classList.add('visible'); });
    } else {
        var sectionIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    sectionIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        sections.forEach(function (el) { sectionIO.observe(el); });
    }

    /* ==========================================
       SHOWCASE BANNER — subtle scroll parallax
       (skipped on reduced-motion and on touch/mobile,
       where the section already falls back to a
       normal scrolling background via CSS)
    ========================================== */
    var showcase = document.querySelector('.showcase-banner');
    if (showcase && !reduceMotion && window.innerWidth > 991) {
        window.addEventListener('scroll', function () {
            var rect = showcase.getBoundingClientRect();
            var offset = rect.top * 0.06;
            showcase.style.backgroundPositionY = (50 + offset) + '%';
        }, { passive: true });
    }

    /* ==========================================
       SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
    ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id.length > 1) {
                var target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                }
            }
        });
    });

});