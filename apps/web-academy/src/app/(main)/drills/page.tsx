// ═══════════════════════════════════════════════════════════
// DRILLS INDEX PAGE
// /drills - Browse all sports and drill categories
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import {
  SPORTS,
  CATEGORIES,
  sportDisplayName,
  categoryDisplayName,
  getDrillsBySport,
} from "@/data/drills";

export const metadata: Metadata = {
  title: "Youth Sports Drills | Expert Training Library | YouthPerformance",
  description:
    "Browse 500+ expert-designed youth sports drills for basketball, soccer, baseball, and more. Step-by-step instructions, video demos, and coaching cues from elite trainers.",
  keywords: [
    "youth sports drills",
    "basketball drills",
    "soccer drills",
    "youth training",
    "sports training for kids",
  ],
  openGraph: {
    title: "Youth Sports Drills | Expert Training Library",
    description:
      "Browse 500+ expert-designed youth sports drills. Step-by-step instructions from elite trainers.",
    type: "website",
  },
};

// Sport card data with icons and descriptions
const SPORT_DATA: Record<
  string,
  { icon: string; description: string; color: string }
> = {
  basketball: {
    icon: "🏀",
    description: "Shooting, ball handling, defense, and more",
    color: "#FF6B35",
  },
  soccer: {
    icon: "⚽",
    description: "Dribbling, passing, shooting, and footwork",
    color: "#4CAF50",
  },
  baseball: {
    icon: "⚾",
    description: "Hitting, pitching, fielding, and throwing",
    color: "#2196F3",
  },
  football: {
    icon: "🏈",
    description: "Throwing, catching, footwork, and agility",
    color: "#795548",
  },
  volleyball: {
    icon: "🏐",
    description: "Serving, passing, setting, and hitting",
    color: "#E91E63",
  },
  tennis: {
    icon: "🎾",
    description: "Strokes, serve, footwork, and conditioning",
    color: "#CDDC39",
  },
  golf: {
    icon: "⛳",
    description: "Driving, irons, short game, and putting",
    color: "#009688",
  },
  lacrosse: {
    icon: "🥍",
    description: "Cradling, passing, shooting, and defense",
    color: "#673AB7",
  },
  track: {
    icon: "🏃",
    description: "Sprinting, distance, jumping, and throwing",
    color: "#FF5722",
  },
  general: {
    icon: "🦶",
    description: "Mobility, strength, balance, and barefoot training",
    color: "#00F6E0",
  },
};

export default function DrillsIndexPage() {
  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1
            className="font-bebas text-4xl md:text-6xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            YOUTH SPORTS DRILLS
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Expert-designed drills for every sport, every age, every skill level.
            Step-by-step instructions with coaching cues from elite trainers.
          </p>
        </header>

        {/* Sport Grid */}
        <section className="mb-16">
          <h2
            className="font-bebas text-2xl tracking-wider mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            BROWSE BY SPORT
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPORTS.map((sport) => {
              const data = SPORT_DATA[sport];
              const drillCount = getDrillsBySport(sport).length;

              return (
                <Link
                  key={sport}
                  href={`/drills/${sport}`}
                  className="group relative p-6 rounded-xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1 rounded-t-xl opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: data.color }}
                  />
                  <div className="text-4xl mb-3">{data.icon}</div>
                  <h3
                    className="font-bebas text-lg tracking-wider mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {sportDisplayName(sport).toUpperCase()}
                  </h3>
                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {data.description}
                  </p>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${data.color}20`,
                      color: data.color,
                    }}
                  >
                    {drillCount}+ drills
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-16">
          <h2
            className="font-bebas text-2xl tracking-wider mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            POPULAR CATEGORIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard
              sport="basketball"
              category="shooting"
              icon="🎯"
              label="Basketball Shooting"
            />
            <CategoryCard
              sport="basketball"
              category="ball-handling"
              icon="✋"
              label="Ball Handling"
            />
            <CategoryCard
              sport="general"
              category="ankle-mobility"
              icon="🦶"
              label="Ankle Mobility"
            />
            <CategoryCard
              sport="soccer"
              category="dribbling"
              icon="⚽"
              label="Soccer Dribbling"
            />
            <CategoryCard
              sport="general"
              category="speed"
              icon="⚡"
              label="Speed Training"
            />
            <CategoryCard
              sport="general"
              category="agility"
              icon="🔄"
              label="Agility Drills"
            />
            <CategoryCard
              sport="basketball"
              category="vertical-jump"
              icon="🚀"
              label="Vertical Jump"
            />
            <CategoryCard
              sport="general"
              category="plyometrics"
              icon="💥"
              label="Plyometrics"
            />
          </div>
        </section>

        {/* Age Filter Hint */}
        <section
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2
            className="font-bebas text-xl tracking-wider mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            AGE-APPROPRIATE TRAINING
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            All drills are tagged by age group. Filter to find drills perfect for your athlete.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "adult"].map(
              (age) => (
                <span
                  key={age}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Ages {age === "adult" ? "18+" : age}
                </span>
              )
            )}
          </div>
        </section>

        {/* Schema.org FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What age are these drills designed for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our drills are designed for youth athletes ages 6-18, with specific age-appropriate variations for each drill.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need equipment for these drills?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Many drills require no equipment or minimal equipment like a ball. Each drill lists its equipment requirements.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long do the drills take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most drills take 5-15 minutes. We offer filters for 5-minute and 10-minute drills for quick training sessions.",
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}

function CategoryCard({
  sport,
  category,
  icon,
  label,
}: {
  sport: string;
  category: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={`/drills/${sport}/${category}`}
      className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-105"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className="font-medium text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </span>
    </Link>
  );
}
