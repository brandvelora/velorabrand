const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .collection-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ---- scroll motion ---- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const heroCopy = document.querySelector('.hero-copy');

document.querySelectorAll('section.reveal').forEach(sec => {
  sec.querySelectorAll('.section-label,.eyebrow,h2,.section-heading>p,.intro-bottom,.philosophy-body,.principles>div,.contact-copy>p,.statement-symbol,.statement p,.statement>span,.collection-note').forEach((el, i) => {
    el.classList.add('rise');
    el.style.setProperty('--d', (0.08 * i + 0.1) + 's');
  });
});

heroCopy?.querySelectorAll('.eyebrow,h1,.hero-description,.hero-actions,.hero-footnote').forEach((el, i) => {
  el.classList.add('rise');
  el.style.setProperty('--d', (0.15 * i + 0.2) + 's');
});
requestAnimationFrame(() => requestAnimationFrame(() => heroCopy?.classList.add('revealed')));

const bar = document.createElement('div');
bar.className = 'scroll-progress';
document.body.appendChild(bar);

const parallax = [['.hero-image', 0.14, 60], ['.philosophy-image-inner', 0.1, 55]]
  .map(([s, k, m]) => ({ el: document.querySelector(s), k, m }))
  .filter(o => o.el);

let lastY = window.scrollY, ticking = false;

function update() {
  const y = window.scrollY, vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;

  if (!reduce) {
    parallax.forEach(({ el, k, m }) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = -(r.top + r.height / 2 - vh / 2) * k;
      el.style.translate = `0 ${Math.max(-m, Math.min(m, off))}px`;
    });
    if (heroCopy) {
      const f = Math.min(1, y / (vh * 0.85));
      heroCopy.style.translate = `0 ${y * 0.12}px`;
      heroCopy.style.opacity = String(1 - f * 0.85);
    }
  }

  const navOpen = nav?.classList.contains('is-open');
  if (y > lastY + 4 && y > 220 && !navOpen) header?.classList.add('is-hidden');
  else if (y < lastY - 4 || y < 120) header?.classList.remove('is-hidden');
  lastY = y;
}

window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
}, { passive: true });
window.addEventListener('resize', update);
update();
