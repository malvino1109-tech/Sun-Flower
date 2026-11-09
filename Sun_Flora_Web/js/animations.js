/**
 * Garden Scroll & Bloom Animation Controller
 * Manages IntersectionObserver triggers, scroll progress, parallax, and navigation.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll Progress Bar & Flower Thumb
  const progressBar = document.getElementById('scroll-progress-bar');
  const progressFlower = document.getElementById('progress-flower');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    progressBar.style.width = `${progress}%`;
    if (progressFlower) {
      progressFlower.style.transform = `rotate(${progress * 3.6}deg)`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // 2. Intersection Observer for Scroll Reveals
  const scrollElements = document.querySelectorAll('.animate-on-scroll, .stagger-group');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // If it's a one-way reveal, unobserve
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollElements.forEach(el => scrollObserver.observe(el));

  // 3. Flower Blooming Triggers (Hero, Marigold section, Sunflower section, Footer)
  const bloomTargets = document.querySelectorAll('.bloom-target');
  const bloomObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-bloomed');
      }
    });
  }, { threshold: 0.2 });

  bloomTargets.forEach(el => bloomObserver.observe(el));

  // 4. Stem Growth Triggers
  const stemTargets = document.querySelectorAll('.stem-target');
  const stemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-grown');
      }
    });
  }, { threshold: 0.15 });

  stemTargets.forEach(el => stemObserver.observe(el));

  // 5. Parallax Scrolling on Decorative Foliage
  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.1');
            const offset = (scrollY * speed) % 80;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 6. Sticky Nav styling & Active Link Scroll Spy
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.pageYOffset + 140;

    if (siteNav) {
      if (window.pageYOffset > 40) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 7. Mobile Navigation Menu Toggle
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Initial trigger for hero items
  window.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress();
    updateActiveNav();
    // Trigger hero flowers after subtle load delay
    setTimeout(() => {
      document.querySelectorAll('#hero .bloom-target').forEach(el => el.classList.add('is-bloomed'));
      document.querySelectorAll('#hero .stem-target').forEach(el => el.classList.add('is-grown'));
    }, 200);
  });
})();
