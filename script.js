// ── GBG Gang Website – script.js ──

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Glitch effect on hero title ──────────────────────────────────────
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.classList.add('glitch');
  }

  // ── 2. Scroll-reveal for .reveal elements ────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));

  // ── 3. Staggered reveal for lists & grids ────────────────────────────────
  const staggerGroups = document.querySelectorAll('.rules-list, .ranks-grid, .about-stats, .requirements');
  staggerGroups.forEach((group) => {
    const children = group.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  // ── 4. Active nav link on scroll ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  // ── 5. Typing cursor for hero tag ─────────────────────────────────────────
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const text = heroTag.textContent;
    heroTag.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        heroTag.textContent += text[i++];
        setTimeout(type, 60);
      } else {
        heroTag.style.borderRight = 'none';
      }
    };
    heroTag.style.borderRight = '1px solid rgba(255,255,255,0.4)';
    heroTag.style.paddingRight = '4px';
    setTimeout(type, 600);
  }

  // ── 6. Parallax on hero grid ──────────────────────────────────────────────
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 20;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGrid.style.transform = `translate(${xRatio}px, ${yRatio}px)`;
    });
  }

  // ── 7. Smooth nav background on scroll ───────────────────────────────────
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(0,0,0,0.97)';
      nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    } else {
      nav.style.background = '';
      nav.style.borderBottomColor = '';
    }
  });

  // ── 8. Counter animation for stat numbers ────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1200;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const tick = () => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current < target) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => counterObserver.observe(el));

});
