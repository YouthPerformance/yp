/**
 * Adam Harrington Profile - The Architect's Vault
 * Content Constants
 */

export const CLIENTS = {
  nba: [
    "Kevin Durant",
    "Jimmy Butler",
    "Paolo Banchero",
    "Chet Holmgren",
    "Shai Gilgeous-Alexander",
    "Kyrie Irving",
    "James Harden",
    "Ben Simmons",
  ],
  wnba: [
    "Sabrina Ionescu",
    "Natasha Cloud",
    "Brittney Griner",
    "Breanna Stewart",
  ],
  legends: [
    "Steve Nash",
    "Jamal Crawford",
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Adam's extensive knowledge of the game and his ability to break down shooting mechanics has been essential to my development. He sees things that others miss.",
    author: "Kevin Durant",
    title: "NBA MVP, 2x NBA Champion",
  },
  {
    quote:
      "What sets Adam apart is his influence over different generations of players. He connects with everyone—from rookies to Hall of Famers—because he speaks the universal language of the game.",
    author: "Steve Nash",
    title: "2x NBA MVP, Hall of Famer",
  },
  {
    quote:
      "One of the most amazing people I've ever worked with. Adam doesn't just teach basketball—he teaches you how to think about basketball.",
    author: "Tiago Splitter",
    title: "NBA Champion",
  },
];

export const TIMELINE = [
  {
    year: "1998",
    title: "USA Junior National Team",
    subtitle: "Gold Medal",
    description:
      "Represented the United States on the international stage, laying the foundation for an understanding of elite-level basketball.",
    type: "player" as const,
  },
  {
    year: "2002",
    title: "The NBA Grind",
    subtitle: "Dallas • Denver • China",
    description:
      "Learned the game from the inside—the film sessions, the practice routines, the mental battles. This wasn't stardom; it was an education.",
    type: "player" as const,
  },
  {
    year: "2014",
    title: "The MVP Season",
    subtitle: "OKC Thunder, Shooting Coach",
    description:
      "Joined the Thunder coaching staff. Kevin Durant wins MVP. The partnership that would define a philosophy begins.",
    type: "coach" as const,
    highlight: true,
  },
  {
    year: "2016",
    title: "The Brooklyn Era",
    subtitle: "Brooklyn Nets, Player Development",
    description:
      "Moved to Brooklyn to lead player development. Built systems for skill acquisition that would become the foundation of YP.",
    type: "coach" as const,
  },
  {
    year: "2022",
    title: "Director of Player Development",
    subtitle: "Brooklyn Nets",
    description:
      "Promoted to Director. Worked with Durant, Irving, Harden—the most skilled trio in NBA history.",
    type: "coach" as const,
    highlight: true,
  },
  {
    year: "2024",
    title: "The New Era",
    subtitle: "Unrivaled / Phantom BC",
    description:
      "Named Head Coach of Phantom BC in the groundbreaking Unrivaled league. Bringing NBA-level development to women's professional basketball.",
    type: "coach" as const,
    highlight: true,
  },
  {
    year: "NOW",
    title: "The Founder",
    subtitle: "Youth Performance",
    description:
      "Launched Youth Performance to democratize elite training. Talent is everywhere—opportunity is not.",
    type: "founder" as const,
    highlight: true,
  },
];

export const PHILOSOPHY = {
  headline: "Intentionality",
  paragraphs: [
    "Basketball isn't just movement. It's math. It's physics. It's Intentionality.",
    "I don't replace your local trainer; I give them the blueprint to build you better.",
    "We are supplementing your grind with NBA-level precision.",
  ],
  tagline: "You pay for reps. We provide the vision.",
};

export const CTA = {
  headline: "Ready to train with The Architect?",
  subheadline: "Join the 15,000+ athletes already in the Pack.",
  buttons: {
    primary: {
      label: "Join the Founders Club",
      sublabel: "Limited to 168 Units",
      href: "https://shop.youthperformance.com/products/neoball-founders-edition",
    },
    secondary: {
      label: "Access the Academy",
      sublabel: "Start free today",
      href: "/sign-up",
    },
  },
};
