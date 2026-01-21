import { Link } from "@remix-run/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { GlassMorphicHeader } from "../GlassMorphicHeader";
import { NeoBall3D } from "./NeoBall3D";
import { WebGLNoise } from "./WebGLNoise";

// SSR-safe useLayoutEffect - falls back to useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ===========================================================================
// SHOPIFY SUPPLY EXACT CONFIGURATION
// ===========================================================================

// Noise texture
const NOISE_PNG =
  "https://cdn.shopify.com/oxygen-v2/25850/10228/21102/2758078/assets/noise-Q6CzNatq.png";

// Hero images - stacked cards (top to bottom layering)
// Order: 14.png (top/front) → 17.png (bottom/back) - 4.jpg moved to wolfpack section
const HERO_IMAGES = [
  "/images/14.png", // 1. Top (front) - highest z-index
  "/images/9.jpg", // 2.
  "/images/11.png", // 3.
  "/images/12.png", // 4.
  "/images/13.png", // 5.
  "/images/18.png", // 6.
  "/images/17.png", // 7. Bottom (back) - lowest z-index
];

// Scroll physics - EXACT Supply settings
const SCATTER_EASE = "power3.out";
const PIN_DISTANCE_MULTIPLIER = 1.5; // Desktop: 1.5x viewport
const MOBILE_PIN_MULTIPLIER = 1.0; // Mobile: 1x viewport

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
  { x: -220, y: -70, r: -25, scale: 0.75, z: 7 }, // Image 1 - TOP (front)
  { x: -200, y: 90, r: 35, scale: 0.82, z: 6 }, // Image 2
  { x: -180, y: -110, r: -45, scale: 0.65, z: 5 }, // Image 3
  { x: -160, y: 50, r: 15, scale: 0.78, z: 4 }, // Image 4
  { x: -140, y: -40, r: -10, scale: 0.72, z: 3 }, // Image 5
  { x: -125, y: 70, r: 40, scale: 0.65, z: 2 }, // Image 6
  { x: -110, y: -30, r: -20, scale: 0.58, z: 1 }, // Image 7 - BOTTOM (back)
];

