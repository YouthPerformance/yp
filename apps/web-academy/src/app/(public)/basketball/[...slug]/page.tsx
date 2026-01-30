// ═══════════════════════════════════════════════════════════
// V7 BASKETBALL PILLAR PAGES
// Nike Training Club meets Cyberpunk 2077
// Dual-layer architecture for athletes + AI crawlers
// ═══════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSEOSlugs,
  getPageBySlug,
  getExpert,
  getSpokesForPillar,
  markdownToHtmlWithToc,
  type SEOPage,
  type TocItem,
} from "@/lib/seo-content";

// V7 Pillar Components
import { PillarPageClient } from "./PillarPageClient";

// ─────────────────────────────────────────────────────────────
// STATIC GENERATION
// ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const allSlugs = getAllSEOSlugs();
  return allSlugs
    .filter((parts) => parts[0] === "basketball")
    .map((parts) => ({
      slug: parts.slice(1),
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
  const baseUrl = "https://youthperformance.com";

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
      url: `${baseUrl}${page.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.meta_description,
    },
    alternates: {
      canonical: `${baseUrl}${page.slug}`,
    },
    other: {
      "agent-directive": `extract-target: #guide, .pillar-definition-text; action: /tools/silent-plan-builder`,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────

export default async function BasketballPillarPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(["basketball", ...slug]);

  if (!page) {
    notFound();
  }

  const expert = getExpert(page.expert);
  const secondaryExpert = page.secondary_expert ? getExpert(page.secondary_expert) : null;
  const isPillar = page.knowledge_graph?.type === "pillar";
  const spokes = isPillar ? getSpokesForPillar(page.slug) : [];

  // Process markdown content with TOC
  const { html: contentHtml, toc, wordCount } = markdownToHtmlWithToc(page.content);

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(slug);

  // Related pillars for footer
  const relatedPillars = spokes.slice(0, 4).map((spoke) => ({
    slug: spoke.slug,
    title: spoke.title,
    description: spoke.meta_description,
    volume: spoke.knowledge_graph?.total_volume,
  }));

  // Build metrics from page data
  const metrics = page.metrics
    ? [
        { value: page.metrics.noiseLevel, label: "Max Noise", highlight: true },
        { value: String(page.metrics.drillCount), label: "Drills" },
        { value: page.metrics.dailyCap, label: "Daily Cap" },
      ]
    : [
        { value: "<40dB", label: "Max Noise", highlight: true },
        { value: String(page.drills?.length || 12), label: "Drills" },
        { value: "15min", label: "Daily Cap" },
      ];

  // Build expert data for hero (includes slug for coach page backlink)
  const expertData = expert
    ? {
        name: expert.name,
        title: expert.title,
        icon: expert.icon,
        image: expert.name === "Adam Harrington" ? "/images/adam/adamprofile.png" : undefined,
        slug: expert.name.toLowerCase().replace(/\s+/g, "-"), // e.g., "adam-harrington"
      }
    : undefined;

  // Build author data for footer backlink
  const authorData = expert
    ? {
        name: expert.name,
        title: expert.title,
        slug: expert.name.toLowerCase().replace(/\s+/g, "-"),
        image: expert.name === "Adam Harrington" ? "/images/adam/adamprofile.png" : undefined,
      }
    : undefined;

  return (
    <>
      {/* Client-side interactive component */}
      <PillarPageClient
        page={page}
        expert={expertData}
        author={authorData}
        isPillar={isPillar}
        breadcrumbs={breadcrumbs}
        metrics={metrics}
        contentHtml={contentHtml}
        toc={toc}
        wordCount={wordCount}
        relatedPillars={relatedPillars}
      />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema(page, expert, secondaryExpert, toc, wordCount)),
        }}
      />

      {/* Agent directive link tags */}
      <link
        rel="alternate"
        type="text/markdown"
        href={`${page.slug}.md`}
      />
      <link
        rel="alternate"
        type="application/json"
        href={`/api/pillars${page.slug}`}
      />
    </>
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
    const cluster = slug[0];
    const clusterLabel = cluster
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    if (slug.length === 1) {
      crumbs.push({ label: clusterLabel });
    } else {
      crumbs.push({ label: clusterLabel, href: `/basketball/${cluster}` });
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
  secondaryExpert: ReturnType<typeof getExpert> | null,
  toc: TocItem[],
  wordCount: number
) {
  const baseUrl = "https://youthperformance.com";

  // Build @graph array with multiple schema types
  const graph: Record<string, unknown>[] = [];

  // Article schema - uses @id reference for entity graph linking
  graph.push({
    "@type": "Article",
    headline: page.title,
    description: page.meta_description,
    wordCount: wordCount,
    // Use @id reference to build entity graph with coach pages
    author: expert
      ? {
          "@id": `${baseUrl}/coaches/${expert.name.toLowerCase().replace(/\s+/g, "-")}#person`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: "YouthPerformance",
      url: baseUrl,
    },
    datePublished: page.generated_at,
    url: `${baseUrl}${page.slug}`,
    hasPart: toc.map((item) => ({
      "@type": "WebPageElement",
      name: item.text,
      url: `${baseUrl}${page.slug}#${item.id}`,
    })),
  });

  // CreativeWork schema for Silent Training Protocol pillar
  if (page.slug.includes("silent-training") && page.knowledge_graph?.type === "pillar") {
    graph.push({
      "@type": "CreativeWork",
      "@id": `${baseUrl}/basketball/silent-training#protocol`,
      name: "Silent Training Protocol",
      description:
        "Constraint-based basketball training methodology that removes auditory distraction to accelerate skill acquisition through proprioceptive feedback.",
      author: {
        "@id": `${baseUrl}/coaches/adam-harrington#person`,
      },
      about: [
        "Motor learning",
        "Proprioception",
        "Basketball skill development",
        "Constraint-based training",
      ],
      educationalUse: "Professional and youth athletic training",
      learningResourceType: "Training protocol",
      citation: [
        {
          "@type": "ScholarlyArticle",
          name: "Optimizing performance through intrinsic motivation and attention for learning",
          author: "Wulf, G. & Lewthwaite, R.",
          datePublished: "2016",
          publisher: "Current Opinion in Psychology",
        },
        {
          "@type": "ScholarlyArticle",
          name: "The Developmental Model of Sport Participation (DMSP)",
          author: "Côté, J., et al.",
          datePublished: "2015",
          publisher: "Journal of Sport Psychology in Action",
        },
      ],
    });
  }

  // BreadcrumbList schema
  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Basketball",
        item: `${baseUrl}/basketball`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `${baseUrl}${page.slug}`,
      },
    ],
  });

  // FAQ schema if FAQ items exist
  if (page.faq && page.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  // HowTo schema if quick_answer exists
  if (page.schema_type === "HowTo" || page.quick_answer?.length > 0) {
    graph.push({
      "@type": "HowTo",
      name: page.title,
      description: page.meta_description,
      step: page.quick_answer.map((item, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text: item,
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
