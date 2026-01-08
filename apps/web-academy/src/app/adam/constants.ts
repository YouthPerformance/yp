// ═══════════════════════════════════════════════════════════
// ADAM HARRINGTON PROFILE - COMPLETE DATA
// Coach's Study Design System v2
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// HERO DATA
// ─────────────────────────────────────────────────────────────

export const HERO = {
  label: "Global Head of Basketball",
  firstName: "Adam",
  lastName: "Harrington",
  description:
    "Over the past decade, I've trained NBA MVPs, Olympic athletes, and hundreds of young players. Now I'm making that knowledge accessible to every family.",
  primaryCTA: {
    label: "EXPLORE MY JOURNEY",
    href: "#journey",
  },
  secondaryCTA: {
    label: "Watch Intro",
    href: "#video",
  },
  stats: [
    { number: "20+", label: "Years" },
    { number: "50+", label: "Pro Athletes" },
    { number: "6", label: "NBA Orgs" },
  ],
};

// ─────────────────────────────────────────────────────────────
// CREDENTIALS BAR
// ─────────────────────────────────────────────────────────────

export const CREDENTIALS = [
  { org: "Brooklyn Nets", role: "6 Years" },
  { org: "Oklahoma City Thunder", role: "Shooting Coach" },
  { org: "Unrivaled League", role: "Head Coach" },
  { org: "Portland Trail Blazers", role: "Consultant" },
];

// ─────────────────────────────────────────────────────────────
// JOURNEY TIMELINE
// ─────────────────────────────────────────────────────────────

export interface TimelineItem {
  year: string;
  event: string;
  type: "playing" | "coaching" | "milestone" | "venture";
}

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
      type: "milestone",
    },
    {
      year: "1998",
      event: "High School All-American, Gatorade Player of the Year (MA)",
      type: "playing",
    },
    {
      year: "2002",
      event: "NC State → Auburn University (All-SEC Honors)",
      type: "playing",
    },
    {
      year: "2002",
      event: "NBA — Dallas Mavericks (Undrafted Free Agent)",
      type: "playing",
    },
    {
      year: "2003-10",
      event:
        "International Career: Spain, Germany, Israel, Croatia, France, Poland, China",
      type: "playing",
    },
    {
      year: "2010",
      event: "Retired from playing; Founded JEHH Memorial Fund",
      type: "milestone",
    },
    {
      year: "2013",
      event: "Personal Skills Coach for Kevin Durant — Durant wins MVP (2014)",
      type: "coaching",
    },
    {
      year: "2014",
      event: "Shooting Coach, Oklahoma City Thunder",
      type: "coaching",
    },
    {
      year: "2016",
      event: "Assistant Coach & Director of Player Development, Brooklyn Nets",
      type: "coaching",
    },
    {
      year: "2024",
      event: "Head Coach, Phantom BC (Unrivaled League)",
      type: "coaching",
    },
    {
      year: "2025",
      event: "Founding Trainer, YouthPerformance — NeoBall",
      type: "venture",
    },
  ] as TimelineItem[],
};

