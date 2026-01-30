import { Metadata } from "next";
import { getDossierData } from "./data";
import { buildSchemaGraph } from "./schema";
import { DossierClient } from "./DossierClient";

export const metadata: Metadata = {
  // Title optimized for "Adam Harrington" entity + current role
  title:
    "Adam Harrington | Phantom BC Head Coach | NBA Skills Trainer | YouthPerformance",
  description:
    "Adam Harrington is Head Coach of Phantom BC (Unrivaled League) and creator of the Silent Training Protocol. NBA/WNBA skills trainer who developed Kevin Durant, Chet Holmgren, and Jalen Green. 20+ years of elite player development.",
  // Canonical URL - prevents duplicate content
  alternates: {
    canonical: "https://youthperformance.com/coaches/adam-harrington",
  },
  openGraph: {
    title: "Adam Harrington | Phantom BC Head Coach | NBA Skills Trainer",
    description:
      "Head Coach of Phantom BC (Unrivaled League). Creator of the Silent Training Protocol. Trained Kevin Durant, Chet Holmgren, Jalen Green. 20+ years developing elite basketball players.",
    url: "https://youthperformance.com/coaches/adam-harrington",
    siteName: "YouthPerformance",
    images: [
      {
        url: "/people/adamtunnel.jpeg",
        width: 1200,
        height: 630,
        alt: "Adam Harrington - Phantom BC Head Coach, NBA Skills Trainer",
      },
    ],
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Harrington | Phantom BC Head Coach | NBA Skills Trainer",
    description:
      "Head Coach Phantom BC (Unrivaled). Creator of Silent Training Protocol. Trained KD, Chet, Jalen Green.",
    images: ["/people/adamtunnel.jpeg"],
    creator: "@coachharrington",
  },
  // Robots directives - ensure indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AdamHarringtonPage() {
  const data = getDossierData();

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildSchemaGraph(data)),
        }}
      />

      {/* Page Content */}
      <DossierClient data={data} />
    </>
  );
}
