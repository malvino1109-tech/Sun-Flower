/**
 * Main Application Orchestrator & Interactive Enhancements
 * Menebar Benih, Menumbuhkan Harapan
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Smooth Scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. Interactive Steps (Sunflower & Marigold)
  // Clicking a step marks it active / focused with gentle tactile vibration if available
  const allStepCards = document.querySelectorAll('.step-card');
  allStepCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active style
      card.classList.toggle('step-checked');
      if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    });
  });

  // 3. Flower Petal Burst Effect (on CTA click)
  const ctaButtons = document.querySelectorAll('.trigger-petal-burst');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      createPetalBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
    });
  });

  function createPetalBurst(originX, originY) {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.left = '0';
    burstContainer.style.top = '0';
    burstContainer.style.width = '100vw';
    burstContainer.style.height = '100vh';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '999';
    document.body.appendChild(burstContainer);

    const colors = ['#FFD447', '#F28C28', '#FFA834', '#789B59'];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.style.position = 'absolute';
      petal.style.left = `${originX}px`;
      petal.style.top = `${originY}px`;
      petal.style.width = `${Math.random() * 12 + 10}px`;
      petal.style.height = `${Math.random() * 16 + 12}px`;
      petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      petal.style.borderRadius = '50% 0 50% 50%';
      petal.style.opacity = '1';
      petal.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
      burstContainer.appendChild(petal);

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 140 + 60;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 40;
      const rot = Math.random() * 360;

      requestAnimationFrame(() => {
        petal.style.transform = `translate(${destX}px, ${destY}px) rotate(${rot}deg) scale(0.6)`;
        petal.style.opacity = '0';
      });
    }

    setTimeout(() => {
      burstContainer.remove();
    }, 1300);
  }

  // 4. Back to top buttons controller
  const floatingBackToTop = document.getElementById('floating-back-to-top');
  if (floatingBackToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 450) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    }, { passive: true });

    floatingBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const backToTopLink = document.getElementById('back-to-top');
  if (backToTopLink) {
    backToTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Log welcoming console message
  console.log('%c🌻 Menebar Benih, Menumbuhkan Harapan 🌼', 'font-size: 16px; font-weight: bold; color: #F28C28;');
});
