// Mobile nav toggle
const toggleBtn = document.querySelector('.nav__toggle');
const links = document.querySelector('.nav__links');

if (toggleBtn && links) {
  toggleBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when clicking a link (mobile)
  links.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      links.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Optional: add a subtle shadow once you scroll past the hero top
const header = document.querySelector('.site-header');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || window.pageYOffset;
  if (y > 8 && lastY <= 8) {
    header.style.backgroundColor = '#111';
  } else if (y <= 8 && lastY > 8) {
    header.style.backgroundColor = '#0000';
  }
  lastY = y;
});

// Count-up animation for stats
(function initCounters(){
  const counters = document.querySelectorAll('.stat__value[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.getAttribute('data-count') || '0');
      const dur = Math.min(1200, 500 + target * 6); // adaptive duration
      const start = performance.now();

      function tick(now){
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.35 });

  counters.forEach(c => obs.observe(c));
})();

// ===== Testimonials rail scroll =====
(function(){
  const rail = document.getElementById('t-rail');
  if (!rail) return;

  const prevBtn = document.querySelector('.t-nav--prev');
  const nextBtn = document.querySelector('.t-nav--next');

  // find width of one card (includes margin/gap if using getBoundingClientRect)
  function cardWidth(){
    const card = rail.querySelector('.t-card');
    if (!card) return rail.clientWidth;
    const style = window.getComputedStyle(card);
    const gap = parseFloat(style.marginRight) || 28; // fallback gap
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrows(){
    const maxScroll = rail.scrollWidth - rail.clientWidth - 1; 
    prevBtn.disabled = rail.scrollLeft <= 0;
    nextBtn.disabled = rail.scrollLeft >= maxScroll;
  }

  prevBtn.addEventListener('click', () => {
    rail.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    setTimeout(updateArrows, 300);
  });

  nextBtn.addEventListener('click', () => {
    rail.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    setTimeout(updateArrows, 300);
  });

  rail.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);

  // init
  updateArrows();
})();


