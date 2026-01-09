/**
 * Adam Harrington v2.0 - THE ARCHITECT PAGE
 * WolfGrow Edition - Content Constants
 *
 * This is the source of truth for all copy on the page.
 * Update this file, not the components, when changing content.
 */

// =============================================================================
// HERO (Section A)
// =============================================================================

export const HERO = {
  headline: "ADAM HARRINGTON",
  subheadline: "THE ARCHITECT BEHIND THE MVPS.",
  tagline:
    "Talent gets you in the room. Systems keep you there. I built the system I wish I had.",
  primaryCTA: {
    label: "TRAIN WITH ADAM",
    href: "/programs/adam-blueprint", // Deep link to funnel
  },
  secondaryCTA: {
    label: "Watch Intro",
    href: "#origin",
  },
  // Video config
  video: {
    src: "/videos/adam/hero-loop.webm",
    poster: "/images/adam/hero-poster.jpg",
    fallback: "/videos/adam/hero-loop.mp4",
  },
};

// =============================================================================
// ORIGIN STORY (Section B) - "The Real World Reset"
// =============================================================================

export const ORIGIN = {
  headline: "THE REAL WORLD RESET",
  video: {
    src: "/videos/adam/origin-confessional.webm",
    poster: "/images/adam/origin-poster.jpg",
    fallback: "/videos/adam/origin-confessional.mp4",
  },
  copy: {
    paragraph1: `In 2010, I wasn't on an NBA sideline. I was in a parking lot, selling medical devices out of my trunk. I had played on 10 teams in 7 countries, but I felt the dream was over.`,
    paragraph2: `That "failure" was my greatest lesson. I realized that while I had talent, I lacked a **scientific system**. I went back to the lab—studying the biomechanics I learned from Dirk Nowitzki's mentor, Holger Geschwindner.`,
    paragraph3: `I returned to the NBA not as a player, but as an architect. I built **The Blueprint** to give your child the certainty I never had.`,
  },
  // Full copy for markdown rendering
  fullCopy: `In 2010, I wasn't on an NBA sideline. I was in a parking lot, selling medical devices out of my trunk. I had played on 10 teams in 7 countries, but I felt the dream was over.

That "failure" was my greatest lesson. I realized that while I had talent, I lacked a **scientific system**. I went back to the lab—studying the biomechanics I learned from Dirk Nowitzki's mentor, Holger Geschwindner.

I returned to the NBA not as a player, but as an architect. I built **The Blueprint** to give your child the certainty I never had.`,
};

// =============================================================================
// DUAL-TRACK VALUE PROPS (Section C)
// =============================================================================

export interface ValueCard {
  id: "parent" | "athlete";
  icon: string; // Lucide icon name
  headline: string;
  copy: string;
}

export const DUAL_TRACK: ValueCard[] = [
  {
    id: "parent",
    icon: "shield-check", // or "heart"
    headline: "MORE THAN A COACH",
    copy: "I am a father of four first. At YP, we don't just build shooters; we build resilient young adults. No burnout. No gimmicks. Just the biomechanics I used to keep NBA All-Stars healthy and mentally tough.",
  },
  {
    id: "athlete",
    icon: "zap", // or "target"
    headline: "THE CHEAT CODE",
    copy: "Stop guessing. I am handing you the exact footwork, balance, and release codes I drilled with KD, Jimmy Butler, and Kyrie. Don't wait until the pros to learn how to train like one.",
  },
];

// =============================================================================
// SOCIAL PROOF - THE RECEIPTS (Section D)
// =============================================================================

export interface Logo {
  name: string;
  src: string;
  alt: string;
}

export const LOGOS: Logo[] = [
  { name: "Brooklyn Nets", src: "/images/logos/nets.svg", alt: "Brooklyn Nets logo" },
  { name: "OKC Thunder", src: "/images/logos/thunder.svg", alt: "Oklahoma City Thunder logo" },
  { name: "NBA", src: "/images/logos/nba.svg", alt: "NBA logo" },
  { name: "Phantom BC", src: "/images/logos/phantom.svg", alt: "Phantom BC Unrivaled logo" },
  { name: "Portland Trail Blazers", src: "/images/logos/blazers.svg", alt: "Portland Trail Blazers logo" },
];

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  image?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "He made me feel like family.",
    author: "Spencer Dinwiddie",
    title: "Brooklyn Nets",
    image: "/images/adam/testimonials/dinwiddie.jpg",
  },
  {
    quote: "One of the best basketball minds in the game.",
    author: "Phil Handy",
    title: "Los Angeles Lakers",
    image: "/images/adam/testimonials/handy.jpg",
  },
  {
    quote:
      "Over the past ten years, Adam Harrington has been the driving force behind my basketball journey. As my skills trainer, coach, and mentor, he's been a constant source of motivation.",
    author: "Kevin Durant",
    title: "Houston Rockets",
    image: "/images/adam/testimonials/kd.jpg",
  },
  {
    quote:
      "Adam is a student of the game who became its professor. His attention to detail and care for his players is unmatched in this industry.",
    author: "Jamal Crawford",
    title: "3x NBA Sixth Man of the Year",
    image: "/images/adam/testimonials/crawford.jpg",
  },
  {
    quote:
      "I have played and coached in the NBA for 30+ years. When I met Adam in 2014, I knew he was my kind of guy. Get to work early with an energy that can fill a gym.",
    author: "Scott Brooks",
    title: "Los Angeles Lakers",
    image: "/images/adam/testimonials/brooks.jpg",
  },
];

