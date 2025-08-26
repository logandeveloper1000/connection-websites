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

// ===== Projects Filter =====
(() => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const pills = document.querySelectorAll('.pill');
  const cards = document.querySelectorAll('.option-card');

  let currentType = 'website'; // default tab
  let currentCat  = 'all';

  function matchCat(card, cat) {
    if (cat === 'all') return true;
    const cats = (card.dataset.cat || '').toLowerCase().split(',').map(s => s.trim());
    return cats.includes(cat);
  }

  function applyFilter() {
    cards.forEach(card => {
      const typeOK = card.dataset.type === currentType;
      const catOK  = matchCat(card, currentCat);
      card.classList.toggle('hidden', !(typeOK && catOK));
    });
  }

  // Tab type filter
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type; // 'website' | 'app'
      applyFilter();
    });
  });

  // Category pills
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      currentCat = p.dataset.cat; // e.g., 'finance'
      applyFilter();
    });
  });

  const modal = document.getElementById('optionModal');
  const closeBtn = modal.querySelector('.modal-close');

  function openModalFromCard(card) {
    // dataset inputs
    const title     = card.dataset.title || '';
    const category  = (card.dataset.category || '').trim() || (card.dataset.cat?.split(',')[0] || '');
    const overview  = card.dataset.overview || '—';
    const url       = card.dataset.url || '#';

    // images: big + 3 others
    const imgBig = card.dataset.img1 || card.dataset.img || '';
    const imgS1  = card.dataset.img2 || '';
    const imgS2  = card.dataset.img3 || '';
    const imgMed = card.dataset.img4 || '';

    // fill images
    document.getElementById('mBig').src = imgBig;
    document.getElementById('mS1').src  = imgS1 || imgBig;
    document.getElementById('mS2').src  = imgS2 || imgBig;
    document.getElementById('mMed').src = imgMed || imgBig;

    document.getElementById('mBig').alt = `${title} large image`;
    document.getElementById('mS1').alt  = `${title} screenshot`;
    document.getElementById('mS2').alt  = `${title} screenshot`;
    document.getElementById('mMed').alt = `${title} screenshot`;

    // fill right panel
    document.getElementById('mOverview').textContent = overview;
    document.getElementById('mProject').textContent  = title;
    document.getElementById('mCategory').textContent = category;
    const launch = document.getElementById('mLaunch');
    launch.href = url;

    // share links
    const shareUrl  = encodeURIComponent(url || window.location.href);
    const shareTxt  = encodeURIComponent(title);
    document.getElementById('shareFb').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    document.getElementById('shareX').href  = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTxt}`;
    document.getElementById('shareLn').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    document.getElementById('sharePt').href = `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTxt}`;

    // bottom: other 4
    populateMoreProjects(card);

    // open
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    closeBtn.focus();
  }

  function populateMoreProjects(activeCard){
    const grid = document.getElementById('moreGrid');
    grid.innerHTML = '';

    // Prefer other items of same type; exclude current
    const list = [...document.querySelectorAll('.option-card')]
      .filter(c => c !== activeCard && c.dataset.type === activeCard.dataset.type)
      .slice(0,4);

    for (const c of list){
      const a = document.createElement('a');
      a.className = 'more-item';
      a.href = '#';
      a.addEventListener('click', (e)=>{ e.preventDefault(); openModalFromCard(c); });

      const imgSrc = c.dataset.img1 || c.dataset.img || c.querySelector('img')?.src || '';
      a.innerHTML = `
        <img src="${imgSrc}" alt="${(c.dataset.title||'Project')} thumbnail">
        <div class="meta">
          <div class="t">${c.dataset.title || 'Project'}</div>
          <div class="c">${(c.dataset.category || (c.dataset.cat?.split(',')[0] || '')).trim()}</div>
        </div>`;
      grid.appendChild(a);
    }
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

  cards.forEach(card => {
    card.addEventListener('click', () => openModalFromCard(card));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModalFromCard(card); }
    });
  });

  // Initial filter
  applyFilter();
})();