// Wheel config - Lenis-like smooth scroll
const WHEEL_CONFIG = {
  maxDelta: 200,
  multiplier: 1.35,
  duration: 0.35,
  ease: "power3.out",
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
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

  const title1 = useMemo(() => splitLetters("YOUTH"), []);
  const title2 = useMemo(() => splitLetters("PERFORMANCE"), []);

  // Reduced motion listener
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      const onChange = () => setReduceMotion(mq.matches);
      onChange();
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
    return undefined;
  }, []);

  // Lock body scroll for horizontal experience
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      .to(
        beam,
        {
          xPercent: 200,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "<",
      )
      .to(
        beam,
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.3",
      );

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

    const scrollToX = gsap.quickTo(el, "scrollLeft", {
      duration: WHEEL_CONFIG.duration,
      ease: WHEEL_CONFIG.ease,
      overwrite: true,
      onUpdate: () => ScrollTrigger.update(),
    });

    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      e.preventDefault();

      const delta = gsap.utils.clamp(-WHEEL_CONFIG.maxDelta, WHEEL_CONFIG.maxDelta, e.deltaY);
      wheelTargetRef.current = gsap.utils.clamp(
        0,
        maxScroll(),
        wheelTargetRef.current + delta * WHEEL_CONFIG.multiplier,
      );
      scrollToX(wheelTargetRef.current);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer drag handler (mobile swipe)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onDown = (e: PointerEvent) => {
      // Don't capture pointer events when clicking on links or buttons
      // This allows the Link component to handle clicks properly
      const target = e.target as HTMLElement;
      if (target.closest("a") || target.closest("button") || target.closest("input")) {
        return;
      }

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

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
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
        heroContainer.style.visibility = el.scrollLeft > hideThreshold ? "hidden" : "visible";
      }
    };

    // Decay impulse when not scrolling
    const decayInterval = setInterval(() => {
      setImpulse((prev) => prev * 0.9);
    }, 50);

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearInterval(decayInterval);
    };
  }, []);

  // GSAP scroll-scrubbed hero animation
  useIsomorphicLayoutEffect(() => {
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
      mm.add("(min-width: 769px)", () => {
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
          gsap.set(el, { rotation: 0, scale: 1, transformOrigin: "50% 50%" });
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
        const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        entranceTl.to(line1, { yPercent: 0, skewY: 0, duration: 0.5 }, 0);
        entranceTl.to(line2, { yPercent: 0, skewY: 0, duration: 0.5 }, LETTER_STAGGER);
        entranceTl.to(heroCopy, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1);

        // Exit timeline (scroll-scrubbed) - TWO PHASES for clean transition
        const tl = gsap.timeline({ defaults: { ease: SCATTER_EASE } });

        // PHASE 1 (0-60%): Cards scatter to positions
        cards.forEach((el, i) => {
          const cfg = CARD_CONFIG[i] || CARD_CONFIG[0];
          tl.to(
            el,
            {
              xPercent: cfg.x,
              yPercent: cfg.y,
              rotation: cfg.r,
              scale: cfg.scale,
              duration: DURATIONS.rotation,
            },
            i * IMAGE_STAGGER,
          );
        });

        // Title exit during Phase 1
        tl.to(line1, { yPercent: -100, duration: DURATIONS.titleLetters }, 0);
        tl.to(line2, { yPercent: -100, duration: DURATIONS.titleLetters }, LETTER_STAGGER);
        tl.to(heroCopy, { autoAlpha: 0, duration: DURATIONS.text }, "<");

        // PHASE 2 (60-100%): Cards fly out LEFT and fade - clean exit
        // This happens AFTER scatter, so next section slides in clean
        tl.to(
          cards,
          {
            xPercent: -250, // Fly far left off-screen
            rotation: "-=18", // Additional rotation as they exit
            opacity: 0, // Fade out completely
            stagger: IMAGE_STAGGER,
            duration: 0.4,
            ease: "power2.in",
          },
          "+=0.1",
        ); // Small gap after scatter phase

        // Velocity impulse
        const rotTo = cardsInner.map((el) =>
          gsap.quickTo(el, "rotation", { duration: 0.18, ease: "power3.out" }),
        );
        const scaleTo = cardsInner.map((el) =>
          gsap.quickTo(el, "scale", { duration: 0.18, ease: "power3.out" }),
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
      mm.add("(max-width: 768px)", () => {
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

        const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        entranceTl.to(line1, { yPercent: 0, skewY: 0, duration: 0.5 }, 0);
        entranceTl.to(line2, { yPercent: 0, skewY: 0, duration: 0.5 }, 0.05);
        entranceTl.to(heroCopy, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1);

        const tl = gsap.timeline({ defaults: { ease: SCATTER_EASE } });
        tl.to(
          cards,
          {
            xPercent: -200,
            rotation: -12,
            stagger: IMAGE_STAGGER,
            duration: DURATIONS.rotation,
          },
          0,
        );
        tl.to(line1, { yPercent: -100, duration: DURATIONS.titleLetters }, 0);
        tl.to(line2, { yPercent: -100, duration: DURATIONS.titleLetters }, LETTER_STAGGER);
        tl.to(heroCopy, { autoAlpha: 0, duration: DURATIONS.text }, "<");

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
        backgroundImage: "url(/images/shopbg6.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
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
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,246,224,0) 35%, rgba(0,246,224,0.2) 45%, rgba(0,246,224,0.5) 50%, rgba(0,246,224,0.2) 55%, rgba(0,246,224,0) 65%, transparent 100%)",
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
                  width: "clamp(280px, 38vw, 480px)", // Bigger images like shopify.supply
                  aspectRatio: "3 / 4",
                  top: "50%",
                  left: "50%",
                  zIndex: config.z,
                  willChange: reduceMotion ? undefined : "transform",
                }}
              >
                <div
                  ref={(el) => (cardInnerRefs.current[idx] = el)}
                  className="w-full h-full"
                  style={{ willChange: reduceMotion ? undefined : "transform" }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover select-none"
                    style={{
                      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
                      borderRadius: "3px",
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
            High-Performance Gear
            <br />
            Built For Athletes
          </div>
          <div className="absolute left-[5%] sm:left-[8%] md:left-[10%] bottom-[10%] w-[26ch] uppercase text-sm md:text-base font-mono tracking-wider">
            Explore the latest drop
            <br />
            in our YP Academy
            <br />
            Shop
          </div>
          <div className="hidden md:block absolute bottom-[10%] right-[5%] uppercase text-sm text-right">
            <span className="mr-2">Scroll</span>
            <span className="inline-block">{">>>"}</span>
          </div>
        </div>

        {/* Title animation */}
        <div
          className="absolute top-1/2 left-1/2 w-full font-display uppercase z-50 pointer-events-none"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine1Ref}
              className="text-[12vw] md:text-[10vw] xl:text-[140px] text-nowrap text-center leading-[0.9] tracking-wider"
              style={{ color: "#eeece2" }}
            >
              {title1.map(({ ch, key }) => (
                <span key={key} className="relative inline-block">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden" style={{ lineHeight: 1.0 }}>
            <div
              ref={titleLine2Ref}
              className="text-[10vw] md:text-[8vw] xl:text-[105px] text-nowrap text-center leading-[0.9] tracking-[0.2em]"
              style={{ color: "#eeece2" }}
            >
              {title2.map(({ ch, key }) => (
                <span key={key} className="relative inline-block">
                  {ch === " " ? "\u00A0" : ch}
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
              <path
                d="M4.5 2L8.5 6L4.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="w-3 h-3 animate-pulse delay-100" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 2L8.5 6L4.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="w-3 h-3 animate-pulse delay-200" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 2L8.5 6L4.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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

          {/* Section 2: Product - NeoBall 3D (Shopify Supply Style) */}
          <section className="relative h-full w-[100vw] flex border-l border-white/10">
            {/* Left Half - Product Display */}
            <div className="relative w-1/2 h-full flex flex-col items-center justify-center">
              {/* Diagonal gradient background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
                }}
              />
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />

              {/* 3D Ball */}
              <div className="relative z-10 w-[min(60vw,350px)] h-[min(60vw,350px)] lg:w-[min(35vw,400px)] lg:h-[min(35vw,400px)] pointer-events-auto">
                <NeoBall3D
                  progress={progress}
                  impulse={impulse}
                  sectionStart={0.32}
                  sectionEnd={0.58}
                  className="w-full h-full"
                />
              </div>

              {/* Product Info - Below Ball */}
              <div className="relative z-10 text-center mt-6 pointer-events-auto">
                <h2 className="font-body text-xl md:text-2xl tracking-wide">
                  {featuredProduct?.title || "NeoBall"}
                </h2>
                <p className="mt-2 text-lg md:text-xl text-white/80">
                  $68.00
                </p>
                <Link
                  to={`/products/${featuredProduct?.handle || "neoball"}`}
                  className="mt-4 inline-block px-8 py-3 bg-[#eeece2] text-wolf-black font-mono text-sm uppercase tracking-[0.15em] hover:bg-white transition-colors"
                >
                  Quick View
                </Link>
              </div>
            </div>

            {/* Right Half - Lookbook Image with Floating Card */}
            <div className="relative w-1/2 h-full">
              {/* Lookbook Image - You'll need to provide this */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/images/neoball-lookbook.jpg)" }}
              />
              {/* Fallback gradient if no image */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-transparent to-black/50"
                style={{ mixBlendMode: "overlay" }}
              />

              {/* Floating Glass Card */}
              <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 z-20">
                <Link
                  to={`/products/${featuredProduct?.handle || "neoball"}`}
                  className="group flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <div className="text-left">
                    <p className="text-xs font-mono text-white/70">NeoBall</p>
                    <p className="text-xs font-mono text-white/50">USD $68.00</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Vertical Scrolling Text Banner - YOUTH PERFORMANCE */}
          <div className="relative h-full w-[80px] md:w-[100px] flex-shrink-0 overflow-hidden bg-cyan">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="whitespace-nowrap font-display text-wolf-black text-xl md:text-2xl tracking-[0.3em] uppercase"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                <span className="inline-flex items-center gap-4">
                  <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  YOUTH PERFORMANCE
                  <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  YOUTH PERFORMANCE
                  <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Footbag Product (Shopify Supply Style) */}
          <section className="relative h-full w-[100vw] flex border-l border-white/10">
            {/* Left Half - Lookbook Image */}
            <div className="relative w-1/2 h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/images/footbag-lookbook.jpg)" }}
              />
              {/* Fallback gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-black/60" />

              {/* Floating Glass Card */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20">
                <Link
                  to="/products/footbag"
                  className="group flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <div className="text-left">
                    <p className="text-xs font-mono text-white/70">Footbag</p>
                    <p className="text-xs font-mono text-white/50">USD $24.00</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Half - Product Display */}
            <div className="relative w-1/2 h-full flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
                }}
              />
              {/* Subtle grid */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />

              {/* 3D Footbag Visualization */}
              <div className="relative z-10 w-[min(50vw,300px)] h-[min(50vw,300px)] flex items-center justify-center pointer-events-none">
                {/* Center footbag */}
                <div
                  className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full animate-spin-slow"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #8b5cf6 0%, #6d28d9 50%, #4c1d95 100%)",
                    boxShadow: "0 10px 40px rgba(139,92,246,0.4), inset 0 -5px 20px rgba(0,0,0,0.3)",
                    animationDuration: "8s",
                  }}
                >
                  <div className="absolute inset-0 rounded-full" style={{
                    background: "repeating-conic-gradient(from 0deg, transparent 0deg 10deg, rgba(255,255,255,0.1) 10deg 12deg)"
                  }} />
                </div>

                {/* Left footbag */}
                <div
                  className="absolute -left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-spin-slow opacity-70"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #f97316 0%, #ea580c 50%, #9a3412 100%)",
                    boxShadow: "0 8px 30px rgba(249,115,22,0.3), inset 0 -4px 15px rgba(0,0,0,0.3)",
                    animationDuration: "10s",
                    animationDirection: "reverse",
                  }}
                />

                {/* Right footbag */}
                <div
                  className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-spin-slow opacity-70"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #22d3ee 0%, #0891b2 50%, #164e63 100%)",
                    boxShadow: "0 8px 30px rgba(34,211,238,0.3), inset 0 -4px 15px rgba(0,0,0,0.3)",
                    animationDuration: "12s",
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="relative z-10 text-center mt-6 pointer-events-auto">
                <h2 className="font-body text-xl md:text-2xl tracking-wide">Footbag</h2>
                <p className="mt-2 text-lg md:text-xl text-white/80">$24.00</p>
                <Link
                  to="/products/footbag"
                  className="mt-4 inline-block px-8 py-3 bg-[#eeece2] text-wolf-black font-mono text-sm uppercase tracking-[0.15em] hover:bg-white transition-colors"
                >
                  Quick View
                </Link>
              </div>
            </div>
          </section>

          {/* Section 4: Neo Mask Product (Shopify Supply Style) */}
          <section className="relative h-full w-[100vw] flex border-l border-white/10">
            {/* Left Half - Lookbook Image with Floating Card */}
            <div className="relative w-1/2 h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/images/neomask-lookbook.jpg)" }}
              />
              {/* Fallback gradient - teal themed */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-black/60" />

              {/* Floating Glass Card */}
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 z-20">
                <Link
                  to="/products/neo-mask"
                  className="group flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <div className="text-left">
                    <p className="text-xs font-mono text-white/70">Neo Mask</p>
                    <p className="text-xs font-mono text-white/50">USD $32.00</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Half - Product Display */}
            <div className="relative w-1/2 h-full flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
                }}
              />
              {/* Subtle grid */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              />

              {/* Eye Mask Visualization */}
              <div className="relative z-10 w-[min(80vw,400px)] h-[min(40vw,220px)] flex items-center justify-center pointer-events-none">
                {/* Main mask shape */}
                <div
                  className="relative w-full max-w-[320px] h-20 sm:h-24 rounded-[100px] flex items-center justify-center animate-float"
                  style={{
                    background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.05), 0 0 80px rgba(20,184,166,0.2)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Eye cutouts */}
                  <div className="flex gap-12 sm:gap-16">
                    <div className="w-10 h-6 sm:w-14 sm:h-8 bg-black/80 rounded-full" style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)" }} />
                    <div className="w-10 h-6 sm:w-14 sm:h-8 bg-black/80 rounded-full" style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)" }} />
                  </div>

                  {/* Subtle glow effect */}
                  <div className="absolute -inset-4 rounded-[120px] opacity-30" style={{
                    background: "radial-gradient(ellipse at center, rgba(20,184,166,0.3) 0%, transparent 70%)",
                  }} />
                </div>

                {/* Floating particles */}
                <div className="absolute top-4 left-1/4 w-1 h-1 bg-teal-400 rounded-full animate-pulse opacity-50" />
                <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-teal-500 rounded-full animate-pulse opacity-60" style={{ animationDelay: "1s" }} />
              </div>

              {/* Product Info */}
              <div className="relative z-10 text-center mt-6 pointer-events-auto">
                <h2 className="font-body text-xl md:text-2xl tracking-wide">Neo Mask</h2>
                <p className="mt-2 text-lg md:text-xl text-white/80">$32.00</p>
                <Link
                  to="/products/neo-mask"
                  className="mt-4 inline-block px-8 py-3 bg-[#eeece2] text-wolf-black font-mono text-sm uppercase tracking-[0.15em] hover:bg-white transition-colors"
                >
                  Quick View
                </Link>
              </div>
            </div>
          </section>

          {/* Vertical Scrolling Text Banner - LOCK IN LEVEL UP */}
          <div className="relative h-full w-[80px] md:w-[100px] flex-shrink-0 overflow-hidden bg-cyan">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="whitespace-nowrap font-display text-wolf-black text-xl md:text-2xl tracking-[0.3em] uppercase"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                <span className="inline-flex items-center gap-4">
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  LOCK IN
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  LEVEL UP
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  LOCK IN
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  LEVEL UP
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Join The Pack + Footer */}
          <section className="relative h-full w-[100vw] md:w-[90vw] flex flex-col items-center justify-center border-l border-white/10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/images/4.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-lg flex-1 flex flex-col justify-center">
              <div className="uppercase tracking-[0.3em] text-sm text-gray-300 mb-4">
                Stay Connected
              </div>
              <h3 className="font-display text-[8vw] md:text-[4vw] xl:text-[56px] leading-[0.95] uppercase mb-6">
                JOIN THE
                <br />
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
                  className="group relative px-8 py-3.5 bg-cyan text-wolf-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,235,247,0.5)] hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    SUBSCRIBE
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan via-white to-cyan opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-500">No spam. Unsubscribe anytime.</p>

              {/* Social Icons */}
              <div className="flex justify-center gap-6 mt-10">
                <a
                  href="https://x.com/youthperformance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-cyan transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/youthperformance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-cyan transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@youthperformance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-cyan transition-colors"
                  aria-label="TikTok"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="relative z-10 w-full border-t border-white/10 py-6 px-6">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Trust Links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/40">
                  <Link to="/products" className="hover:text-white transition-colors">
                    Shop
                  </Link>
                  <a
                    href="https://neoball.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    NeoBall
                  </a>
                  <Link to="/legal/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                  <Link to="/legal/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </div>

                {/* Powered by Shopify */}
                <div className="flex items-center gap-2 text-white/25 text-xs">
                  <span>powered by</span>
                  <svg width="16" height="18" viewBox="0 0 109 124" fill="currentColor">
                    <path d="M95.5 25.5c-.1-.7-.7-1.1-1.2-1.1-.5 0-10.9-.2-10.9-.2s-7.2-7.1-8-7.9c-.8-.8-2.4-.6-3-.4-.1 0-1.6.5-4.3 1.3-2.6-7.4-7.1-14.2-15.1-14.2h-.7c-2.3-3-5.1-4.3-7.4-4.3-18.3 0-27 22.9-29.7 34.5-7 2.2-12 3.7-12.5 3.9-3.9 1.2-4 1.3-4.5 5-.4 2.8-10.7 82.5-10.7 82.5l85.3 14.7 36.5-9.1s-13.5-78.1-13.8-79.2zM67.3 18.7l-6.6 2c0-.7 0-1.4 0-2.1 0-6.4-1-11.6-2.6-15.3 6.4 1 9.4 8.5 9.2 15.4zm-13.3-13.1c1.7 3.5 2.9 8.5 2.9 15.4 0 .5 0 1 0 1.5l-13.6 4.2c2.6-10 7.5-16.8 10.7-21.1zm-6.1-4c.7 0 1.4.2 2.1.7-5.1 6-10.5 15.4-13 23.7l-10.8 3.3c3-10.2 10.1-27.7 21.7-27.7z" />
                  </svg>
                </div>

                {/* Copyright */}
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/20">
                  © {new Date().getFullYear()} YOUTHPERFORMANCE | YP ALL RIGHTS RESERVED.
                </p>
              </div>
            </div>
          </section>

          {/* End spacer */}
          <div className="w-[10vw] h-full" />
        </div>
      </div>
    </div>
  );
}
