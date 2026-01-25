// ═══════════════════════════════════════════════════════════
// INDIVIDUAL DRILL PAGE
// /drills/[sport]/[category]/[slug] - Full drill detail
// Schema.org HowTo markup for rich snippets
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
  ageGroupDisplayName,
  constraintDisplayName,
  getDrillBySlug,
  getDrillsByCategory,
  DRILL_AUTHORS,
} from "@/data/drills";

interface PageProps {
  params: Promise<{ sport: string; category: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { sport: string; category: string; slug: string }[] = [];

  for (const sport of SPORTS) {
    const categories = CATEGORIES[sport] || [];
    for (const category of categories) {
      const drills = getDrillsByCategory(sport, category);
      for (const drill of drills) {
        params.push({ sport, category, slug: drill.slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport, category, slug } = await params;

  const drill = getDrillBySlug(slug);
  if (!drill) {
    return { title: "Drill Not Found" };
  }

  const sportName = sportDisplayName(sport as Sport);
  const categoryName = categoryDisplayName(category);
  const author = DRILL_AUTHORS[drill.author];

  return {
    title: `${drill.title} | ${categoryName} Drill for Youth ${sportName}`,
    description: `${drill.description} Step-by-step instructions, coaching cues, and variations. ${drill.duration} drill designed by ${author.name}.`,
    keywords: [
      drill.title.toLowerCase(),
      `${sportName.toLowerCase()} ${categoryName.toLowerCase()} drill`,
      `youth ${sportName.toLowerCase()} training`,
      ...drill.ageGroups.map((age) => `${ageGroupDisplayName(age)} drills`),
      ...drill.constraints.map((c) => constraintDisplayName(c).toLowerCase()),
    ],
    authors: [{ name: author.name }],
    openGraph: {
      title: drill.title,
      description: drill.description,
      type: "article",
      authors: [author.name],
    },
  };
}

export default async function DrillDetailPage({ params }: PageProps) {
  const { sport, category, slug } = await params;

  // Validate sport
  if (!SPORTS.includes(sport as Sport)) {
    notFound();
  }

  // Validate category
  const categories = CATEGORIES[sport as Sport] || [];
  if (!(categories as readonly string[]).includes(category)) {
    notFound();
  }

  // Get drill
  const drill = getDrillBySlug(slug);
  if (!drill || drill.sport !== sport || drill.category !== category) {
    notFound();
  }

  const typedSport = sport as Sport;
  const author = DRILL_AUTHORS[drill.author];

  // Related drills (same category, different drill)
  const relatedDrills = getDrillsByCategory(typedSport, category)
    .filter((d) => d.id !== drill.id)
    .slice(0, 4);

  const difficultyColors = {
    beginner: { bg: "#4CAF50", text: "#fff" },
    intermediate: { bg: "#FFC107", text: "#000" },
    advanced: { bg: "#F44336", text: "#fff" },
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/drills" className="hover:underline">
            Drills
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/drills/${typedSport}`} className="hover:underline">
            {sportDisplayName(typedSport)}
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/drills/${typedSport}/${category}`} className="hover:underline">
            {categoryDisplayName(category)}
          </Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text-primary)" }}>{drill.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: difficultyColors[drill.difficulty].bg,
                color: difficultyColors[drill.difficulty].text,
              }}
            >
              {drill.difficulty.charAt(0).toUpperCase() + drill.difficulty.slice(1)}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {drill.duration}
            </span>
            {drill.constraints.includes("no-equipment") && (
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: "rgba(0, 246, 224, 0.2)",
                  color: "#00F6E0",
                }}
              >
                No Equipment
              </span>
            )}
          </div>

          <h1
            className="font-bebas text-3xl md:text-5xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {drill.title.toUpperCase()}
          </h1>

