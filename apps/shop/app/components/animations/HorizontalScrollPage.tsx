import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from '@remix-run/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WebGLNoise } from './WebGLNoise';
import { NeoBall3D } from './NeoBall3D';
import { GlassMorphicHeader } from '../GlassMorphicHeader';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===========================================================================
// SHOPIFY SUPPLY EXACT CONFIGURATION
// ===========================================================================

// Noise texture
const NOISE_PNG = 'https://cdn.shopify.com/oxygen-v2/25850/10228/21102/2758078/assets/noise-Q6CzNatq.png';

// Hero images - stacked cards (top to bottom layering)
// Order: 14.png (top/front) → 17.png (bottom/back) - 4.jpg moved to wolfpack section
const HERO_IMAGES = [
  '/images/14.png',  // 1. Top (front) - highest z-index
  '/images/9.jpg',   // 2.
  '/images/11.png',  // 3.
  '/images/12.png',  // 4.
  '/images/13.png',  // 5.
  '/images/18.png',  // 6.
  '/images/17.png',  // 7. Bottom (back) - lowest z-index
];

// Colors from Supply
const COLORS = {
  darkThemeWhite: '#eeece2',
  darkGray: '#2a2a2a',
  aloe: '#6FC992',
  middleGray: '#B3B2AA',
  offWhite: '#eeece2',
  cyan: '#00EBF7',
};

// Scroll physics - EXACT Supply settings
const SCATTER_EASE = 'power3.out';
const PIN_DISTANCE_MULTIPLIER = 1.5; // Desktop: 1.5x viewport
const MOBILE_PIN_MULTIPLIER = 1.0;   // Mobile: 1x viewport

// Stagger timing - from Supply codebase
const IMAGE_STAGGER = 0.04;
const LETTER_STAGGER = 0.05;

// Duration values
const DURATIONS = {
  opacity: 0.2,
  rotation: 0.3,
  titleLetters: 0.5,
  text: 0.6,
};

// Card scatter configuration - spiral vortex (REVERSED z-index: first image = TOP)
// 7 images with z-index: 7 (top/front) → 1 (bottom/back)
const CARD_CONFIG = [
  { x: -220, y: -70,  r: -25, scale: 0.75, z: 7 },  // Image 1 - TOP (front)
  { x: -200, y: 90,   r: 35,  scale: 0.82, z: 6 },  // Image 2
  { x: -180, y: -110, r: -45, scale: 0.65, z: 5 },  // Image 3
  { x: -160, y: 50,   r: 15,  scale: 0.78, z: 4 },  // Image 4
  { x: -140, y: -40,  r: -10, scale: 0.72, z: 3 },  // Image 5
  { x: -125, y: 70,   r: 40,  scale: 0.65, z: 2 },  // Image 6
  { x: -110, y: -30,  r: -20, scale: 0.58, z: 1 },  // Image 7 - BOTTOM (back)
];

// Wheel config - Lenis-like smooth scroll
const WHEEL_CONFIG = {
  maxDelta: 200,
  multiplier: 1.35,
  duration: 0.35,
  ease: 'power3.out',
};

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function splitLetters(text: string) {
  return Array.from(text).map((ch, idx) => ({ ch, key: `${ch}-${idx}` }));
}

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
}

interface HorizontalScrollPageProps {
  products: Product[];
}

