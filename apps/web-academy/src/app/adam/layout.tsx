import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adam Harrington | The Architect",
  description:
    "The official profile of Adam Harrington. Former NBA Shooting Coach (OKC, Nets), Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance.",
  openGraph: {
    title: "Adam Harrington | The Architect of Youth Performance",
    description:
      "20 years engineering greatness for Kevin Durant, Steve Nash, and the next generation.",
    images: ["/images/adam/og-adam.jpg"],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Harrington | The Architect",
    description: "From KD's MVP season to building the next generation.",
  },
};

export default function AdamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Adam Harrington",
            jobTitle: [
              "Head Coach, Phantom BC",
              "NBA Skills Strategist",
              "Founder, Youth Performance",
            ],
            knowsAbout: [
              "Shooting Mechanics",
              "Player Development",
              "Basketball Biomechanics",
            ],
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "NC State University" },
              { "@type": "CollegeOrUniversity", name: "Auburn University" },
            ],
            worksFor: [
              { "@type": "Organization", name: "Youth Performance" },
              { "@type": "Organization", name: "Phantom BC" },
            ],
          }),
        }}
      />
      {/* Full-screen page without header padding */}
      <div className="fixed inset-0 overflow-hidden" style={{ top: 0, paddingTop: 0 }}>
        {children}
      </div>
    </>
  );
}
