// ═══════════════════════════════════════════════════════════
// ADAM HARRINGTON v2.0 - THE ARCHITECT PAGE
// WolfGrow Edition - Content Constants
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// HERO DATA (Section A)
// ─────────────────────────────────────────────────────────────

export const HERO = {
  headline: "ADAM HARRINGTON",
  subheadline: "THE NBA'S SECRET WEAPON FOR SHOOTING MECHANICS.", // SEO optimized
  tagline: "Talent gets you in the room. Systems keep you there. I built the system I wish I had.",
  heroVideo: "/videos/adam/ghost-handle.mp4", // CEO: Must be video-first
  heroImage: "/images/adam/hero.jpg", // Fallback only
  primaryCTA: {
    label: "UNLOCK THE BLUEPRINT", // CEO: Action-oriented CTA
    href: "#conversion",
  },
  secondaryCTA: {
    label: "Watch Story",
    href: "#origin",
  },
  stats: [
    { number: "$200M+", label: "Contracts Signed" }, // CEO: Hard data
    { number: "50+", label: "Pro Athletes" },
    { number: "6", label: "NBA Orgs" },
  ],
};

// ─────────────────────────────────────────────────────────────
// ORIGIN STORY (Section B) - "The Real World Reset"
// ─────────────────────────────────────────────────────────────

export const ORIGIN = {
  headline: "THE REAL WORLD RESET",
  paragraphs: [
    `In 2010, I wasn't on an NBA sideline. I was in a parking lot, selling medical devices out of my trunk. I had played on 10 teams in 7 countries, but I felt the dream was over.`,
    `That "failure" was my greatest lesson. I realized that while I had talent, I lacked a scientific system. I went back to the lab—studying the biomechanics I learned from Dirk Nowitzki's mentor, Holger Geschwindner.`,
    `I returned to the NBA not as a player, but as an architect. I built The Blueprint to give your child the certainty I never had.`,
  ],
};

// ─────────────────────────────────────────────────────────────
// DUAL-TRACK VALUE PROPS (Section C)
// ─────────────────────────────────────────────────────────────

export interface ValueCard {
  id: "parent" | "athlete";
  icon: "shield-check" | "zap";
  headline: string;
  copy: string;
}

export const DUAL_TRACK: ValueCard[] = [
  {
    id: "parent",
    icon: "shield-check",
    headline: "MORE THAN A COACH",
    copy: "I am a father of four first. At YP, we don't just build shooters; we build resilient young adults. No burnout. No gimmicks. Just the biomechanics I used to keep NBA All-Stars healthy and mentally tough.",
  },
  {
    id: "athlete",
    icon: "zap",
    headline: "THE CHEAT CODE",
    copy: "Stop guessing. I am handing you the exact footwork, balance, and release codes I drilled with KD, Jimmy Butler, and Kyrie. Don't wait until the pros to learn how to train like one.",
  },
];

// ─────────────────────────────────────────────────────────────
// CREDENTIALS / LOGOS
// ─────────────────────────────────────────────────────────────

export const CREDENTIALS = [
  { org: "Brooklyn Nets", years: "6 Years" },
  { org: "OKC Thunder", years: "Shooting Coach" },
  { org: "Phantom BC", years: "Head Coach" },
  { org: "Portland", years: "Consultant" },
  { org: "NBA", years: "20+ Years" },
];

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS (Section D - The Receipts)
// ─────────────────────────────────────────────────────────────

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  featured?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "He made me feel like family.",
    author: "Spencer Dinwiddie",
    title: "Brooklyn Nets",
    featured: true,
  },
  {
    quote: "One of the best basketball minds in the game.",
    author: "Phil Handy",
    title: "Los Angeles Lakers",
    featured: true,
  },
  {
    quote:
      "Over the past ten years, Adam Harrington has been the driving force behind my basketball journey. As my skills trainer, coach, and mentor, he's been a constant source of motivation, pushing me to improve every single day.",
    author: "Kevin Durant",
    title: "Houston Rockets",
  },
  {
    quote:
      "Adam is a student of the game who became its professor. His attention to detail and care for his players is unmatched in this industry.",
    author: "Jamal Crawford",
    title: "3x NBA Sixth Man of the Year",
  },
  {
    quote:
      "I have played and coached in the NBA for 30+ years. When I met Adam in 2014, I knew he was my kind of guy. Get to work early with an energy that can fill a gym. Be the last to leave when everyone's needs were met.",
    author: "Scott Brooks",
    title: "Los Angeles Lakers",
  },
  {
    quote:
      "Adam has always been a great person and incredibly skilled coach. He's very detail oriented and has helped support our players both on court and as people. He's as good a player development coach as I've seen.",
    author: "Sam Permut",
    title: "Roc Nation Sports",
  },
];

export const RECEIPTS = {
  headline: "THE RECEIPTS",
  subheadline: "Don't take my word for it.",
};

// ─────────────────────────────────────────────────────────────
// CONVERSION CTA (Section E)
// ─────────────────────────────────────────────────────────────