// ─────────────────────────────────────────────────────────────
// ATHLETES DEVELOPED
// ─────────────────────────────────────────────────────────────

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
        "Brittney Griner, Sabrina Ionescu, Satou Sabally, Elena Delle Donne, Marina Mabrey, Natasha Cloud, Katie Lou Samuelson",
    },
    {
      level: "International",
      athletes:
        "Mike James, Axel Toupane, Pacome Dadiet, Noa Essengue, and professionals in 7+ countries",
    },
    {
      level: "Collegiate & Youth",
      athletes:
        "Neil Quinn, Dylan Cardwell, elite high school players, and hundreds of youth athletes",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Over the past ten years, Adam Harrington has been the driving force behind my basketball journey. As my skills trainer, coach, and mentor, he's been a constant source of motivation, pushing me to improve every single day.",
    author: "Kevin Durant",
    title: "Houston Rockets",
  },
  {
    quote:
      "Adam is one of the best basketball minds in the game. For years I've watched from afar and love his attention to detail and ability to connect with players at all levels. True teacher and student of the game.",
    author: "Phil Handy",
    title: "Los Angeles Lakers",
  },
  {
    quote:
      "He took an interest in me even though I was in the G-League, a non-guaranteed guy, and showed me as much energy and enthusiasm as any coach I have been with. He's been a crucial piece in my career.",
    author: "Spencer Dinwiddie",
    title: "Brooklyn Nets",
  },
  {
    quote:
      "Adam has always been a great person and incredibly skilled coach. He's very detail oriented and has helped support our players both on court and as people. He's as good a player development coach as I've seen.",
    author: "Sam Permut",
    title: "Roc Nation Sports",
  },
  {
    quote:
      "I have played and coached in the NBA for 30+ years. When I met Adam in 2014, I knew he was my kind of guy. Get to work early with an energy that can fill a gym. Be the last to leave when everyone's needs were met.",
    author: "Scott Brooks",
    title: "Los Angeles Lakers",
  },
];

// ─────────────────────────────────────────────────────────────
// PHILOSOPHY
// ─────────────────────────────────────────────────────────────

export const PHILOSOPHY = {
  label: "The Philosophy",
  title: "Consistency Happens",
  titleAccent: "in the Dark",
  quote:
    "Excellence isn't an accident. It's the accumulation of thousands of intentional repetitions, in the right system, with the right feel.",
  body: "The NeoBall lets you get 500 reps in your bedroom at midnight without waking the house. It's about stealing reps — the same way every elite player I've worked with has done it.",
  cta: {
    label: "SHOP NEOBALL — $168",
    href: "https://shop.youthperformance.com/products/neoball",
  },
};

// ─────────────────────────────────────────────────────────────
// VENTURES
// ─────────────────────────────────────────────────────────────

export interface Venture {
  title: string;
  subtitle: string;
  description: string;
}

export const VENTURES: Venture[] = [
  {
    title: "Phantom BC",
    subtitle: "Head Coach",
    description:
      "Leading an Unrivaled roster including Sabrina Ionescu and Satou Sabally.",
  },
  {
    title: "Portland Trail Blazers",
    subtitle: "Basketball Consultant",
    description:
      "Supporting player development, evaluation, and team strategy.",
  },
  {
    title: "The Clubhouse",
    subtitle: "Founder — Orange, NJ",
    description: "Premier basketball training facility for all levels.",
  },
  {
    title: "YouthPerformance",
    subtitle: "Founding Trainer",
    description:
      "Democratizing elite training through NeoBall and the YP Academy.",
  },
  {
    title: "Li-Ning",
    subtitle: "Development Partner",
    description:
      "Jimmy Butler Brand expansion through camps and clinics in Asia.",
  },
  {
    title: "JEHH Memorial Fund",
    subtitle: "Founder",
    description:
      "Honoring my late sister Jill through charitable giving and community impact.",
  },
];

// ─────────────────────────────────────────────────────────────
// FAMILY
// ─────────────────────────────────────────────────────────────

export const FAMILY = {
  label: "Beyond the Court",
  text: "Adam lives in Glen Ridge, New Jersey with his wife Kearstin and their four children — Jayden (18), Jaxon (13), Jonah (11), and Jill (8). His commitment to family guides everything he does and shapes his work as a leader, coach, and mentor.",
};

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────

export const FINAL_CTA = {
  label: "Train with Adam",
  title: "Ready to Elevate?",
  body: "The NeoBall Founders Edition includes exclusive access to Adam's Foundation training modules — the same system he uses with NBA athletes.",
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

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────

export const NAV = {
  logo: "YOUTHPERFORMANCE",
  links: [
    { label: "Journey", href: "#journey" },
    { label: "Athletes", href: "#athletes" },
    { label: "Philosophy", href: "#philosophy" },
  ],
  cta: {
    label: "Shop NeoBall",
    href: "https://shop.youthperformance.com/products/neoball",
  },
};
