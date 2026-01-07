import type { Metadata } from "next";

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Adam Harrington — NBA Skills Development Coach | YouthPerformance",
  description:
    "Adam Harrington is an NBA & WNBA skills development coach who has trained Kevin Durant, Jimmy Butler, Sabrina Ionescu, and 50+ professional athletes. Now bringing elite training to youth athletes through YouthPerformance.",
  keywords: [
    "Adam Harrington",
    "basketball trainer",
    "NBA skills coach",
    "Kevin Durant trainer",
    "basketball development",
    "youth basketball training",
    "NeoBall",
  ],
  openGraph: {
    title: "Adam Harrington — NBA Skills Development Coach",
    description:
      "Train with the coach behind Kevin Durant's MVP season. Now bringing elite training to youth athletes everywhere.",
    images: [
      {
        url: "/images/adam/adam-og.jpg",
        width: 1200,
        height: 630,
        alt: "Adam Harrington - NBA Skills Development Coach",
      },
    ],
    type: "profile",
    url: "https://academy.youthperformance.com/adam",
  },
  twitter: {
    card: "summary_large_image",
    site: "@yikibooki",
    creator: "@adampharrington",
    title: "Adam Harrington — NBA Skills Development Coach",
    description:
      "Train with the coach behind Kevin Durant's MVP season.",
    images: ["/images/adam/adam-twitter.jpg"],
  },
  alternates: {
    canonical: "https://academy.youthperformance.com/adam",
  },
};

// ─────────────────────────────────────────────────────────────
// LAYOUT - Uses global YP design tokens
// ─────────────────────────────────────────────────────────────

export default function AdamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // Counter the global header padding
        marginTop: "-80px",
        position: "relative",
      }}
    >
      {/* JSON-LD Schema - Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Adam Harrington",
            jobTitle: "NBA & WNBA Skills Development Coach",
            description:
              "Professional basketball skills development coach with 20+ years of experience training NBA and WNBA athletes.",
            image: "https://academy.youthperformance.com/images/adam/adam-harrington.jpg",
            url: "https://academy.youthperformance.com/adam",
            sameAs: [
              "https://twitter.com/adampharrington",
              "https://instagram.com/adampharrington",
            ],
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "NC State University" },
              { "@type": "CollegeOrUniversity", name: "Auburn University" },
            ],
            award: [
              "Gatorade Player of the Year (Massachusetts)",
              "All-SEC Honors",
              "USA Junior Olympics Gold Medal (1998)",
            ],
            affiliation: [
              { "@type": "SportsTeam", name: "Phantom BC", sport: "Basketball" },
              { "@type": "SportsTeam", name: "Portland Trail Blazers", sport: "Basketball" },
              { "@type": "Organization", name: "YouthPerformance" },
            ],
            knowsAbout: [
              "Basketball coaching",
              "Player development",
              "Shooting mechanics",
              "Athletic training",
            ],
            worksFor: {
              "@type": "Organization",
              name: "YouthPerformance",
              url: "https://youthperformance.com",
            },
          }),
        }}
      />

      {/* JSON-LD Schema - Product Connection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "NeoBall Founders Edition",
            description:
              "Silent, regulation-weight indoor training basketball with exclusive Foundation training modules by Adam Harrington.",
            brand: { "@type": "Brand", name: "YouthPerformance" },
            offers: {
              "@type": "Offer",
              price: "168.00",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            creator: { "@type": "Person", name: "Adam Harrington" },
          }),
        }}
      />

      {/* Page content uses global YP design tokens */}
      {children}
    </div>
  );
}
