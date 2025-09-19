(() => {
  'use strict';

  // elements
  const header   = document.getElementById('header');
  const menuBtn  = document.querySelector('.menu-toggle');
  const drawer   = document.querySelector('.nav-links');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // mobile menu toggle (keeps aria-expanded in sync; locks body scroll)
  if (menuBtn && drawer) {
    const setOpen = (open) => {
      drawer.classList.toggle('active', open);
      menuBtn.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', () => setOpen(!drawer.classList.contains('active')));
    navLinks.forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  // header shrink on scroll (rAF + passive for perf)
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

  // active link highlighting
  const setActive = (id) => {
    navLinks.forEach(l => {
      const isActive = l.getAttribute('href') === `#${id}`;
      l.classList.toggle('active', isActive);
      if (isActive) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-55% 0px -40% 0px', threshold: 0 });
    sections.forEach(sec => io.observe(sec));
  } else {
    // fallback by scroll position
    const fallback = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let current = sections[0]?.id;
      sections.forEach(sec => { if (y >= sec.offsetTop) current = sec.id; });
      if (current) setActive(current);
    };
    window.addEventListener('scroll', fallback, { passive: true });
    fallback();
  }

  // contact form (placeholder)
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    form.reset();
  });
})();
