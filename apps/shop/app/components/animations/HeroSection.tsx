import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from '@remix-run/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WebGLNoise } from './WebGLNoise';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Noise texture for grain overlay
const NOISE_PNG = 'https://cdn.shopify.com/oxygen-v2/25850/10228/21102/2758078/assets/noise-Q6CzNatq.png';

// Hero images - stacked cards
const HERO_IMAGES = [
  '/images/4.jpg',
  '/images/9.jpg',
  '/images/6.jpg',
];

// ===========================================================================
// CONFIGURATION: SHOPIFY SUPPLY ANIMATION SETTINGS
// ===========================================================================

// Scroll physics - power3.out for exit animations
const SCATTER_EASE = 'power3.out';

// Hero range multiplier - 1.15x viewport for fixed-range hero animation
const HERO_RANGE_MULTIPLIER = 1.15;

// Stagger timing
const IMAGE_STAGGER = 0.04;
const LETTER_STAGGER = 0.05;

// Duration values
const DURATIONS = {
  opacity: 0.2,
  rotation: 0.3,
  titleLetters: 0.5,
  text: 0.6,
};

// Card scatter configuration - spiral vortex effect
const CARD_CONFIG = [
  { x: -180, y: -50, r: -20, scale: 0.75, z: 1 },
  { x: -150, y: 60, r: 30, scale: 0.85, z: 2 },
  { x: -120, y: 10, r: -10, scale: 0.65, z: 3 },
];

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(() => prefersReducedMotion());

  // Reduced motion preference listener
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq) {
      const onChange = () => setReduceMotion(mq.matches);
      onChange();
      mq.addEventListener?.('change', onChange);
      return () => mq.removeEventListener?.('change', onChange);
    }
    return undefined;
  }, []);

  // GSAP scroll-scrubbed animation
  useLayoutEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Wait for DOM to be stable
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const cardsInner = cardInnerRefs.current.filter(Boolean) as HTMLDivElement[];
      const line1 = titleLine1Ref.current;
      const line2 = titleLine2Ref.current;
      const heroCopy = heroCopyRef.current;

      if (!cards.length || !line1 || !line2 || !heroCopy) return;

      // Calculate hero range (fixed, not based on total scroll)
      const HERO_RANGE = window.innerHeight * HERO_RANGE_MULTIPLIER;

      // A. Initial State: Messy pile stacked in center
      cards.forEach((el) => {
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: Math.random() * 20 - 10,
          y: Math.random() * 20 - 10,
          rotation: Math.random() * 6 - 3,
          scale: 1,
          opacity: 1,
        });
      });

      // Set inner wrappers for velocity impulse
      cardsInner.forEach((el) => {
        gsap.set(el, { rotation: 0, scale: 1, transformOrigin: '50% 50%' });
      });

      // TITLE: Initial state - slide up from below with skew
      gsap.set([line1, line2], {
        yPercent: 120,
        skewY: 12,
        autoAlpha: 1,
      });

      // TAGLINE: Initial state
      gsap.set(heroCopy, {
        autoAlpha: 0,
        y: 20,
      });

      // B. ENTRANCE ANIMATION (plays immediately on load)
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      entranceTl.to(line1, {
        yPercent: 0,
        skewY: 0,
        duration: 0.5,
      }, 0);

      entranceTl.to(line2, {
        yPercent: 0,
        skewY: 0,
        duration: 0.5,
      }, LETTER_STAGGER);

      entranceTl.to(heroCopy, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
      }, 0.1);

      // C. SCROLL EXIT TIMELINE (scrubbed with scroll)
      const exitTl = gsap.timeline({
        defaults: { ease: SCATTER_EASE },
      });

      // Cards scatter left with rotation - spiral vortex effect
      cards.forEach((el, i) => {
        const config = CARD_CONFIG[i] || CARD_CONFIG[0];
        exitTl.to(el, {
          xPercent: config.x,
          yPercent: config.y,
          rotation: config.r,
          scale: config.scale,
          opacity: 0,
          stagger: IMAGE_STAGGER,
          duration: DURATIONS.rotation,
        }, 0);
      });

      // TITLE EXIT: Slide up and out
      exitTl.to(line1, {
        yPercent: -100,
        ease: 'power3.out',
        duration: DURATIONS.titleLetters,
      }, 0);

      exitTl.to(line2, {
        yPercent: -100,
        ease: 'power3.out',
        duration: DURATIONS.titleLetters,
      }, LETTER_STAGGER);

      // TAGLINE EXIT: Fade out
      exitTl.to(heroCopy, {
        autoAlpha: 0,
        ease: 'power4.out',
        duration: DURATIONS.text,
      }, '<');

      // D. Velocity-based impulse on inner wrappers
      const rotTo = cardsInner.map((el) =>
        gsap.quickTo(el, 'rotation', { duration: 0.18, ease: 'power3.out' })
      );
      const scaleTo = cardsInner.map((el) =>
        gsap.quickTo(el, 'scale', { duration: 0.18, ease: 'power3.out' })
      );

      // E. ScrollTrigger for vertical scroll
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${HERO_RANGE}`,
        scrub: true,
        animation: exitTl,
        pin: true,
        pinSpacing: true,
        onUpdate(self) {
          // Velocity-driven impulse for organic feel
          const v = Math.abs(self.getVelocity());
          const energy = gsap.utils.clamp(0, 1, v / 2500);

          cardsInner.forEach((_, i) => {
            rotTo[i](energy * (i % 2 === 0 ? 3 : -3));
            scaleTo[i](1 + energy * 0.03);
          });
        },
      });

      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-wolf-black"
    >
      {/* WebGL Noise Background */}
      <WebGLNoise className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-[1]"
        style={{
          backgroundImage: `url(${NOISE_PNG})`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Hero images - GSAP controlled card stack */}
      <div className="absolute inset-0 z-[5]">
        {HERO_IMAGES.map((img, idx) => {
          const config = CARD_CONFIG[idx] || CARD_CONFIG[0];
          return (
            <div
              key={img}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="absolute"
              style={{
                width: 'clamp(180px, 22vw, 300px)',
                aspectRatio: '3 / 4',
                top: '50%',
                left: '50%',
                zIndex: config.z,
                willChange: reduceMotion ? undefined : 'transform, opacity',
              }}
            >
              {/* Inner wrapper for impulse transforms */}
              <div
                ref={(el) => (cardInnerRefs.current[idx] = el)}
                className="w-full h-full"
                style={{
                  willChange: reduceMotion ? undefined : 'transform',
                }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover select-none rounded"
                  style={{
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 8px 20px -5px rgba(0, 0, 0, 0.3)',
                  }}
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Status Badge */}
        <div
          ref={heroCopyRef}
          className="hero-copy"
        >
          <div className="nav-status justify-center mb-8">
            <div className="nav-dot" />
            <span>Drop 001: Live Now</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/products" className="btn-primary">
              SHOP NOW
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="https://neoball.co" className="btn-secondary">
              EXPLORE NEOBALL
            </a>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges justify-center flex-wrap">
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              90-Day Guarantee
            </span>
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Shipping
            </span>
            <span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </span>
          </div>
        </div>

        {/* TITLE ANIMATION - GSAP controlled slide up */}
        <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          {/* Line 1: LOCK IN. */}
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine1Ref}
              className="hero-title text-center"
            >
              LOCK IN.
            </div>
          </div>
          {/* Line 2: LEVEL UP. */}
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine2Ref}
              className="hero-title text-cyan text-center"
            >
              LEVEL UP.
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-subtitle animate-float z-20">
        Scroll to explore
      </div>
    </section>
  );
}