          <p
            className="text-lg mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {drill.description}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <span className="text-xl">{author.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {author.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {author.title}
              </p>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <section
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl mb-8"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="text-center">
            <p className="text-2xl mb-1">⏱️</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {drill.duration}
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Duration
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-sm font-medium capitalize" style={{ color: "var(--text-primary)" }}>
              {drill.difficulty}
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Difficulty
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">👥</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {drill.ageGroups.length > 3
                ? `${ageGroupDisplayName(drill.ageGroups[0])}+`
                : drill.ageGroups.map((a) => ageGroupDisplayName(a)).join(", ")}
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Age Groups
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {drill.steps.length} Steps
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Instructions
            </p>
          </div>
        </section>

        {/* Benefits */}
        {drill.benefits.length > 0 && (
          <section className="mb-8">
            <h2
              className="font-bebas text-xl tracking-wider mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              BENEFITS
            </h2>
            <div className="flex flex-wrap gap-2">
              {drill.benefits.map((benefit, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-sm"
                  style={{
                    backgroundColor: "rgba(0, 246, 224, 0.1)",
                    color: "#00F6E0",
                    border: "1px solid rgba(0, 246, 224, 0.3)",
                  }}
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Equipment */}
        <section className="mb-8">
          <h2
            className="font-bebas text-xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            EQUIPMENT NEEDED
          </h2>
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            {drill.equipment.length === 0 || drill.equipment[0] === "None" ? (
              <p className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                <span className="text-xl">✅</span>
                No equipment needed - bodyweight only!
              </p>
            ) : (
              <ul className="space-y-2">
                {drill.equipment.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="text-lg">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Steps */}
        <section className="mb-8">
          <h2
            className="font-bebas text-xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            HOW TO DO IT
          </h2>
          <div className="space-y-4">
            {drill.steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bebas text-lg"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--bg-primary)",
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Step {index + 1}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {step.instruction}
                  </p>
                  {step.coachingCue && (
                    <div
                      className="mt-3 p-3 rounded-lg text-sm"
                      style={{
                        backgroundColor: "rgba(0, 246, 224, 0.1)",
                        border: "1px solid rgba(0, 246, 224, 0.2)",
                      }}
                    >
                      <span className="font-medium" style={{ color: "#00F6E0" }}>
                        💡 Coach&apos;s Tip:{" "}
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {step.coachingCue}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Variations */}
        {drill.variations && drill.variations.length > 0 && (
          <section className="mb-8">
            <h2
              className="font-bebas text-xl tracking-wider mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              VARIATIONS
            </h2>
            <div className="grid gap-4">
              {drill.variations.map((variation, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                      style={{
                        backgroundColor:
                          variation.difficulty === "easier"
                            ? "rgba(76, 175, 80, 0.2)"
                            : "rgba(244, 67, 54, 0.2)",
                        color: variation.difficulty === "easier" ? "#4CAF50" : "#F44336",
                      }}
                    >
                      {variation.difficulty}
                    </span>
                    <h3
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {variation.name}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {variation.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Age Group Guidance */}
        <section className="mb-8">
          <h2
            className="font-bebas text-xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            RECOMMENDED AGE GROUPS
          </h2>
          <div className="flex flex-wrap gap-2">
            {drill.ageGroups.map((age) => (
              <Link
                key={age}
                href={`/drills/${typedSport}/${category}?age=${age}`}
                className="px-4 py-2 rounded-lg text-sm transition-colors hover:scale-105"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                {ageGroupDisplayName(age)}
              </Link>
            ))}
          </div>
        </section>

        {/* Constraints/Tags */}
        <section className="mb-12">
          <h2
            className="font-bebas text-xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            TAGS
          </h2>
          <div className="flex flex-wrap gap-2">
            {drill.constraints.map((constraint) => (
              <Link
                key={constraint}
                href={`/drills/${typedSport}/${category}?constraint=${constraint}`}
                className="px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {constraintDisplayName(constraint)}
              </Link>
            ))}
          </div>
        </section>

        {/* Related Drills */}
        {relatedDrills.length > 0 && (
          <section className="mb-12">
            <h2
              className="font-bebas text-xl tracking-wider mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              MORE {categoryDisplayName(category).toUpperCase()} DRILLS
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedDrills.map((related) => (
                <Link
                  key={related.id}
                  href={`/drills/${typedSport}/${category}/${related.slug}`}
                  className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <h3
                    className="font-bebas tracking-wider mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {related.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="p-8 rounded-xl text-center"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2
            className="font-bebas text-2xl tracking-wider mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            READY TO TRAIN?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Get personalized training plans and track your progress with our
            full workout programs.
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-primary)",
            }}
          >
            Explore Programs →
          </Link>
        </section>

        {/* Schema.org HowTo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: drill.title,
              description: drill.description,
              totalTime: parseDuration(drill.duration),
              supply: drill.equipment.map((item) => ({
                "@type": "HowToSupply",
                name: item,
              })),
              step: drill.steps.map((step, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: `Step ${i + 1}`,
                text: step.instruction,
                ...(step.coachingCue && { tip: step.coachingCue }),
              })),
              author: {
                "@type": "Person",
                name: author.name,
                jobTitle: author.title,
              },
            }),
          }}
        />

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
                  item: "https://app.youthperformance.com/drills",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: sportDisplayName(typedSport),
                  item: `https://app.youthperformance.com/drills/${typedSport}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: categoryDisplayName(category),
                  item: `https://app.youthperformance.com/drills/${typedSport}/${category}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: drill.title,
                  item: `https://app.youthperformance.com/drills/${typedSport}/${category}/${drill.slug}`,
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}

// Helper to convert duration string to ISO 8601 duration
function parseDuration(duration: string): string {
  // "5-10 min" -> "PT10M" (use upper bound)
  // "10 min" -> "PT10M"
  const match = duration.match(/(\d+)(?:-(\d+))?\s*min/i);
  if (match) {
    const minutes = match[2] ? parseInt(match[2]) : parseInt(match[1]);
    return `PT${minutes}M`;
  }
  return "PT10M"; // Default fallback
}
