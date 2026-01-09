import type { Metadata } from "next";
import { SEO } from "./constants";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    type: "profile",
    images: [
      {
        url: "/images/james/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "James Scott - Founder of Youth Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: ["/images/james/og-image.jpg"],
  },
  alternates: {
    canonical: "https://academy.youthperformance.com/james",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "James Scott",
  jobTitle: "Movement Specialist & Foot Performance Coach",
  description: SEO.description,
  url: "https://academy.youthperformance.com/james",
  sameAs: ["https://instagram.com/weakfeetdonteat", "https://twitter.com/weakfeetdonteat"],
  worksFor: {
    "@type": "Organization",
    name: "Youth Performance",
    url: "https://youthperformance.com",
  },
  knowsAbout: [
    "Barefoot Training",
    "Foot Performance",
    "Youth Athletic Development",
    "NBA Training",
    "NFL Training",
  ],
};

export default function JamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Remove global header padding for full-screen mobile experience */}
      <div className="-mt-16 lg:-mt-20">{children}</div>
    </>
  );
}
