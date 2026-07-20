/* ============================================================
   SIMBIOSIA — shared behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav shrink on scroll ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Floating ambient sparkles ---------- */
  const spiralSVG = '<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31,30 L31.4,31.1 L31,32.3 L29.8,33 L28.1,33.1 L26.5,32.2 L25.8,30 L26,27.5 L27.7,25.3 L30.3,24.4 L33.3,25 L36.5,27.4 L38,30 L37.4,34.2 L34.8,38 L30,40.1 L24.5,39.6 L19.9,35.9 L18,30 L19.4,23.7 L23.9,18.7 L30,16.3 L37.2,17.6 L43,22.5 L45.7,30" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Haeckel-style monoline organisms for the ambient floating layer */
  const radiolarianSVG = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="5" stroke-linecap="round"><line x1="50" y1="50" x2="88" y2="50"/><line x1="50" y1="50" x2="77" y2="77"/><line x1="50" y1="50" x2="50" y2="88"/><line x1="50" y1="50" x2="23" y2="77"/><line x1="50" y1="50" x2="12" y2="50"/><line x1="50" y1="50" x2="23" y2="23"/><line x1="50" y1="50" x2="50" y2="12"/><line x1="50" y1="50" x2="77" y2="23"/></g><circle cx="50" cy="50" r="10" stroke="currentColor" stroke-width="5"/></svg>';
  const jellySVG = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20,42 C20,20 35,8 50,8 C65,8 80,20 80,42 C68,50 32,50 20,42 Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M30,50 C28,60 34,66 30,76" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M50,53 C52,65 46,72 50,88" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M70,50 C72,60 66,66 70,76" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
  const diatomSVG = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="36" ry="22" stroke="currentColor" stroke-width="5"/><line x1="50" y1="28" x2="50" y2="72" stroke="currentColor" stroke-width="4"/><line x1="22" y1="42" x2="78" y2="42" stroke="currentColor" stroke-width="3"/><line x1="22" y1="58" x2="78" y2="58" stroke="currentColor" stroke-width="3"/></svg>';

  const floatWrap = document.createElement('div');
  floatWrap.className = 'floaties';
  floatWrap.setAttribute('aria-hidden', 'true');
  const shapes = [radiolarianSVG, diatomSVG, spiralSVG, jellySVG, spiralSVG, radiolarianSVG];
  shapes.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'floaty f' + (i + 1);
    d.innerHTML = s;
    floatWrap.appendChild(d);
  });
  document.body.prepend(floatWrap);

  /* ---------- Custom cursor (desktop / fine pointer only) ---------- */
  const isFine = window.matchMedia('(pointer: fine)').matches;
  if (isFine) {
    document.documentElement.classList.add('has-custom-cursor');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = spiralSVG;
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add('cursor-ready');
    });

    function loop() {
      rx += (mx - rx) * 0.45;
      ry += (my - ry) * 0.45;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverables = 'a, button, .btn, input, textarea, select, [role="button"]';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });
  }
});

/* ---------- Lang toggle helper: pages call initLangToggle(dict) ---------- */
function initLangToggle(dict) {
  const langToggle = document.getElementById('langToggle');
  const htmlRoot = document.documentElement;
  if (!langToggle) return;
  let currentLang = 'es';

  function applyLang(lang) {
    const d = dict[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (d[key] !== undefined) el.innerHTML = d[key];
    });
    htmlRoot.setAttribute('lang', lang);
    langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
    currentLang = lang;
  }

  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'es' ? 'en' : 'es');
  });
}
