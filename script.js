document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Reading progress ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress?.style.setProperty('--progress', `${progress}%`);
};
updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

/* ---------- Theme preference ---------- */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeToggle.querySelector('span').textContent = isDark ? '\u2600' : '\u25D0';
  }
}

applyTheme(savedTheme || preferredTheme);
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', nextTheme);
  applyTheme(nextTheme);
});

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Scroll reveal for sections ---------- */
const revealTargets = document.querySelectorAll('.section, .about-facts, .skill-card, .project-card, .cert-card, .internship-card');

if(!prefersReducedMotion){
  revealTargets.forEach(el => {
    el.classList.add('reveal-target');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach(el => observer.observe(el));
}

/* ---------- Active navigation state ---------- */
const sectionLinks = [...document.querySelectorAll('.topnav-links a')];
const sectionMap = new Map(sectionLinks.map(link => [link.getAttribute('href').slice(1), link]));
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => link.classList.remove('is-active'));
    sectionMap.get(entry.target.id)?.classList.add('is-active');
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sectionMap.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) navObserver.observe(section);
});

/* ---------- Gentle desktop magnetic CTA feedback ---------- */
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

/* ---------- Certifications: filter + animated counter ---------- */
const certFilters = document.getElementById('certFilters');
const certCards = document.querySelectorAll('.cert-card');
const certCountEl = document.getElementById('certCount');

if(certFilters){
  certFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.cert-filter');
    if(!btn) return;
    certFilters.querySelectorAll('.cert-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    certCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
}

if(certCountEl){
  const target = certCards.length;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        let current = 0;
        const step = Math.max(1, Math.round(target / 30));
        const tick = () => {
          current = Math.min(target, current + step);
          certCountEl.textContent = current + (current === target ? '+' : '');
          if(current < target) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(certCountEl);
}

/* ---------- Hero scroll indicator click ---------- */
const heroScroll = document.getElementById('heroScroll');
if(heroScroll){
  heroScroll.style.cursor = 'pointer';
  heroScroll.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });
}
