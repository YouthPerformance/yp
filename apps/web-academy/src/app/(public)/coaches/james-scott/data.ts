// James Scott Dossier - Content Data
// All claims have been verified per Proof Policy

export interface ProLogo {
  name: string;
  logo?: string;
  type: "athlete" | "team" | "brand";
  label?: string;
}

export interface DossierData {
  hero: {
    badge: string;
    name: string;
    title: string;
    tagline: string;
    image: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  proLogos: ProLogo[];
  stats: Array<{
    icon: string;
    value: string;
    label: string;
    verified?: boolean;
    attributed?: boolean;
  }>;
  story: {
    headline: string;
    paragraphs: string[];
    philosophy: {
      quote: string;
      subtext: string;
    };
  };
  methodology: {
    title: string;
    subtitle: string;
    intro: string;
    pillars: Array<{
      number: string;
      title: string;
      description: string;
      href: string;
    }>;
    closing: string;
  };
  multiSport: {
    headline: string;
    sports: Array<{
      sport: string;
      name: string;
      role: string;
    }>;
    extras: string[];
  };
  family: {
    headline: string;
    content: string;
    quote: string;
  };
  credentials: {
    subject: string;
    role: string;
    affiliation: string;
    education: string;
    specialization: string;
    media: string;
    signature: string;
  };
  video: {
    poster: string;
    src?: string;
    duration?: string;
    quote: string;
    attribution: string;
  };
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
    references: string[];
  };
}