export const RECEIPTS = {
  headline: "THE RECEIPTS",
  backgroundVideo: {
    src: "/videos/adam/receipts-montage.webm",
    poster: "/images/adam/receipts-poster.jpg",
    fallback: "/videos/adam/receipts-montage.mp4",
  },
  logos: LOGOS,
  testimonials: TESTIMONIALS,
};

// =============================================================================
// CONVERSION CTA (Section E)
// =============================================================================

export const CONVERSION = {
  headline: "THE BLUEPRINT IS WAITING.",
  subheadline: "Join the Pack. Lock In. Level Up.",
  primaryCTA: {
    label: "START FREE TRIAL",
    href: "/programs/adam-blueprint?trial=true",
  },
  secondaryCTA: {
    label: "WATCH THE MASTERCLASS",
    href: "/masterclass/adam",
  },
};

// =============================================================================
// TIMELINE (Reused from v1, enhanced)
// =============================================================================

export interface TimelineItem {
  year: string;
  event: string;
  detail?: string;
  type: "player" | "coach" | "milestone" | "founder";
  highlight?: boolean;
}

export const TIMELINE: TimelineItem[] = [
  {
    year: "1998",
    event: "USA Junior National Team — Gold Medal",
    detail: "Represented the United States on the international stage.",
    type: "milestone",
    highlight: true,
  },
  {
    year: "2002",
    event: "The NBA Grind",
    detail: "Dallas Mavericks, Denver Nuggets, International tours through 7 countries.",
    type: "player",
  },
  {
    year: "2010",
    event: "The Reset",
    detail: "Retired from playing. Founded JEHH Memorial Fund. Started the lab work.",
    type: "milestone",
  },
  {
    year: "2014",
    event: "The MVP Season",
    detail: "OKC Thunder Shooting Coach. Kevin Durant wins MVP.",
    type: "coach",
    highlight: true,
  },
  {
    year: "2016",
    event: "The Brooklyn Era",
    detail: "Director of Player Development. Durant, Irving, Harden.",
    type: "coach",
  },
  {
    year: "2024",
    event: "The New Era",
    detail: "Head Coach, Phantom BC (Unrivaled League). Sabrina Ionescu.",
    type: "coach",
    highlight: true,
  },
  {
    year: "2025",
    event: "The Architect",
    detail: "Founding Trainer, YouthPerformance. NeoBall. The Blueprint.",
    type: "founder",
    highlight: true,
  },
];

// =============================================================================
// STATS (Hero section)
// =============================================================================

export const STATS = [
  { number: "20+", label: "Years" },
  { number: "50+", label: "Pro Athletes" },
  { number: "6", label: "NBA Orgs" },
  { number: "1", label: "System" },
];

// =============================================================================
// SEO / METADATA
// =============================================================================

export const SEO = {
  title: "Adam Harrington | NBA Skills Coach & Architect of Youth Performance",
  description:
    "The man who trained Kevin Durant to MVP. Former NBA Shooting Coach (OKC, Nets), Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance. Now building the next generation.",
  keywords: [
    "Adam Harrington",
    "NBA skills coach",
    "basketball trainer",
    "Youth Performance",
    "shooting coach",
    "player development",
    "Brooklyn Nets coach",
    "OKC Thunder coach",
    "Kevin Durant trainer",
    "Phantom BC",
    "Unrivaled League",
  ],
  openGraph: {
    type: "profile" as const,
    firstName: "Adam",
    lastName: "Harrington",
    image: "/images/adam/og-image.jpg",
  },
};

// =============================================================================
// SCHEMA (JSON-LD)
// =============================================================================

export const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adam Harrington",
  jobTitle: [
    "Head Coach, Phantom BC",
    "NBA Skills Strategist",
    "Founder, Youth Performance",
  ],
  knowsAbout: [
    "Shooting Mechanics",
    "Player Development",
    "Basketball Biomechanics",
    "Elite Athletic Training",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "NC State University" },
    { "@type": "CollegeOrUniversity", name: "Auburn University" },
  ],
  worksFor: [
    { "@type": "Organization", name: "Youth Performance" },
    { "@type": "Organization", name: "Phantom BC" },
    { "@type": "Organization", name: "Portland Trail Blazers" },
  ],
  award: [
    "USA Junior National Team Gold Medal",
    "NBA Championship Coach (Staff)",
  ],
  sameAs: [
    "https://twitter.com/adampharrington",
    "https://instagram.com/adampharrington",
  ],
};

// =============================================================================
// WOLF MODE THEME CONFIG
// =============================================================================

export const WOLF_MODE = {
  enabled: false, // Feature flag
  themes: {
    light: {
      name: "Parent Safe",
      bgPrimary: "#FFFFFF",
      bgSecondary: "#F5F5F5",
      textPrimary: "#0A0A0A",
      accent: "#00F6E0",
    },
    dark: {
      name: "Wolf Mode",
      bgPrimary: "#0A0A0A",
      bgSecondary: "#0a1628",
      textPrimary: "#FFFFFF",
      accent: "#00F0FF",
    },
  },
};

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAV = {
  logo: "YOUTHPERFORMANCE",
  links: [
    { label: "Origin", href: "#origin" },
    { label: "Credentials", href: "#receipts" },
    { label: "Philosophy", href: "#dual-track" },
  ],
  cta: {
    label: "Start Free Trial",
    href: "/programs/adam-blueprint?trial=true",
  },
};