export const CONVERSION = {
  headline: "THE BLUEPRINT IS WAITING.",
  subheadline: "Join the Pack. Lock In. Level Up.",
  primaryCTA: {
    label: "UNLOCK THE BLUEPRINT", // CEO: Action-oriented
    href: "/",
  },
  secondaryCTA: {
    label: "SHOP NEOBALL — $168",
    href: "https://shop.youthperformance.com/products/neoball",
  },
};

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

export const NAV = {
  logo: "YOUTHPERFORMANCE",
  links: [
    { label: "Story", href: "#origin" },
    { label: "Credentials", href: "#receipts" },
    { label: "Train", href: "#conversion" },
  ],
  cta: {
    label: "Start Free Trial",
    href: "/",
  },
};

// ─────────────────────────────────────────────────────────────
// SEO / METADATA
// ─────────────────────────────────────────────────────────────

export const SEO = {
  title: "Adam Harrington | NBA Skills Coach & Architect of Youth Performance",
  description:
    "The man who trained Kevin Durant to MVP. Former NBA Shooting Coach (OKC, Nets), Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance.",
};

// ─────────────────────────────────────────────────────────────
// LEGACY EXPORTS (for backwards compatibility)
// ─────────────────────────────────────────────────────────────

export const JOURNEY = {
  label: "The Journey",
  title: "From Player",
  titleAccent: "to Architect",
  description:
    "My path through basketball — from small-town Massachusetts to NBA courts around the world — shaped my understanding of what it takes to develop elite athletes.",
  timeline: [
    {
      year: "1998",
      event: "USA Junior National Team — Olympic Gold Medal",
      type: "milestone" as const,
    },
    {
      year: "2002",
      event: "NBA — Dallas Mavericks (Undrafted Free Agent)",
      type: "playing" as const,
    },
    { year: "2003-10", event: "International Career: 7 Countries", type: "playing" as const },
    { year: "2010", event: "The Reset — Founded JEHH Memorial Fund", type: "milestone" as const },
    { year: "2014", event: "OKC Thunder — Durant wins MVP", type: "coaching" as const },
    {
      year: "2016",
      event: "Brooklyn Nets — Director of Player Development",
      type: "coaching" as const,
    },
    { year: "2024", event: "Phantom BC — Head Coach (Unrivaled)", type: "coaching" as const },
    { year: "2025", event: "YouthPerformance — Founding Trainer", type: "venture" as const },
  ],
};

export interface TimelineItem {
  year: string;
  event: string;
  type: "playing" | "coaching" | "milestone" | "venture";
}

export const ATHLETES = {
  label: "Athletes Developed",
  title: "Trained by Adam",
  groups: [
    {
      level: "NBA",
      athletes:
        "Jimmy Butler, Kevin Durant, Chet Holmgren, Paolo Banchero, Jalen Green, Spencer Dinwiddie, Blake Griffin, OG Anunoby, Fred VanVleet",
    },
    {
      level: "WNBA",
      athletes:
        "Brittney Griner, Sabrina Ionescu, Satou Sabally, Elena Delle Donne, Marina Mabrey, Natasha Cloud",
    },
  ],
};

export const PHILOSOPHY = {
  label: "The Philosophy",
  title: "Consistency Happens",
  titleAccent: "in the Dark",
  quote:
    "Excellence isn't an accident. It's the accumulation of thousands of intentional repetitions, in the right system, with the right feel.",
  body: "The NeoBall lets you get 500 reps in your bedroom at midnight without waking the house. It's about stealing reps.",
  cta: {
    label: "SHOP NEOBALL — $168",
    href: "https://shop.youthperformance.com/products/neoball",
  },
};

export const FAMILY = {
  label: "Beyond the Court",
  text: "Adam lives in Glen Ridge, New Jersey with his wife Kearstin and their four children — Jayden (18), Jaxon (13), Jonah (11), and Jill (8).",
};

export interface Venture {
  title: string;
  subtitle: string;
  description: string;
}

export const VENTURES: Venture[] = [
  {
    title: "Phantom BC",
    subtitle: "Head Coach",
    description: "Leading an Unrivaled roster including Sabrina Ionescu and Satou Sabally.",
  },
  {
    title: "Portland Trail Blazers",
    subtitle: "Basketball Consultant",
    description: "Supporting player development, evaluation, and team strategy.",
  },
  {
    title: "The Clubhouse",
    subtitle: "Founder — Orange, NJ",
    description: "Premier basketball training facility for all levels.",
  },
  {
    title: "YouthPerformance",
    subtitle: "Founding Trainer",
    description: "Democratizing elite training through NeoBall and the YP Academy.",
  },
  {
    title: "JEHH Memorial Fund",
    subtitle: "Founder",
    description: "Honoring my late sister Jill through charitable giving and community impact.",
  },
];

export const FINAL_CTA = {
  label: "Train with Adam",
  title: "Ready to Elevate?",
  body: "The NeoBall Founders Edition includes exclusive access to Adam's Foundation training modules.",
  primaryCTA: {
    label: "SHOP NEOBALL — $168",
    href: "https://shop.youthperformance.com/products/neoball",
  },
  secondaryCTA: {
    label: "JOIN ACADEMY WAITLIST",
    href: "/",
  },
  social: {
    instagram: "https://instagram.com/adampharrington",
    twitter: "https://twitter.com/adampharrington",
  },
};
