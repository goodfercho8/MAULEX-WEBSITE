(function () {
  var menuButton = document.querySelector('.menu-button');
  var navigation = document.querySelector('.nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var open = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var hero = document.querySelector('.hero');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.slide-dots button'));
  var controls = document.querySelectorAll('.slide-controls button');
  var status = document.querySelector('.slide-status span');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  var locked = false;
  var unlockTimer = 0;
  var autoplayTimer = 0;

  function restartAutoplay() {
    window.clearInterval(autoplayTimer);
    if (!reducedMotion && !document.hidden) {
      autoplayTimer = window.setInterval(function () {
        show(current + 1, false);
      }, 6500);
    }
  }

  function show(next, manual) {
    if (!slides.length || locked) return;
    next = (next + slides.length) % slides.length;
    if (next === current) return;

    locked = true;
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].removeAttribute('aria-current');

    current = next;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-current', 'true');
    if (status) status.textContent = String(current + 1).padStart(2, '0');

    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(function () {
      locked = false;
    }, reducedMotion ? 20 : 760);

    if (manual) restartAutoplay();
  }

  slides.forEach(function (slide) {
    slide.draggable = false;
    if (slide.decode) slide.decode().catch(function () {});
  });

  if (controls[0]) controls[0].addEventListener('click', function () { show(current - 1, true); });
  if (controls[1]) controls[1].addEventListener('click', function () { show(current + 1, true); });
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () { show(index, true); });
  });

  if (hero) {
    hero.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') show(current - 1, true);
      if (event.key === 'ArrowRight') show(current + 1, true);
    });
  }

  document.addEventListener('visibilitychange', restartAutoplay);
  restartAutoplay();
})();