export function getDossierData(): DossierData {
  return {
    hero: {
      badge: "VERIFIED PERFORMANCE SPECIALIST",
      name: "JAMES SCOTT",
      title: "Co-Founder & Human Performance Specialist",
      tagline:
        "The architect behind elite durability. From Jimmy Butler to Tottenham FC, James has engineered movement for the world's best. Now he's bringing that same science to your family.",
      image: "/people/james/jame6pack1.jpeg",
      primaryCta: { label: "Start Barefoot Reset", href: "/basketball/barefoot-reset" },
      secondaryCta: { label: "View Methodology", href: "#methodology" },
    },
    proLogos: [
      { name: "NBA", logo: "/people/james/sports/nba.webp", type: "team" },
      { name: "NFL", logo: "/people/james/sports/nfl.webp", type: "team" },
      { name: "Olympics", logo: "/people/james/sports/olympics.webp", type: "brand" },
      { name: "Premier League", logo: "/people/james/sports/premier.webp", type: "team" },
      { name: "Netflix", type: "brand" },
      { name: "ESPN", type: "brand" },
      { name: "Men's Health", type: "brand" },
    ],
    stats: [
      {
        icon: "⏱",
        value: "20+",
        label: "YEARS ELITE SPORT",
        verified: true,
      },
      {
        icon: "🏀",
        value: "JIMMY BUTLER",
        label: "CURRENT CLIENT",
        attributed: true, // First-party claim
      },
      {
        icon: "🌏",
        value: "100K+",
        label: "YOUTH (NIKE RISE)",
        verified: true,
      },
      {
        icon: "🏆",
        value: "MULTI-SPORT",
        label: "NBA · NFL · EPL",
        verified: true,
      },
    ],
    story: {
      headline: "THE GROUND WAR BEGINS AT HOME",
      paragraphs: [
        "For 20 years, James Scott has been the invisible hand behind elite athletic performance. As Performance Coach for the Houston Rockets, Performance Director for the Shanghai Sharks, and creator of Nike Rise—a program that trained over 100,000 youth athletes daily across Asia—he's engineered durability at the highest levels of sport.",
        "His methods have been featured on Netflix, Men's Health, and ESPN. He's worked with NBA All-Star Jimmy Butler, NFL tight end Josh Oliver, and Premier League clubs including Tottenham Hotspur.",
        "Then he became a coach dad.",
        "Watching his two sons play basketball, James saw the same broken patterns he'd spent his career fixing in the pros—weak ankles, collapsed arches, movement compensations that would eventually lead to injury. Parents started asking him: \"How do I train my kid?\"",
        "That question became YouthPerformance.",
        "\"The science I use with Jimmy Butler is the same science every 10-year-old deserves. The only difference is the dose.\"",
      ],
      philosophy: {
        quote: "Weak Feet Don't Eat.",
        subtext:
          "If the foundation is broken, the whole system fails. James's methodology starts from the ground up—literally.",
      },
    },
    methodology: {
      title: "THE BAREFOOT RESET FRAMEWORK",
      subtitle: "R3 Protocol",
      intro:
        "Most training programs build pistons—muscles that push and break down. James builds springs—elastic systems that recycle energy and last. The Barefoot Reset rewires the foot-brain connection that modern footwear has destroyed.",
      pillars: [
        {
          number: "01",
          title: "RELEASE",
          description:
            "Strip neurological brakes. Unlock restricted tissue. Remove the tension patterns that limit power transfer from ground to movement.",
          href: "/basketball/barefoot-reset#release",
        },
        {
          number: "02",
          title: "RESTORE",
          description:
            "Reinstall the foot-brain connection. Wake up the sensors. Rebuild proprioception that modern shoes have dulled over years of use.",
          href: "/basketball/barefoot-reset#restore",
        },
        {
          number: "03",
          title: "RE-ENGINEER",
          description:
            "Build a chassis worthy of the engine. Train the foot's 26 bones, 33 joints, and 100+ muscles to act as springs, not pistons.",
          href: "/basketball/barefoot-reset#reengineer",
        },
      ],
      closing:
        "The Berlin Protocol. The Rio Method. 20 years of research distilled into a system any athlete can follow—from 8-year-olds to NBA guards.",
    },
    multiSport: {
      headline: "ONE SYSTEM. EVERY SPORT.",
      sports: [
        {
          sport: "BASKETBALL",
          name: "Jimmy Butler",
          role: "NBA All-Star",
        },
        {
          sport: "FOOTBALL",
          name: "Josh Oliver",
          role: "Vikings TE",
        },
        {
          sport: "SOCCER",
          name: "Tottenham FC",
          role: "Premier League",
        },
      ],
      extras: [
        "Tennis (NIL Athletes)",
        "Youth Programs (Nike Rise)",
        "His Own Sons",
      ],
    },
    family: {
      headline: "COACH DAD",
      content:
        "James coaches his sons' basketball team. Not because they need a pro-level trainer—but because he believes every kid deserves someone who understands how their body actually works.",
      quote:
        "Parents spend thousands on travel teams and private coaches. Meanwhile, their kid can't control their toes. We've got the pyramid upside down.",
    },
    credentials: {
      subject: "Scott, James",
      role: "Co-Founder & Human Performance Specialist",
      affiliation: "YouthPerformance // Houston Rockets (Fmr) // Shanghai Sharks (Fmr)",
      education: "Exercise & Sports Science + Doctoral Research (Biomechanics)",
      specialization: "Foot/Ankle Architecture, Tendon Elasticity, Youth Biomechanics",
      media: "Netflix, ESPN, Men's Health",
      signature: "THE BAREFOOT RESET PROTOCOL",
    },
    video: {
      poster: "/people/james/jamesjimmy2.jpeg",
      // src: "/videos/james-scott-methodology.mp4", // Uncomment when available
      duration: "2:15",
      quote:
        "You can't fire a cannon from a canoe. If the foot is soft, the whole system leaks power.",
      attribution: "James Scott",
    },
    faq: [
      {
        question: "What makes James's approach different?",
        answer:
          "Foot-first methodology based on tendon science, not muscle grinding. James trains the elastic system—tendons and fascia that recycle energy—rather than just building muscles that fatigue and break down.",
      },
      {
        question: "Is this just for basketball players?",
        answer:
          "No. James has trained NBA All-Stars, NFL tight ends, and Premier League footballers using the same foundational system. The foot is the foot, regardless of sport. The principles transfer.",
      },
      {
        question: "How can my child train with James?",
        answer:
          "Through YouthPerformance's Barefoot Reset program. The complete R3 Protocol is available in the YP Academy, with progressions scaled from 8-year-olds to elite athletes.",
      },
      {
        question: "What is 'Weak Feet Don't Eat'?",
        answer:
          "James's core philosophy: the foot is the foundation of all athletic movement. If you have weak feet—collapsed arches, dormant toe muscles, no proprioception—your entire athletic system is compromised. Fix the feet first.",
      },
      {
        question: "Is this safe for young athletes?",
        answer:
          "Absolutely. The protocols are designed to be scalable. The same principles apply to an 8-year-old learning movement as to an NBA guard refining performance—only the intensity and volume change.",
      },
      {
        question: "What equipment is needed?",
        answer:
          "Minimal. The core program uses the Iso-Strap and barefoot work. No gym required. The exercises can be done at home with a few square feet of space.",
      },
    ],
    cta: {
      headline: "TRAIN WITH JAMES",
      subtext:
        "Access the complete Barefoot Reset Protocol. The same movement science trusted by Jimmy Butler—now available for your family.",
      primaryCta: { label: "Start Barefoot Reset", href: "/basketball/barefoot-reset" },
      secondaryCta: { label: "View All Programs", href: "/programs" },
    },
    meta: {
      lastUpdated: "January 29, 2026",
      source: "YouthPerformance",
      references: [
        "Houston Rockets",
        "Shanghai Sharks",
        "Nike Rise",
        "ESPN",
        "Men's Health",
        "Netflix",
      ],
    },
  };
}
