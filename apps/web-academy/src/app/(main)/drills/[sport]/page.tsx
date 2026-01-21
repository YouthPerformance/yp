// ═══════════════════════════════════════════════════════════
// SPORT DRILLS INDEX PAGE
// /drills/[sport] - Browse all categories for a sport
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SPORTS,
  CATEGORIES,
  type Sport,
  sportDisplayName,
  categoryDisplayName,
  getDrillsBySport,
  getDrillsByCategory,
} from "@/data/drills";

interface PageProps {
  params: Promise<{ sport: string }>;
}

export async function generateStaticParams() {
  return SPORTS.map((sport) => ({ sport }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport } = await params;

  if (!SPORTS.includes(sport as Sport)) {
    return { title: "Not Found" };
  }

  const sportName = sportDisplayName(sport as Sport);
  const drillCount = getDrillsBySport(sport).length;

  return {
    title: `${sportName} Drills | Youth Training Library | YouthPerformance`,
    description: `${drillCount}+ expert-designed ${sportName.toLowerCase()} drills for youth athletes. Step-by-step instructions, video demos, and coaching cues for all ages and skill levels.`,
    keywords: [
      `${sportName.toLowerCase()} drills`,
      `youth ${sportName.toLowerCase()}`,
      `${sportName.toLowerCase()} training`,
      `${sportName.toLowerCase()} practice drills`,
      `kids ${sportName.toLowerCase()} drills`,
    ],
    openGraph: {
      title: `${sportName} Drills | Youth Training Library`,
      description: `${drillCount}+ expert-designed ${sportName.toLowerCase()} drills for youth athletes.`,
    },
  };
}

export default async function SportDrillsPage({ params }: PageProps) {
  const { sport } = await params;

  if (!SPORTS.includes(sport as Sport)) {
    notFound();
  }

  const typedSport = sport as Sport;
  const sportName = sportDisplayName(typedSport);
  const categories = CATEGORIES[typedSport] || [];

  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/drills" className="hover:underline">
            Drills
          </Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text-primary)" }}>{sportName}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-12">
          <h1
            className="font-bebas text-4xl md:text-5xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {sportName.toUpperCase()} DRILLS
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Browse our complete library of {sportName.toLowerCase()} drills.
            Select a category below to find drills for specific skills.
          </p>
        </header>

        {/* Category Grid */}
        <section className="mb-12">
          <h2
            className="font-bebas text-2xl tracking-wider mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            DRILL CATEGORIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const drills = getDrillsByCategory(typedSport, category);
              const drillCount = drills.length;

              return (
                <Link
                  key={category}
                  href={`/drills/${typedSport}/${category}`}
                  className="group p-6 rounded-xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <h3
                    className="font-bebas text-lg tracking-wider mb-2 group-hover:text-[#00F6E0] transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {categoryDisplayName(category).toUpperCase()}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {getCategoryDescription(typedSport, category)}
                  </p>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: "rgba(0, 246, 224, 0.2)",
                      color: "#00F6E0",
                    }}
                  >
                    {drillCount > 0 ? `${drillCount} drills` : "Coming soon"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Drills Preview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-bebas text-2xl tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              ALL {sportName.toUpperCase()} DRILLS
            </h2>
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              {getDrillsBySport(typedSport).length} drills
            </span>
          </div>

          <div className="grid gap-4">
            {getDrillsBySport(typedSport)
              .slice(0, 6)
              .map((drill) => (
                <Link
                  key={drill.id}
                  href={`/drills/${typedSport}/${drill.category}/${drill.slug}`}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    <span className="text-2xl">
                      {getDifficultyEmoji(drill.difficulty)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bebas text-lg tracking-wider mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {drill.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-1 mb-2"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {drill.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {categoryDisplayName(drill.category)}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {drill.duration}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded capitalize"
                        style={{
                          backgroundColor: getDifficultyColor(drill.difficulty),
                          color: "#000",
                        }}
                      >
                        {drill.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          {getDrillsBySport(typedSport).length > 6 && (
            <div className="mt-6 text-center">
              <Link
                href={`/drills/${typedSport}/${categories[0]}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                View All Drills →
              </Link>
            </div>
          )}
        </section>

        {/* Schema.org BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Drills",
                  item: "https://academy.youthperformance.com/drills",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: sportName,
                  item: `https://academy.youthperformance.com/drills/${typedSport}`,
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}

// Helper functions
function getCategoryDescription(sport: Sport, category: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    basketball: {
      shooting: "Form shooting, free throws, jump shots, and 3-pointers",
      "ball-handling": "Dribbling, crossovers, and ball control drills",
      passing: "Chest passes, bounce passes, and outlet passing",
      defense: "Defensive slides, closeouts, and positioning",
      footwork: "Pivots, jab steps, and court movement",
      conditioning: "Basketball-specific endurance training",
      agility: "Quick direction changes and court speed",
      "vertical-jump": "Increase your vertical leap",
      strength: "Basketball-specific strength training",
    },
    soccer: {
      dribbling: "Ball control, moves, and 1v1 skills",
      passing: "Short and long passing accuracy",
      shooting: "Finishing, power shots, and placement",
      defense: "Tackling, positioning, and recovery",
      footwork: "Touch, control, and movement",
      conditioning: "Soccer-specific endurance",
      agility: "Quick changes of direction",
      "first-touch": "Receiving and controlling the ball",
      heading: "Aerial control and heading accuracy",
    },
    general: {
      "ankle-mobility": "Increase ankle range of motion and stability",
      "hip-mobility": "Unlock hip flexibility and power",
      "core-strength": "Build a stable, powerful core",
      balance: "Improve stability and proprioception",
      coordination: "Develop body control and timing",
      speed: "Sprint mechanics and acceleration",
      agility: "Quick direction changes",
      flexibility: "Increase overall flexibility",
      plyometrics: "Explosive power development",
      "barefoot-training": "Ground-based foot strengthening",
    },
  };

  return descriptions[sport]?.[category] || "Expert-designed drills for this skill";
}

function getDifficultyEmoji(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "🟢";
    case "intermediate":
      return "🟡";
    case "advanced":
      return "🔴";
    default:
      return "⚪";
  }
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "#4CAF50";
    case "intermediate":
      return "#FFC107";
    case "advanced":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
}
