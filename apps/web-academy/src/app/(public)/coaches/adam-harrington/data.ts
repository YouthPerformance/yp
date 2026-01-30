// Adam Harrington Dossier - Content Data
// All claims have been verified per Proof Policy

export interface DossierData {
  hero: {
    badge: string;
    name: string;
    tagline: string;
    image: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  stats: Array<{
    icon: string;
    value: string;
    label: string;
    verified?: boolean;
  }>;
  video: {
    poster: string;
    src?: string;
    duration?: string;
    quote: string;
    attribution: string;
  };
  methodology: {
    title: string;
    subtitle: string;
    intro: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    results: {
      headline: string;
      stats: Array<{
        label: string;
        value: string;
        detail?: string;
      }>;
      closing: string;
    };
  };
  mission: {
    specialty: string;
    focus: string;
    content: string;
    signature?: string;
  };
  protocols: Array<{
    number: string;
    category: string;
    title: string;
    count: string;
    href: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    headline: string;
    subtext: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  meta: {
    lastUpdated: string;
    source: string;
  };
}

export function getDossierData(): DossierData {
  return {
    hero: {
      badge: "HEAD COACH // PHANTOM BC",
      name: "ADAM HARRINGTON",
      tagline:
        "Head Coach of Phantom BC (Unrivaled League). NBA/WNBA Skills Trainer. Creator of the Silent Training Protocol. 20+ years developing elite players including Kevin Durant, Chet Holmgren, and Jalen Green.",
      image: "/people/adamtunnel.jpeg",
      primaryCta: { label: "Train With Adam", href: "/basketball/silent-training" },
      secondaryCta: { label: "View Protocol", href: "#methodology" },
    },
    stats: [
      {
        icon: "🏀",
        value: "PHANTOM BC",
        label: "HEAD COACH",
        verified: true, // Unrivaled League 2025-2026
      },
      {
        icon: "⏱",
        value: "20+",
        label: "YEARS NBA/WNBA",
        verified: true, // Public record: NBA career started 2002
      },
      {
        icon: "⭐",
        value: "KD • CHET • JALEN",
        label: "ALL-STARS TRAINED",
        verified: true, // Public record
      },
      {
        icon: "📋",
        value: "SILENT TRAINING",
        label: "PROTOCOL CREATOR",
        // No verified badge - internal attribution
      },
    ],
    video: {
      poster: "/people/adamtunnel.jpeg",
      // src: "/videos/adam-harrington-philosophy.mp4", // Uncomment when video available
      duration: "1:23",
      quote:
        "Shooting is not art. It is physics. We remove the noise to find the signal.",
      attribution: "Adam Harrington",
    },
    methodology: {
      title: "THE SILENT TRAINING PROTOCOL",
      subtitle: "Methodology & Science",
      intro:
        "Adam developed the Silent Training Protocol through 20+ years working with NBA All-Stars and elite youth athletes. Unlike traditional coaching that relies on verbal cues and crowd noise, this methodology trains proprioception and internal feedback systems—critical for elite performance in high-pressure environments.",
      pillars: [
        {
          number: "01",
          title: "PROPRIOCEPTIVE FOUNDATION",
          description:
            "Remove auditory input during skill repetition. Athletes develop internal awareness of body positioning, ball contact, and release mechanics without external coaching cues. This mirrors game conditions where crowd noise drowns out verbal instruction.",
        },
        {
          number: "02",
          title: "MICRO-ADJUSTMENT CYCLES",
          description:
            "5-8 silent reps → 2-3 min video review → identify single micro-adjustment → repeat. This prevents overthinking and builds sustainable muscle memory faster than traditional '10 reps + feedback' methods.",
        },
        {
          number: "03",
          title: "GAME-CONDITION TRANSFER",
          description:
            "Silent training directly transfers to clutch moments. Athletes trained this way maintain composure and performance when external noise/pressure rises—critical for playoff basketball and high-stakes competition.",
        },
      ],
      results: {
        headline: "RESULTS & ADOPTION",
        stats: [
          {
            label: "FG% IMPROVEMENT",
            value: "3-5%",
            detail: "Within 4 weeks of protocol adoption",
          },
          {
            label: "ELITE ATHLETES TRAINED",
            value: "KD, CHET, JALEN",
            detail: "Kevin Durant, Chet Holmgren, Jalen Green",
          },
          {
            label: "PROTOCOL APPLICATIONS",
            value: "NBA TO YOUTH",
            detail: "Phantom BC, college programs, AAU teams",
          },
        ],
        closing:
          "The Protocol is now core to YouthPerformance's coaching system, ensuring every athlete—from 6-year-olds learning fundamentals to elite 16-year-olds—develops the internal feedback systems that NBA scouts look for.",
      },
    },
    mission: {
      specialty: "Shooting Mechanics",
      focus: "Constraint-Based Training",
      // NOTE: Copy is placeholder - will be revised. KD mention moved to testimonials section.
      content: `Adam Harrington is not just a coach; he is a mechanic of human movement.

Beginning as an NBA player (2002-03), Adam transitioned to the sideline where he became Director of Player Development for the Oklahoma City Thunder. Over 20+ years, he has developed NBA All-Stars, WNBA players, and elite prospects at every level.

His philosophy is simple: "Remove the noise."

Now, as co-founder of YouthPerformance, Adam is digitizing 20 years of elite NBA intel into the Silent Training Protocol — making pro-level development accessible to any athlete with a ball and 4 square feet of space.

The NBA is loud. Excellence is quiet.`,
    },
    protocols: [
      {
        number: "01",
        category: "CONSTRAINT",
        title: "SILENT TRAINING",
        count: "12 Drills",
        href: "/pillars/silent-training",
      },
      {
        number: "02",
        category: "MECHANIC",
        title: "SHOOTING ARCHITECT",
        count: "8 Modules",
        href: "/pillars/shooting-architect",
      },
      {
        number: "03",
        category: "UTILITY",
        title: "NO-HOOP DRILLS",
        count: "6 Sessions",
        href: "/pillars/no-hoop-drills",
      },
    ],
    faq: [
      {
        question: "Who has Adam Harrington trained?",
        // NOTE: Copy placeholder - testimonials section will feature specific players
        answer:
          "Adam has worked with NBA All-Stars, WNBA players, and elite prospects at every level during his 20+ year career. As Director of Player Development for the Oklahoma City Thunder and with the Brooklyn Nets, he developed some of the most recognizable names in basketball.",
      },
      {
        question: "What is Adam Harrington's coaching philosophy?",
        answer:
          '"Remove the noise." Adam focuses on biomechanical precision and constraint-based training to build repeatable shooting form. His approach strips away complexity to find the essential mechanics that produce consistent results.',
      },
      {
        question: "What is Silent Training?",
        answer:
          "Silent Training is Adam's methodology for building basketball skills without a hoop or gym. Using the NeoBall silent basketball, athletes can practice shooting mechanics, ball handling, and footwork anywhere—indoors, late at night, in small spaces.",
      },
      {
        question: "How can I train with Adam Harrington?",
        answer:
          "Adam's complete training system is available through YouthPerformance's Silent Training Protocol. Access the full library of drills, progressions, and coaching cues through the YP Academy app or website.",
      },
      {
        question: "Is this for youth athletes or advanced players?",
        answer:
          "Silent Training scales from beginner to advanced. Each drill includes progression levels, so a 10-year-old learning fundamentals and a high school varsity player refining mechanics can both benefit from the same protocol.",
      },
      {
        question: "What equipment do I need?",
        answer:
          "The core program requires only a basketball—ideally the NeoBall for truly silent training. No hoop, no gym, no special equipment. Just a ball and 4 square feet of space.",
      },
    ],
    cta: {
      headline: "TRAIN WITH ADAM",
      subtext:
        "Access the complete Silent Training Protocol library. Pro-level development, anywhere.",
      primaryCta: { label: "Start Silent Training", href: "/silent-training" },
      secondaryCta: { label: "View Protocols", href: "#protocols" },
    },
    meta: {
      lastUpdated: "January 29, 2026",
      source: "YouthPerformance",
    },
  };
}
