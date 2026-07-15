/* MK Industries — About page interactions
   1) Animates stat counters when they scroll into view.
   2) Drives the fixed measurement rail: highlights the tick for the
      section currently in view, and jumps to a section on click. */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- counters ---- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = target;
    }
    window.requestAnimationFrame(step);
  }
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---- measurement rail ---- */
  var ticks = document.querySelectorAll('.rail__tick');
  var indexLabel = document.querySelector('.rail__index');
  if (!ticks.length) return;

  var sections = [];
  ticks.forEach(function (tick) {
    var id = tick.getAttribute('data-target');
    var section = id ? document.getElementById(id) : null;
    if (section) sections.push({ tick: tick, section: section });

    tick.addEventListener('click', function () {
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  var railObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var match = sections.find(function (s) { return s.section === entry.target; });
      if (!match) return;
      if (entry.isIntersecting) {
        ticks.forEach(function (t) { t.classList.remove('is-active'); });
        match.tick.classList.add('is-active');
        if (indexLabel) {
          var pos = sections.indexOf(match) + 1;
          indexLabel.textContent = String(pos).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0');
        }
      }
    });
  }, { threshold: 0.35, rootMargin: '-15% 0px -50% 0px' });

  sections.forEach(function (s) { railObserver.observe(s.section); });
});