export function HorizontalScrollPage({ products }: HorizontalScrollPageProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [impulse, setImpulse] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(() => prefersReducedMotion());
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  // GSAP refs
  const cardOuterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);

  // Wheel scroll target
  const wheelTargetRef = useRef(0);

  const title1 = useMemo(() => splitLetters('WINTER ARC'), []);
  const title2 = useMemo(() => splitLetters('PERFORMANCE'), []);

  // Reduced motion listener
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

  // Lock body scroll for horizontal experience
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Laser beam sweep animation (runs once on load)
  useEffect(() => {
    if (reduceMotion || !laserBeamRef.current) return;

    const beam = laserBeamRef.current;

    // Initial state - start from left, invisible
    gsap.set(beam, {
      xPercent: -100,
      opacity: 0,
    });

    // Animate the laser sweep after a short delay
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(beam, {
      opacity: 1,
      duration: 0.1,
    })
    .to(beam, {
      xPercent: 200,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '<')
    .to(beam, {
      opacity: 0,
      duration: 0.3,
    }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, [reduceMotion]);

  // GSAP-powered wheel handler (Lenis-like smooth scroll)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    wheelTargetRef.current = el.scrollLeft;
    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

    const scrollToX = gsap.quickTo(el, 'scrollLeft', {
      duration: WHEEL_CONFIG.duration,
      ease: WHEEL_CONFIG.ease,
      overwrite: true,
      onUpdate: () => ScrollTrigger.update(),
    });

    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      e.preventDefault();

      const delta = gsap.utils.clamp(-WHEEL_CONFIG.maxDelta, WHEEL_CONFIG.maxDelta, e.deltaY);
      wheelTargetRef.current = gsap.utils.clamp(0, maxScroll(), wheelTargetRef.current + delta * WHEEL_CONFIG.multiplier);
      scrollToX(wheelTargetRef.current);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Pointer drag handler (mobile swipe)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      el.setPointerCapture?.(e.pointerId);
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      wheelTargetRef.current = el.scrollLeft;
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScrollLeft - dx;
      wheelTargetRef.current = el.scrollLeft;
    };

    const onUp = () => {
      isDown = false;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []);

  // Progress and impulse tracker
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const dx = Math.abs(el.scrollLeft - lastScrollRef.current);

      // Calculate velocity (pixels per second) and normalize to 0-1
      const velocity = (dx / dt) * 1000;
      const normalizedImpulse = gsap.utils.clamp(0, 1, velocity / 2000);
      setImpulse(normalizedImpulse);

      lastScrollRef.current = el.scrollLeft;
      lastTimeRef.current = now;

      const max = Math.max(1, el.scrollWidth - el.clientWidth);
      setProgress(gsap.utils.clamp(0, 1, el.scrollLeft / max));
      wheelTargetRef.current = el.scrollLeft;

      // Hide hero container after scrolling past hero section (1.2x viewport)
      const heroContainer = heroContainerRef.current;
      if (heroContainer) {
        const hideThreshold = el.clientWidth * 1.2;
        heroContainer.style.visibility = el.scrollLeft > hideThreshold ? 'hidden' : 'visible';
      }
    };

    // Decay impulse when not scrolling
    const decayInterval = setInterval(() => {
      setImpulse(prev => prev * 0.9);
    }, 50);

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(decayInterval);
    };
  }, []);

  // GSAP scroll-scrubbed hero animation
  useLayoutEffect(() => {
    if (reduceMotion) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const cards = cardOuterRefs.current.filter(Boolean) as HTMLDivElement[];
      const cardsInner = cardInnerRefs.current.filter(Boolean) as HTMLDivElement[];
      const line1 = titleLine1Ref.current;
      const line2 = titleLine2Ref.current;
      const heroCopy = heroCopyRef.current;

      if (!cards.length || !line1 || !line2 || !heroCopy) return;

      // DESKTOP
      mm.add('(min-width: 769px)', () => {
        const PIN_DISTANCE = scroller.clientWidth * PIN_DISTANCE_MULTIPLIER;

        // Initial State: Messy pile
        cards.forEach((el) => {
          gsap.set(el, {
            xPercent: -50,
            yPercent: -50,
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15,
            rotation: Math.random() * 8 - 4,
            scale: 1,
            opacity: 1,
          });
        });

        cardsInner.forEach((el) => {
          gsap.set(el, { rotation: 0, scale: 1, transformOrigin: '50% 50%' });
        });

        // Title: Start below with skew
        gsap.set([line1, line2], {
          yPercent: 120,
          skewY: 12,
          autoAlpha: 1,
        });

        gsap.set(heroCopy, {
          autoAlpha: 0,
          y: 20,
        });

        // Entrance animation
        const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        entranceTl.to(line1, { yPercent: 0, skewY: 0, duration: 0.5 }, 0);
        entranceTl.to(line2, { yPercent: 0, skewY: 0, duration: 0.5 }, LETTER_STAGGER);
        entranceTl.to(heroCopy, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1);

        // Exit timeline (scroll-scrubbed) - TWO PHASES for clean transition
        const tl = gsap.timeline({ defaults: { ease: SCATTER_EASE } });

        // PHASE 1 (0-60%): Cards scatter to positions
        cards.forEach((el, i) => {
          const cfg = CARD_CONFIG[i] || CARD_CONFIG[0];
          tl.to(el, {
            xPercent: cfg.x,
            yPercent: cfg.y,
            rotation: cfg.r,
            scale: cfg.scale,
            duration: DURATIONS.rotation,
          }, i * IMAGE_STAGGER);
        });

        // Title exit during Phase 1
        tl.to(line1, { yPercent: -100, duration: DURATIONS.titleLetters }, 0);
        tl.to(line2, { yPercent: -100, duration: DURATIONS.titleLetters }, LETTER_STAGGER);
        tl.to(heroCopy, { autoAlpha: 0, duration: DURATIONS.text }, '<');

        // PHASE 2 (60-100%): Cards fly out LEFT and fade - clean exit
        // This happens AFTER scatter, so next section slides in clean
        tl.to(cards, {
          xPercent: -250,       // Fly far left off-screen
          rotation: '-=18',     // Additional rotation as they exit
          opacity: 0,           // Fade out completely
          stagger: IMAGE_STAGGER,
          duration: 0.4,
          ease: 'power2.in',
        }, '+=0.1');  // Small gap after scatter phase

        // Velocity impulse
        const rotTo = cardsInner.map((el) =>
          gsap.quickTo(el, 'rotation', { duration: 0.18, ease: 'power3.out' })
        );
        const scaleTo = cardsInner.map((el) =>
          gsap.quickTo(el, 'scale', { duration: 0.18, ease: 'power3.out' })
        );

        ScrollTrigger.create({
          scroller,
          horizontal: true,
          start: 0,
          end: `+=${PIN_DISTANCE}`,
          scrub: true,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const v = Math.abs(self.getVelocity());
            const energy = gsap.utils.clamp(0, 1, v / 2500);
            cardsInner.forEach((_, i) => {
              rotTo[i](energy * (i % 2 === 0 ? 3 : -3));
              scaleTo[i](1 + energy * 0.03);
            });
          },
        });
      });

      // MOBILE
      mm.add('(max-width: 768px)', () => {
        const PIN_DISTANCE = scroller.clientWidth * MOBILE_PIN_MULTIPLIER;

        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
        });

        gsap.set([line1, line2], { yPercent: 120, skewY: 12, autoAlpha: 1 });
        gsap.set(heroCopy, { autoAlpha: 0, y: 20 });

        const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        entranceTl.to(line1, { yPercent: 0, skewY: 0, duration: 0.5 }, 0);
        entranceTl.to(line2, { yPercent: 0, skewY: 0, duration: 0.5 }, 0.05);
        entranceTl.to(heroCopy, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1);

        const tl = gsap.timeline({ defaults: { ease: SCATTER_EASE } });
        tl.to(cards, {
          xPercent: -200,
          rotation: -12,
          stagger: IMAGE_STAGGER,
          duration: DURATIONS.rotation,
        }, 0);
        tl.to(line1, { yPercent: -100, duration: DURATIONS.titleLetters }, 0);
        tl.to(line2, { yPercent: -100, duration: DURATIONS.titleLetters }, LETTER_STAGGER);
        tl.to(heroCopy, { autoAlpha: 0, duration: DURATIONS.text }, '<');

        ScrollTrigger.create({
          scroller,
          horizontal: true,
          start: 0,
          end: `+=${PIN_DISTANCE}`,
          scrub: true,
          animation: tl,
          invalidateOnRefresh: true,
        });
      });

      ScrollTrigger.refresh();
    }, scroller);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Get featured product (basketball)
  const featuredProduct = products[0];

  return (
    <div
      className="relative text-white w-screen h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/images/shopbg6.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navigation Bar - Fixed at top with glass morphism */}
      <GlassMorphicHeader />

      {/* WebGL Noise */}
      <WebGLNoise className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 z-[2]"
        style={{
          backgroundImage: `url(${NOISE_PNG})`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Fixed hero layer - hidden after scroll animation completes */}
      <div
        ref={heroContainerRef}
        className="fixed top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none"
      >
        {/* Laser beam sweep effect */}
        <div
          ref={laserBeamRef}
          className="absolute top-0 left-0 w-full h-full z-[100] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,246,224,0) 35%, rgba(0,246,224,0.2) 45%, rgba(0,246,224,0.5) 50%, rgba(0,246,224,0.2) 55%, rgba(0,246,224,0) 65%, transparent 100%)',
            opacity: 0,
          }}
        />

        {/* Hero images - GSAP controlled */}
        <div className="absolute w-full h-full top-0 left-0 overflow-visible">
          {HERO_IMAGES.map((img, idx) => {
            const config = CARD_CONFIG[idx] || CARD_CONFIG[0];
            return (
              <div
                key={img}
                ref={(el) => (cardOuterRefs.current[idx] = el)}
                className="absolute"
                style={{
                  width: 'clamp(280px, 38vw, 480px)',  // Bigger images like shopify.supply
                  aspectRatio: '3 / 4',
                  top: '50%',
                  left: '50%',
                  zIndex: config.z,
                  willChange: reduceMotion ? undefined : 'transform',
                }}
              >
                <div
                  ref={(el) => (cardInnerRefs.current[idx] = el)}
                  className="w-full h-full"
                  style={{ willChange: reduceMotion ? undefined : 'transform' }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover select-none"
                    style={{
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
                      borderRadius: '3px',
                    }}
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero text */}
        <div ref={heroCopyRef} className="relative w-full h-full">
          <div className="absolute top-[12%] right-[5%] md:right-[8%] uppercase text-xs md:text-sm text-right tracking-wide text-gray-400 font-mono">
            High-Performance Gear<br />
            Built For Athletes
          </div>
          <div className="absolute left-[5%] sm:left-[8%] md:left-[10%] bottom-[10%] w-[26ch] uppercase text-sm md:text-base font-mono tracking-wider">
            Explore the latest drop<br />
            in our YP Academy<br />
            Shop
          </div>
          <div className="hidden md:block absolute bottom-[10%] right-[5%] uppercase text-sm text-right">
            <span className="mr-2">Scroll</span>
            <span className="inline-block">{'>>>'}</span>
          </div>
        </div>

        {/* Title animation */}
        <div
          className="absolute top-1/2 left-1/2 w-full font-display uppercase z-50 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine1Ref}
              className="text-[12vw] md:text-[10vw] xl:text-[140px] text-nowrap text-center leading-[0.9] tracking-wider"
              style={{ color: '#eeece2' }}
            >
              {title1.map(({ ch, key }) => (
                <span key={key} className="relative inline-block">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine2Ref}
              className="text-[10vw] md:text-[8vw] xl:text-[105px] text-nowrap text-center leading-[0.9] tracking-[0.2em]"
              style={{ color: '#eeece2' }}
            >
              {title2.map(({ ch, key }) => (
                <span key={key} className="relative inline-block">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile swipe hint */}
        <div className="md:hidden absolute bottom-[5%] right-4 flex items-center gap-3 opacity-100">
          <div className="uppercase whitespace-nowrap text-sm tracking-widest font-mono">
            Swipe left to explore
          </div>
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3 animate-pulse" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="w-3 h-3 animate-pulse delay-100" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="w-3 h-3 animate-pulse delay-200" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollerRef}
        className="relative w-screen h-full overflow-x-auto overflow-y-hidden z-10 cursor-grab active:cursor-grabbing touch-pan-x"
      >
        {/* Progress bar */}
        <div
          className="fixed top-0 left-0 h-[2px] bg-cyan shadow-[0_3px_5px_rgba(0,235,247,0.5)] z-30"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />

        <div className="flex w-max h-full">
          {/* Section 1: Hero spacer (scroll past cards) */}
          <div className="w-[150vw] sm:w-[120vw] lg:w-[130vw] xl:w-[120vw] h-full" />

          {/* Section 2: Product - NeoBall 3D */}
          <section className="relative h-full w-[100vw] md:w-[90vw] flex items-center justify-center border-l border-white/10">
            {/* Radial gradient background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,235,247,0.08) 0%, transparent 60%)',
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 w-full max-w-6xl">
              {/* 3D Ball */}
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] pointer-events-auto">
                <NeoBall3D
                  progress={progress}
                  impulse={impulse}
                  className="w-full h-full"
                />
              </div>

              {/* Product Info */}
              <div className="text-center md:text-left">
                <div className="uppercase tracking-[0.2em] text-xs md:text-sm text-gray-400 mb-4">
                  YP Academy Gear
                </div>
                <h2 className="font-display text-[12vw] md:text-[8vw] xl:text-[100px] leading-[0.85] uppercase tracking-tight">
                  {featuredProduct?.title || 'NeoBall'}
                </h2>
                <p className="mt-2 text-gray-400 text-sm md:text-base max-w-[36ch]">
                  The world's first regulation-weight silent basketball. Train at midnight.
                </p>
                <p className="mt-4 text-3xl md:text-4xl font-display text-cyan">
                  ${featuredProduct ? parseFloat(featuredProduct.priceRange.minVariantPrice.amount).toFixed(0) : '168'}
                </p>
                <Link
                  to={`/products/${featuredProduct?.handle || 'neoball'}`}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-cyan text-wolf-black font-bold text-lg rounded-lg hover:scale-105 transition-transform"
                >
                  SHOP NOW
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 3: Lookbook Ad */}
          <section className="relative h-full w-[100vw] md:w-[90vw] flex items-center justify-center border-l border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/13.png)' }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center px-6 max-w-2xl">
              <div className="uppercase tracking-[0.3em] text-sm text-gray-300 mb-6">
                The Pack
              </div>
              <h3 className="font-display text-[10vw] md:text-[6vw] xl:text-[80px] leading-[0.9] uppercase mb-6">
                TRAIN LIKE<br />
                <span className="text-cyan">A PRO</span>
              </h3>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of athletes who refuse to settle for average.
              </p>
              <a
                href="https://youthperformance.com"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join YP Academy
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* Section 4: Newsletter Signup */}
          <section className="relative h-full w-[100vw] md:w-[80vw] flex items-center justify-center border-l border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/4.jpg)' }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 text-center px-6 max-w-lg">
              <div className="uppercase tracking-[0.3em] text-sm text-gray-300 mb-4">
                Stay Connected
              </div>
              <h3 className="font-display text-[8vw] md:text-[4vw] xl:text-[56px] leading-[0.95] uppercase mb-6">
                JOIN THE<br />
                <span className="text-cyan">WOLFPACK</span>
              </h3>
              <p className="text-gray-300 mb-8">
                Get early access to drops, exclusive content, and training tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-cyan text-wolf-black font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  SUBSCRIBE
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </section>

          {/* End spacer */}
          <div className="w-[10vw] h-full" />
        </div>
      </div>
    </div>
  );
}
