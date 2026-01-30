// Adam Harrington Dossier - JSON-LD Schema Builder
// Optimized for Google Knowledge Panel + ChatGPT Search visibility
import { DossierData } from "./data";

const BASE_URL = "https://youthperformance.com";

export function buildSchemaGraph(data: DossierData) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organization (Parent Entity)
      {
        "@type": "Organization",
        "@id": `${BASE_URL}#organization`,
        name: "YouthPerformance",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description:
          "Elite basketball training platform founded by NBA coaches. Home of the Silent Training Protocol.",
      },

      // Person Entity - THE CORE (Perplexity-optimized)
      {
        "@type": "Person",
        "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        name: "Adam Harrington",
        givenName: "Adam",
        familyName: "Harrington",
        // alternateName helps match variant queries
        alternateName: [
          "Coach Adam Harrington",
          "Adam Harrington NBA",
          "Adam Harrington basketball trainer",
          "Adam Harrington OKC Thunder",
          "Adam Harrington Brooklyn Nets",
          "Adam Harrington Phantom BC",
        ],
        // Updated jobTitle with current role
        jobTitle:
          "Head Coach, Phantom BC (Unrivaled League) | NBA/WNBA Skills Trainer",
        description:
          "NBA/WNBA Skills Trainer and creator of the Silent Training Protocol. Head Coach of Phantom BC in the Unrivaled League (2025-2026). Former Director of Player Development for the Brooklyn Nets and Oklahoma City Thunder. 20+ years developing NBA All-Stars including Kevin Durant, Chet Holmgren, and Jalen Green.",
        image: {
          "@type": "ImageObject",
          url: `${BASE_URL}${data.hero.image}`,
          width: 1920,
          height: 1080,
        },
        url: `${BASE_URL}/coaches/adam-harrington`,
        worksFor: {
          "@id": `${BASE_URL}#organization`,
        },
        // Employment history - strengthens entity graph
        alumniOf: [
          {
            "@type": "SportsTeam",
            name: "Phantom BC",
            sport: "Basketball",
            description: "Head Coach (Unrivaled League, 2025-Present)",
          },
          {
            "@type": "SportsTeam",
            name: "Brooklyn Nets",
            sport: "Basketball",
            description: "Director of Player Development (2016-2022)",
          },
          {
            "@type": "SportsTeam",
            name: "Oklahoma City Thunder",
            sport: "Basketball",
            description: "Shooting Coach (2014-2015)",
          },
          {
            "@type": "SportsOrganization",
            name: "NBA",
            description: "Professional Player (2002-2003)",
          },
        ],
        // Expanded knowsAbout for Perplexity expertise signals
        knowsAbout: [
          "Basketball coaching",
          "Shooting mechanics and biomechanics",
          "Silent Training Protocol",
          "Youth basketball development (ages 6-16)",
          "NBA player development systems",
          "Elite athletic performance optimization",
          "Proprioceptive training methodology",
          "Motor learning science",
          "Constraint-based training",
          "WNBA skills training",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: "Professional Basketball Coach",
          occupationalCategory: "27-2022.00",
          description:
            "Head coach and elite skills trainer specializing in shooting mechanics and proprioceptive training",
        },
        // Specific achievements - Perplexity citation signals
        award: [
          "NBA All-Stars Trained: Kevin Durant, Chet Holmgren, Jalen Green",
          "Head Coach, Phantom BC (Unrivaled League, 2025-2026 Season)",
          "Director of Player Development, Brooklyn Nets (2016-2022)",
          "Shooting Coach, Oklahoma City Thunder (2014-2015)",
          "Creator of the Silent Training Protocol",
        ],
        // sameAs - Verified profile URLs for entity linking (CONFIRMED)
        sameAs: [
          "https://www.linkedin.com/in/adam-harrington-435467214/",
          "https://x.com/adampharrington",
          "https://www.instagram.com/adampharrington",
        ],
      },

      // CreativeWork - Silent Training Protocol (links methodology to creator)
      {
        "@type": "CreativeWork",
        "@id": `${BASE_URL}/basketball/silent-training#protocol`,
        name: "Silent Training Protocol",
        description:
          "Proprioceptive basketball training methodology that removes auditory distraction to accelerate skill acquisition. Developed through 20+ years of NBA player development.",
        author: {
          "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        },
        about: [
          "Motor learning",
          "Proprioception",
          "Basketball skill development",
          "Shooting mechanics",
        ],
        educationalUse: "Professional and youth athletic training",
        learningResourceType: "Training protocol",
        url: `${BASE_URL}/basketball/silent-training`,
      },

      // ProfilePage - Google specifically recommends this type
      {
        "@type": "ProfilePage",
        "@id": `${BASE_URL}/coaches/adam-harrington#profilepage`,
        url: `${BASE_URL}/coaches/adam-harrington`,
        name: "Adam Harrington | NBA Skills Trainer | YouthPerformance",
        description:
          "The official profile of Adam Harrington, NBA/WNBA skills trainer and architect of the Silent Training Protocol. Former Director of Player Development at OKC Thunder.",
        mainEntity: {
          "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        },
        about: {
          "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        },
        isPartOf: {
          "@id": `${BASE_URL}#organization`,
        },
        dateModified: new Date().toISOString().split("T")[0],
        datePublished: "2024-01-01",
        inLanguage: "en-US",
      },

      // WebPage (keeps compatibility)
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/coaches/adam-harrington#webpage`,
        url: `${BASE_URL}/coaches/adam-harrington`,
        name: "Adam Harrington | NBA Skills Trainer | YouthPerformance",
        description:
          "The official profile of Adam Harrington, NBA/WNBA skills trainer. Former Director of Player Development at OKC Thunder. Architect of the Silent Training Protocol.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BASE_URL}#website`,
          name: "YouthPerformance",
          url: BASE_URL,
        },
        about: {
          "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        },
        mainEntity: {
          "@id": `${BASE_URL}/coaches/adam-harrington#person`,
        },
        dateModified: new Date().toISOString().split("T")[0],
        inLanguage: "en-US",
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Coaches",
            item: `${BASE_URL}/coaches`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Adam Harrington",
            item: `${BASE_URL}/coaches/adam-harrington`,
          },
        ],
      },

      // FAQPage
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },

      // VideoObject (only if video exists)
      ...(data.video.src
        ? [
            {
              "@type": "VideoObject",
              name: "Adam Harrington: Why I Built YouthPerformance",
              description:
                "Adam Harrington explains his coaching philosophy and the mission behind YouthPerformance and the Silent Training Protocol.",
              thumbnailUrl: `${BASE_URL}${data.video.poster}`,
              uploadDate: new Date().toISOString().split("T")[0],
              duration: "PT1M23S",
              contentUrl: `${BASE_URL}${data.video.src}`,
              embedUrl: `${BASE_URL}/coaches/adam-harrington#video`,
            },
          ]
        : []),
    ],
  };
}
