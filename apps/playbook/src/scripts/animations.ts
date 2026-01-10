/**
 * Premium Animation System
 * Award-winning micro-interactions for Bulletproof Ankles
 *
 * Features:
 * - Scroll-triggered reveals with IntersectionObserver
 * - Staggered cascade animations
 * - Spring physics timing
 * - Number countup animations
 * - Smooth accordion transitions
 * - Touch ripple effects
 * - Progress tracking
 */

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function initScrollReveal(options: RevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay || '0';
          const stagger = el.dataset.revealStagger;

          // Calculate stagger delay for cascades
          const staggerDelay = stagger ?
            Array.from(el.parentElement?.querySelectorAll('[data-reveal]') || []).indexOf(el) * parseInt(stagger) : 0;

          setTimeout(() => {
            el.classList.add('revealed');
            el.style.transitionDelay = '0ms'; // Reset after animation
          }, parseInt(delay) + staggerDelay);

          if (once) observer.unobserve(el);
        }
      });
    },
    { threshold, rootMargin }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

  return observer;
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER COUNTUP
// ═══════════════════════════════════════════════════════════════════════════

export function initCountUp() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = el.dataset.countTo || el.textContent || '0';
          const duration = parseInt(el.dataset.countDuration || '1500');

          animateValue(el, 0, target, duration);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count-up]').forEach((el) => observer.observe(el));
}

function animateValue(el: HTMLElement, start: number, end: string, duration: number) {
  // Handle special cases like "8-12" or "ALL"
  if (end.includes('-') || isNaN(parseInt(end))) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
      el.textContent = end;
      el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
    return;
  }

  const endNum = parseInt(end);
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic for satisfying deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (endNum - start) * eased);

    el.textContent = current.toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = end; // Ensure exact final value
    }
  };

  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════════════════════════════════
// TOUCH RIPPLE EFFECT
// ═══════════════════════════════════════════════════════════════════════════

export function initTouchRipple() {
  document.querySelectorAll('[data-ripple]').forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      const event = e as PointerEvent;
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      target.style.position = 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH ACCORDION
// ═══════════════════════════════════════════════════════════════════════════

export function initAccordion() {
  document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const triggers = accordion.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('[data-accordion-item]');
        const content = item?.querySelector('[data-accordion-content]') as HTMLElement;
        const icon = trigger.querySelector('[data-accordion-icon]') as HTMLElement;

        if (!content) return;

        const isOpen = item?.classList.contains('open');

        // Close all others (single-open mode)
        if (accordion.hasAttribute('data-accordion-single')) {
          accordion.querySelectorAll('[data-accordion-item].open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('open');
              const openContent = openItem.querySelector('[data-accordion-content]') as HTMLElement;
              const openIcon = openItem.querySelector('[data-accordion-icon]') as HTMLElement;
              if (openContent) {
                openContent.style.maxHeight = '0';
                openContent.style.opacity = '0';
              }
              if (openIcon) openIcon.style.transform = 'rotate(0deg)';
            }
          });
        }

        if (isOpen) {
          item?.classList.remove('open');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          item?.classList.add('open');
          content.style.maxHeight = `${content.scrollHeight + 20}px`;
          content.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

export function initScrollProgress() {
  const progressBar = document.querySelector('[data-scroll-progress]') as HTMLElement;
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ═══════════════════════════════════════════════════════════════════════════
// DRILL PROGRESS TRACKER
// ═══════════════════════════════════════════════════════════════════════════

export function initDrillProgress() {
  const drillCards = document.querySelectorAll('.drill-card');
  const progressDots = document.querySelector('[data-drill-progress]');

  if (!drillCards.length || !progressDots) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(drillCards).indexOf(entry.target);
          updateDrillProgress(index);
        }
      });
    },
    { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
  );

  drillCards.forEach((card) => observer.observe(card));
}

function updateDrillProgress(activeIndex: number) {
  const dots = document.querySelectorAll('[data-drill-dot]');
  dots.forEach((dot, i) => {
    if (i <= activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PARALLAX HERO
// ═══════════════════════════════════════════════════════════════════════════

export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (!parallaxElements.length) return;

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const element = el as HTMLElement;
      const speed = parseFloat(element.dataset.parallax || '0.5');
      const offset = scrollY * speed;

      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════════════
// VIDEO SHIMMER PLACEHOLDER
// ═══════════════════════════════════════════════════════════════════════════

export function initVideoShimmer() {
  document.querySelectorAll('[data-video-placeholder]').forEach((el) => {
    el.classList.add('shimmer-loading');
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MAGNETIC BUTTON EFFECT
// ═══════════════════════════════════════════════════════════════════════════

export function initMagneticButtons() {
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const button = btn as HTMLElement;

    button.addEventListener('mousemove', (e) => {
      const event = e as MouseEvent;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      const strength = parseFloat(button.dataset.magnetic || '0.3');
      button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
      button.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    button.addEventListener('mouseenter', () => {
      button.style.transition = 'none';
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZE ALL
// ═══════════════════════════════════════════════════════════════════════════

export function initAllAnimations() {
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  initScrollReveal();
  initCountUp();
  initTouchRipple();
  initAccordion();
  initScrollProgress();
  initDrillProgress();
  initParallax();
  initVideoShimmer();
  initMagneticButtons();

  // Add loaded class for initial animations
  document.body.classList.add('animations-ready');
}

// Auto-init
initAllAnimations();
