import type { Metadata } from "next";

// ═══════════════════════════════════════════════════════════
// ADAM HARRINGTON - PROJECT BLUEPRINT
// "The Architect" Profile Page
// ═══════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Adam Harrington | NBA Skills Coach & Architect of Youth Performance",
  description:
    "Adam Harrington: Former NBA Shooting Coach (OKC, Nets), Kevin Durant's skills trainer, Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance.",
  keywords: [
    "adam harrington",
    "kevin durant trainer",
    "nba shooting coach",
    "youth basketball development",
    "phantom bc coach",
    "nba skills trainer",
    "basketball shooting mechanics",
  ],
  openGraph: {
    title: "Adam Harrington | The Architect",
    description:
      "The man who trained Kevin Durant, Steve Nash, and NBA champions. Building people, not just players.",
    type: "profile",
    images: [
      {
        url: "/images/adam/adamprofile.png",
        width: 1200,
        height: 630,
        alt: "Adam Harrington - NBA Skills Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Harrington | The Architect",
    description: "Building people, not just players.",
    images: ["/images/adam/adamprofile.png"],
  },
  alternates: {
    canonical: "https://app.youthperformance.com/adam",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adam Harrington",
  jobTitle: [
    "Head Coach, Phantom BC",
    "NBA Skills Strategist",
    "Founder, Youth Performance",
  ],
  description:
    "Adam Harrington: Former NBA Shooting Coach (OKC, Nets), Kevin Durant's skills trainer, Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance.",
  url: "https://app.youthperformance.com/adam",
  sameAs: [
    "https://twitter.com/AdamHarrington",
    "https://instagram.com/CoachAHarrington",
  ],
  worksFor: [
    {
      "@type": "Organization",
      name: "Youth Performance",
      url: "https://youthperformance.com",
    },
    {
      "@type": "Organization",
      name: "Phantom BC (Unrivaled)",
    },
  ],
  knowsAbout: [
    "Shooting Mechanics",
    "Player Development",
    "Basketball Biomechanics",
    "NBA Training",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "NC State" },
    { "@type": "CollegeOrUniversity", name: "Auburn University" },
  ],
};

export default function AdamLayout({ children }: { children: React.ReactNode }) {
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
