// ═══════════════════════════════════════════════════════════
// BASKETBALL SEO CONTENT PAGES
// Dynamic catch-all route for /basketball/* content
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSEOSlugs,
  getPageBySlug,
  getExpert,
  getSpokesForPillar,
  markdownToHtml,
  type SEOPage,
} from "@/lib/seo-content";

// ─────────────────────────────────────────────────────────────
// STATIC GENERATION
// ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const allSlugs = getAllSEOSlugs();
  // Filter to only basketball pages and remove "basketball" prefix
  return allSlugs
    .filter((parts) => parts[0] === "basketball")
    .map((parts) => ({
      slug: parts.slice(1), // Remove "basketball" from path
    }));
}

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(["basketball", ...slug]);

  if (!page) {
    return { title: "Not Found" };
  }

  const expert = getExpert(page.expert);

  return {
    title: page.title,
    description: page.meta_description,
    authors: expert ? [{ name: expert.name }] : undefined,
    openGraph: {
      title: page.title,
      description: page.meta_description,
      type: "article",
      authors: expert ? [expert.name] : undefined,
      siteName: "YouthPerformance",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.meta_description,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

export default async function BasketballContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(["basketball", ...slug]);

  if (!page) {
    notFound();
  }

  const expert = getExpert(page.expert);
  const secondaryExpert = page.secondary_expert ? getExpert(page.secondary_expert) : null;
  const isPillar = page.knowledge_graph?.type === "pillar";
  const spokes = isPillar ? getSpokesForPillar(page.slug) : [];

  // Generate breadcrumb
  const breadcrumbs = generateBreadcrumbs(slug);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 pt-8 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                <span className="mx-2">›</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--text-primary)" }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Badge */}
          {isPillar && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-accent-primary/30 rounded-full bg-accent-primary/5">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-xs font-mono text-accent-primary tracking-widest uppercase">
                Complete Guide
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[0.95] font-bebas uppercase mb-6 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              {page.title}
            </span>
          </h1>

          {/* Meta description */}
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-[60ch] leading-relaxed">
            {page.meta_description}
          </p>

          {/* Author */}
          {expert && (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                {expert.icon}
              </div>
              <div>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {expert.name}
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {expert.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          QUICK ANSWER BOX
          ════════════════════════════════════════════════════════════ */}
      {page.quick_answer && page.quick_answer.length > 0 && (
        <section className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-6 rounded-xl"
              style={{
                backgroundColor: "rgba(0, 246, 224, 0.05)",
                border: "1px solid rgba(0, 246, 224, 0.2)",
              }}
            >
              <h2 className="font-bebas text-lg tracking-wider mb-4 flex items-center gap-2">
                <span className="text-accent-primary">⚡</span>
                <span style={{ color: "var(--text-primary)" }}>QUICK ANSWER</span>
              </h2>
              <ul className="space-y-2">
                {page.quick_answer.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="text-accent-primary mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <article
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(page.content) }}
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SPOKE PAGES (For Pillars)
          ════════════════════════════════════════════════════════════ */}
      {isPillar && spokes.length > 0 && (
        <section className="px-6 pb-16 border-t border-white/5 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bebas text-2xl tracking-wider mb-8" style={{ color: "var(--text-primary)" }}>
              DIVE DEEPER
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {spokes.map((spoke) => (
                <Link
                  key={spoke.slug}
                  href={spoke.slug}
                  className="p-5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <h3 className="font-bebas tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>
                    {spoke.title}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
                    {spoke.meta_description}
                  </p>
                  {spoke.knowledge_graph?.total_volume && (
                    <span className="inline-block mt-3 text-xs px-2 py-1 rounded bg-accent-primary/10 text-accent-primary">
                      {spoke.knowledge_graph.total_volume.toLocaleString()} monthly searches
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          NEOBALL CTA
          ════════════════════════════════════════════════════════════ */}
      {page.has_neoball_cta && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-8 rounded-xl text-center"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
              }}
            >
              <h2 className="font-bebas text-3xl tracking-wider mb-3" style={{ color: "var(--text-primary)" }}>
                TRAIN SILENT. TRAIN ANYWHERE.
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                The world's best silent basketball—according to the kids.
              </p>
              <a
                href="https://neoball.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-wide text-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  color: "var(--bg-primary)",
                  boxShadow: "0 0 20px rgba(0, 246, 224, 0.3)",
                }}
              >
                Enter the Draft →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════
          SCHEMA.ORG STRUCTURED DATA
          ════════════════════════════════════════════════════════════ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema(page, expert, secondaryExpert)),
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function generateBreadcrumbs(slug: string[]): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Basketball", href: "/basketball" },
  ];

  if (slug.length > 0) {
    // First segment is usually the cluster (silent-training, home-training)
    const cluster = slug[0];
    const clusterLabel = cluster
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (slug.length === 1) {
      crumbs.push({ label: clusterLabel });
    } else {
      crumbs.push({ label: clusterLabel, href: `/basketball/${cluster}` });
      // Last segment is the page title (will be replaced by actual title in render)
      const pageLabel = slug[slug.length - 1]
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      crumbs.push({ label: pageLabel });
    }
  }

  return crumbs;
}

function generateSchema(
  page: SEOPage,
  expert: ReturnType<typeof getExpert>,
  secondaryExpert: ReturnType<typeof getExpert> | null
) {
  const baseUrl = "https://youthperformance.com";

  if (page.schema_type === "HowTo") {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: page.title,
      description: page.meta_description,
      author: expert
        ? {
            "@type": "Person",
            name: expert.name,
            jobTitle: expert.title,
          }
        : undefined,
      step: page.quick_answer.map((item, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: item,
      })),
    };
  }

  // Default Article schema
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.meta_description,
    author: expert
      ? {
          "@type": "Person",
          name: expert.name,
          jobTitle: expert.title,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "YouthPerformance",
      url: baseUrl,
    },
    datePublished: page.generated_at,
    url: `${baseUrl}${page.slug}`,
  };
}
