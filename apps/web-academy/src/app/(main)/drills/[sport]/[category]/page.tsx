// ═══════════════════════════════════════════════════════════
// CATEGORY DRILLS PAGE
// /drills/[sport]/[category] - Drill listing with filters
// Programmatic SEO: [Sport] × [Category] × [Age] × [Constraint]
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SPORTS,
  CATEGORIES,
  AGE_GROUPS,
  CONSTRAINTS,
  type Sport,
  type AgeGroup,
  type Constraint,
  sportDisplayName,
  categoryDisplayName,
  ageGroupDisplayName,
  constraintDisplayName,
  generateMetaTitle,
  generateMetaDescription,
  generateH1,
  generateIntro,
  getDrillsByFilters,
  getAvailableAgeGroups,
  getAvailableConstraints,
  DRILL_AUTHORS,
} from "@/data/drills";
import { DrillCard } from "@/components/drills/DrillCard";
import { DrillFilters } from "@/components/drills/DrillFilters";

interface PageProps {
  params: Promise<{ sport: string; category: string }>;
  searchParams: Promise<{ age?: string; constraint?: string }>;
}

export async function generateStaticParams() {
  const params: { sport: string; category: string }[] = [];

  for (const sport of SPORTS) {
    const categories = CATEGORIES[sport] || [];
    for (const category of categories) {
      params.push({ sport, category });
    }
  }

  return params;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { sport, category } = await params;
  const { age, constraint } = await searchParams;

  if (!SPORTS.includes(sport as Sport)) {
    return { title: "Not Found" };
  }

  const categories = CATEGORIES[sport as Sport] || [];
  if (!(categories as readonly string[]).includes(category)) {
    return { title: "Not Found" };
  }

  const typedSport = sport as Sport;
  const ageGroup = age as AgeGroup | undefined;
  const constraintFilter = constraint as Constraint | undefined;

  const drills = getDrillsByFilters({
    sport: typedSport,
    category,
    ageGroup,
    constraint: constraintFilter,
  });

  return {
    title: generateMetaTitle(typedSport, category, ageGroup, constraintFilter),
    description: generateMetaDescription(
      typedSport,
      category,
      ageGroup,
      constraintFilter,
      drills.length
    ),
    keywords: [
      `${sportDisplayName(typedSport).toLowerCase()} ${categoryDisplayName(category).toLowerCase()} drills`,
      `youth ${sportDisplayName(typedSport).toLowerCase()}`,
      `${categoryDisplayName(category).toLowerCase()} training`,
      ageGroup ? `drills for ${ageGroupDisplayName(ageGroup).toLowerCase()}` : "",
      constraintFilter ? constraintDisplayName(constraintFilter).toLowerCase() : "",
    ].filter(Boolean),
    openGraph: {
      title: generateH1(typedSport, category, ageGroup, constraintFilter),
      description: generateMetaDescription(typedSport, category, ageGroup, constraintFilter),
    },
  };
}

export default async function CategoryDrillsPage({ params, searchParams }: PageProps) {
  const { sport, category } = await params;
  const { age, constraint } = await searchParams;

  // Validate sport
  if (!SPORTS.includes(sport as Sport)) {
    notFound();
  }

  // Validate category
  const categories = CATEGORIES[sport as Sport] || [];
  if (!(categories as readonly string[]).includes(category)) {
    notFound();
  }

  const typedSport = sport as Sport;
  const ageGroup = age as AgeGroup | undefined;
  const constraintFilter = constraint as Constraint | undefined;

  // Get filtered drills
  const drills = getDrillsByFilters({
    sport: typedSport,
    category,
    ageGroup,
    constraint: constraintFilter,
  });

  // Get available filter options
  const availableAgeGroups = getAvailableAgeGroups(typedSport, category);
  const availableConstraints = getAvailableConstraints(typedSport, category);

  // Generate page content
  const h1 = generateH1(typedSport, category, ageGroup, constraintFilter);
  const intro = generateIntro(typedSport, category, ageGroup);

  // Related categories (same sport, different category)
  const relatedCategories = categories
    .filter((c) => c !== category)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
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
          <span style={{ color: "var(--text-primary)" }}>
            {categoryDisplayName(category)}
          </span>
        </nav>

        {/* Hero Section */}
        <header className="mb-8">
          <h1
            className="font-bebas text-3xl md:text-4xl tracking-wider mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {h1.toUpperCase()}
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {intro}
          </p>
        </header>

        {/* Filters */}
        <DrillFilters
          sport={typedSport}
          category={category}
          currentAge={ageGroup}
          currentConstraint={constraintFilter}
          availableAgeGroups={availableAgeGroups}
          availableConstraints={availableConstraints}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Showing {drills.length} drill{drills.length !== 1 ? "s" : ""}
            {ageGroup && ` for ${ageGroupDisplayName(ageGroup)}`}
            {constraintFilter && ` • ${constraintDisplayName(constraintFilter)}`}
          </p>
        </div>

        {/* Drill Grid */}
        {drills.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {drills.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                href={`/drills/${typedSport}/${category}/${drill.slug}`}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 rounded-xl mb-12"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="text-4xl mb-4 block">🔍</span>
            <h2
              className="font-bebas text-xl tracking-wider mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              NO DRILLS FOUND
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
              Try adjusting your filters or check back soon for new drills.
            </p>
            <Link
              href={`/drills/${typedSport}/${category}`}
              className="inline-block px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Clear Filters
            </Link>
          </div>
        )}

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="mb-12">
            <h2
              className="font-bebas text-xl tracking-wider mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              MORE {sportDisplayName(typedSport).toUpperCase()} DRILLS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/drills/${typedSport}/${cat}`}
                  className="p-4 rounded-xl text-center transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <span
                    className="font-bebas tracking-wider"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {categoryDisplayName(cat).toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Expert Callout */}
        <section
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h3
                className="font-bebas text-lg tracking-wider mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                EXPERT-DESIGNED DRILLS
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                All drills are designed and reviewed by elite coaches including{" "}
                <strong>{DRILL_AUTHORS.ADAM.name}</strong> (Basketball) and{" "}
                <strong>{DRILL_AUTHORS.JAMES.name}</strong> (Barefoot Training).
              </p>
            </div>
          </div>
        </section>

        {/* Schema.org BreadcrumbList + ItemList */}
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
              ],
            }),
          }}
        />

        {drills.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: drills.slice(0, 10).map((drill, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "HowTo",
                    name: drill.title,
                    description: drill.description,
                    step: drill.steps.map((step, i) => ({
                      "@type": "HowToStep",
                      position: i + 1,
                      text: step.instruction,
                    })),
                  },
                })),
              }),
            }}
          />
        )}
      </div>
    </div>
  );
}
