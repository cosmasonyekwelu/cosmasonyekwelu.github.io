(() => {
  'use strict';

  // ---------- tiny helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- elements ----------
  const header     = $('#header');
  const menuBtn    = $('.menu-toggle');
  const drawer     = $('.nav-links');
  const navLinks   = $$('.nav-links a');
  const inPageNav  = navLinks.filter(a => (a.getAttribute('href') || '').startsWith('#'));
  const sections   = $$('main section[id]');

  // ---------- backdrop (created dynamically so no CSS edits needed) ----------
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  Object.assign(backdrop.style, {
    position: 'fixed', inset: '0', background: 'rgba(0,0,0,.35)',
    opacity: '0', pointerEvents: 'none', transition: 'opacity .25s ease', zIndex: '100'
  });
  document.body.appendChild(backdrop);

  // ---------- menu open/close ----------
  const isOpen = () => drawer?.classList.contains('active');
  const setMenu = (open) => {
    if (!menuBtn || !drawer) return;
    drawer.classList.toggle('active', open);
    menuBtn.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    backdrop.style.opacity = open ? '1' : '0';
    backdrop.style.pointerEvents = open ? 'auto' : 'none';
    if (open) drawer.querySelector('a')?.focus({ preventScroll: true });
    else menuBtn.focus?.({ preventScroll: true });
  };

  menuBtn?.addEventListener('click', () => setMenu(!isOpen()));
  backdrop.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Close drawer when clicking any in-page link
  inPageNav.forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ---------- header shrink on scroll (rAF + passive) ----------
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 50);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- anchor offset for fixed header ----------
  const setScrollMargin = () => {
    const offset = (header?.offsetHeight || 64) + 24; // header + breathing room
    sections.forEach(sec => { sec.style.scrollMarginTop = `${offset}px`; });
  };
  window.addEventListener('resize', setScrollMargin, { passive: true });
  setScrollMargin();

  // Enhance smooth scroll to respect header height everywhere
  inPageNav.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - ((header?.offsetHeight || 0) + 16);
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  // ---------- active link highlighting ----------
  const updateActive = (id) => {
    navLinks.forEach(l => l.classList.remove('active'));
    const match = navLinks.find(l => l.getAttribute('href') === `#${id}`);
    match?.classList.add('active');
  };

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        updateActive(entry.target.id);
      });
    }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });
    sections.forEach(sec => io.observe(sec));
  } else {
    // Fallback: compute current section by scroll position
    const fallbackActive = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0]?.id;
      sections.forEach(sec => { if (pos >= sec.offsetTop) current = sec.id; });
      if (current) updateActive(current);
    };
    window.addEventListener('scroll', fallbackActive, { passive: true });
    fallbackActive();
  }

  // ---------- contact form (placeholder handler) ----------
  const form = $('#contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Contact form submission:', data);
    alert('Thank you for your message! I will get back to you soon.');
    form.reset();
  });
})();
