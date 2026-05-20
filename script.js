/* ============================================================
   MARWAN ELSAYED PORTFOLIO — script.js
   Clean, modular, well-commented vanilla JS | 2026
   ============================================================ */

'use strict';

/* ── 1. PRELOADER ─────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 1800);
  });
})();

/* ── 2. CUSTOM CURSOR (desktop only) ─────────────────────── */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left  = dotX + 'px';
    dot.style.top   = dotY + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (dotX - ringX) * 0.14;
    ringY += (dotY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .portfolio-item, .service-card, .filter-btn, .stat-card'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ── 3. SCROLL PROGRESS BAR ───────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = scrollHeight > 0
      ? Math.min((scrollTop / scrollHeight) * 100, 100) + '%'
      : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
})();

/* ── 4. NAVBAR ────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = navLinks.querySelectorAll('.nav-link');

  // Sticky scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlighting via Intersection Observer
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(l => l.classList.remove('active'));
        const active = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => io.observe(sec));
})();

/* ── 5. SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navbarH = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 6. THEME TOGGLE ──────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const saved = localStorage.getItem('me-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('me-theme', next);
  });

  function applyTheme(theme) {
    html.dataset.theme = theme;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
})();

/* ── 7. SCROLL REVEAL ─────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── 8. COUNTER ANIMATIONS ────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800;
      const start  = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ── 9. SKILL BARS ────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const pcts = document.querySelectorAll('.skill-pct');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      bars.forEach((bar, i) => {
        const w = bar.dataset.width;
        setTimeout(() => {
          bar.style.width = w + '%';
          bar.classList.add('animated');
        }, i * 120);
      });
      pcts.forEach(pct => {
        const target = parseInt(pct.dataset.pct, 10);
        const dur  = 1500;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          pct.textContent = Math.floor(ease * target) + '%';
          if (p < 1) requestAnimationFrame(tick);
          else pct.textContent = target + '%';
        }
        requestAnimationFrame(tick);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const skillsSection = document.querySelector('.skills');
  if (skillsSection) io.observe(skillsSection);
})();

/* ── 10. TYPING TEXT EFFECT ───────────────────────────────── */
(function initTyping() {
  const el    = document.getElementById('typedText');
  if (!el) return;
  const words = ['Graphic Designer', 'Video Editor', 'Motion Artist', 'Audio Producer'];
  let wi = 0, ci = 0, deleting = false;
  const TYPE_SPEED   = 95;
  const DELETE_SPEED = 50;
  const PAUSE_FULL   = 2200;
  const PAUSE_EMPTY  = 500;

  function type() {
    const word    = words[wi];
    const current = deleting
      ? word.substring(0, ci - 1)
      : word.substring(0, ci + 1);

    el.textContent = current;
    ci = deleting ? ci - 1 : ci + 1;

    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;
    if (!deleting && current === word) {
      delay = PAUSE_FULL;
      deleting = true;
    } else if (deleting && current === '') {
      deleting = false;
      wi = (wi + 1) % words.length;
      delay = PAUSE_EMPTY;
    }
    setTimeout(type, delay);
  }
  type();
})();

/* ── 11. PARTICLE CANVAS ──────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
      ctx.fill();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 12. PARALLAX (hero image) ────────────────────────────── */
(function initParallax() {
  const el = document.querySelector('[data-parallax]');
  if (!el) return;
  window.addEventListener('scroll', () => {
    const factor = parseFloat(el.dataset.parallax);
    el.style.transform = `translateY(${window.scrollY * factor}px)`;
  }, { passive: true });
})();

/* ── 13. PORTFOLIO FILTER ─────────────────────────────────── */
(function initPortfolioFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.portfolio-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
        // Re-trigger reveal
        if (match) {
          item.style.opacity   = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 10);
        }
      });
    });
  });
})();

/* ── 14. PORTFOLIO MODAL ──────────────────────────────────── */
(function initModal() {
  const overlay  = document.getElementById('portfolioModal');
  const closeBtn = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  const modalTags  = document.getElementById('modalTags');
  const modalCta   = document.getElementById('modalCta');

  function openModal(item) {
    const { title, desc, img, tags } = item.dataset;
    modalImg.src = img || '';
    modalImg.alt = title || '';
    modalTitle.textContent = title || '';
    modalDesc.textContent  = desc  || '';
    modalTags.innerHTML = (tags || '').split(',').map(t =>
      `<span>${t.trim()}</span>`
    ).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-open').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.closest('.portfolio-item')));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Also close when CTA inside modal is clicked
  if (modalCta) modalCta.addEventListener('click', closeModal);
})();

/* ── 15. TESTIMONIALS SLIDER ──────────────────────────────── */
(function initSlider() {
  const slider   = document.getElementById('testimonialsSlider');
  const slides   = slider.querySelectorAll('.testimonial-slide');
  const prevBtn  = document.getElementById('sliderPrev');
  const nextBtn  = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');
  let current    = 0;
  let autoTimer  = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goto(i));
    dotsWrap.appendChild(dot);
  });

  function goto(index) {
    current = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goto(current + 1); }
  function prev() { goto(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }
  resetAuto();

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', resetAuto);

  // Touch support
  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  });
})();

/* ── 16. CONTACT FORM VALIDATION ──────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');

  const fields = {
    name:    { input: document.getElementById('fname'),    error: document.getElementById('nameError'),    validate: v => v.trim().length >= 2 || 'Please enter your full name.' },
    email:   { input: document.getElementById('femail'),   error: document.getElementById('emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.' },
    subject: { input: document.getElementById('fsubject'), error: document.getElementById('subjectError'), validate: v => v.trim().length >= 3 || 'Subject must be at least 3 characters.' },
    message: { input: document.getElementById('fmessage'), error: document.getElementById('messageError'), validate: v => v.trim().length >= 10 || 'Message must be at least 10 characters.' },
  };

  // Live validation
  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener('input', () => {
      const result = validate(input.value);
      if (result === true) {
        error.textContent = '';
        input.classList.remove('error');
      } else {
        error.textContent = result;
        input.classList.add('error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const result = validate(input.value);
      if (result !== true) {
        error.textContent = result;
        input.classList.add('error');
        valid = false;
      } else {
        error.textContent = '';
        input.classList.remove('error');
      }
    });

    if (!valid) return;

    // Simulate send
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });
})();

/* ── 17. BACK TO TOP ──────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 18. LAZY LOAD IMAGES ─────────────────────────────────── */
(function initLazyLoad() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => io.observe(img));
  }
})();

/* ── 19. SERVICE CARD TILT ─────────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.service-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── 20. FLOATING SHAPES MOUSE PARALLAX ───────────────────── */
(function initShapeParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const shapes = document.querySelectorAll('.float-shape');
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    shapes.forEach((s, i) => {
      const factor = (i + 1) * 0.012;
      const dx = (e.clientX - cx) * factor;
      const dy = (e.clientY - cy) * factor;
      s.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }, { passive: true });
})();

console.log('%c Marwan ElSayed Portfolio — 2026 ', 'background:#6366F1;color:#fff;font-weight:700;padding:6px 12px;border-radius:4px;');
