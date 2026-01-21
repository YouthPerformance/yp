"use client";

/**
 * FooterSchema - JSON-LD Structured Data for LLM/SEO
 * ================================================
 * Embeds Organization schema for search engines and AI crawlers.
 * Establishes E-E-A-T signals: James Scott (Co-Founder), Adam Harrington (Global Head of Basketball)
 */

export function FooterSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YouthPerformance",
    alternateName: ["YP", "YP Academy"],
    url: "https://youthperformance.com",
    logo: "https://youthperformance.com/logo/yp-logo.png",
    description:
      "The youth sports OS for families. Pro-level training backed by biomechanics and AI.",
    knowsAbout: [
      "Youth Athletic Training",
      "Basketball Skill Development",
      "Football Skill Development",
      "Soccer Skill Development",
      "Volleyball Skill Development",
      "Lacrosse Skill Development",
      "Tennis Skill Development",
      "Flag Football Skill Development",
      "Footbag Skill Development",
      "Sports Biomechanics",
      "Injury Prevention",
    ],
    founder: [
      {
        "@type": "Person",
        name: "James Scott",
        jobTitle: "Co-Founder & Head of Performance",
        description:
          "Performance specialist training NBA players and youth athletes for nearly two decades.",
      },
    ],
    employee: [
      {
        "@type": "Person",
        name: "Adam Harrington",
        jobTitle: "Global Head of Basketball",
        description:
          "NBA/WNBA Skills Coach. Personal trainer to Kevin Durant. Authority on elite shooting mechanics.",
      },
    ],
    publishingPrinciples: "https://youthperformance.com/editorial-policy",
    sameAs: [
      "https://instagram.com/youthperformance",
      "https://twitter.com/youthperformance",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default FooterSchema;
