/**
 * Floating & Falling Botanical Petals Simulation
 * Creates a soothing garden breeze effect with falling sunflower and marigold petals.
 * Optimized for mobile QR-code scanning with auto-pause and reduced-motion checks.
 */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Responsive petal count (fewer on mobile for battery saving)
  const isMobile = window.innerWidth < 768;
  const PETAL_COUNT = isMobile ? 18 : 34;

  const PETAL_COLORS = [
    { fill: '#FFD447', stroke: '#E5BD35', type: 'sunflower' },
    { fill: '#F28C28', stroke: '#D97718', type: 'marigold' },
    { fill: '#FFA834', stroke: '#E59220', type: 'marigold-blend' },
    { fill: '#FFE27A', stroke: '#F2CE55', type: 'sunflower-light' },
    { fill: '#88AB67', stroke: '#6F914E', type: 'leaf-speck' }
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 8; // 8px - 16px
      this.speedY = Math.random() * 0.9 + 0.6; // gentle fall
      this.speedX = Math.random() * 0.6 - 0.3; // subtle horizontal drift
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.6;
      this.flip = Math.random();
      this.flipSpeed = Math.random() * 0.02 + 0.01;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayDistance = Math.random() * 1.5 + 0.8;
      this.opacity = Math.random() * 0.45 + 0.45; // soft aesthetic opacity
      this.palette = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    }

    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * this.swayDistance + this.speedX;
      this.rotation += this.rotSpeed;
      this.flip += this.flipSpeed;

      // Wrap around edges
      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin(this.flip));

      ctx.fillStyle = this.palette.fill;
      ctx.strokeStyle = this.palette.stroke;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = this.opacity;

      ctx.beginPath();
      if (this.palette.type === 'leaf-speck') {
        // Oval leaf shape
        ctx.moveTo(0, -this.size * 0.6);
        ctx.quadraticCurveTo(this.size * 0.4, 0, 0, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.4, 0, 0, -this.size * 0.6);
      } else {
        // Botanical petal shape (tapered top & bottom)
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.4, this.size * 0.5, this.size * 0.6, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.5, this.size * 0.6, -this.size * 0.6, -this.size * 0.4, 0, -this.size);
      }
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  const petals = [];
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  let isRunning = true;
  let animationFrameId;

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });

  // Pause when tab is not active to save battery on mobile
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    }
  });

  // Start animation loop
  render();
})();
