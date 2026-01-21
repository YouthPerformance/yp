import type { Metadata } from "next";

// ═══════════════════════════════════════════════════════════
// JAMES SCOTT - PROJECT BLACKOUT
// "The Movement Scientist" Profile Page
// ═══════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "James Scott | Movement Specialist & Foot Performance Coach",
  description:
    "James Scott is the Movement Scientist behind Weak Feet Don't Eat. Trainer of Jimmy Butler, NFL athletes, and global icons. Creator of the Barefoot Reset methodology.",
  keywords: [
    "james scott",
    "weak feet don't eat",
    "barefoot training",
    "jimmy butler trainer",
    "foot performance coach",
    "youth athlete training",
    "movement specialist",
    "barefoot reset",
  ],
  openGraph: {
    title: "James Scott | The Movement Scientist",
    description:
      "Trainer of Jimmy Butler, NFL athletes, and global icons. Fix the feet, fix everything upstream.",
    type: "profile",
    images: [
      {
        url: "/images/james/jamesjimmyside.webp",
        width: 1200,
        height: 630,
        alt: "James Scott - Movement Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "James Scott | The Movement Scientist",
    description: "Weak feet don't eat. Fix the feet, fix everything upstream.",
    images: ["/images/james/jamesjimmyside.webp"],
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
  description:
    "James Scott is the Movement Scientist behind Weak Feet Don't Eat. Trainer of Jimmy Butler, NFL athletes, and global icons. Creator of the Barefoot Reset methodology.",
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
