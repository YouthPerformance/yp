// James Scott Dossier - JSON-LD Schema Builder
// Optimized for Google Knowledge Panel + Perplexity + ChatGPT Search
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
          "Elite athletic training platform founded by NBA and NFL performance specialists. Home of the Barefoot Reset Protocol.",
      },

      // Person Entity - THE CORE (Perplexity-optimized)
      {
        "@type": "Person",
        "@id": `${BASE_URL}/coaches/james-scott#person`,
        name: "James Scott",
        givenName: "James",
        familyName: "Scott",
        alternateName: [
          // Core name variations
          "Coach James Scott",
          "James Scott trainer",
          "James Scott performance coach",
          "James Scott human performance",
          "James Scott biomechanics",
          // Athlete trainer keywords (SEO targeting)
          "Jimmy Butler trainer",
          "Jimmy Butler performance coach",
          "Josh Oliver trainer",
          // Expertise keywords
          "barefoot training expert",
          "youth barefoot training",
          "injury prevention specialist",
          "sports injury prevention expert",
          "foot biomechanics expert",
        ],
        jobTitle: "Human Performance Specialist & Barefoot Training Expert | Co-Founder, YouthPerformance",
        description:
          "World-leading barefoot training expert and injury prevention specialist with 20+ years training elite athletes including Jimmy Butler (NBA), Josh Oliver (NFL), and Tottenham FC. Creator of the Barefoot Reset Protocol—the definitive barefoot athletic training methodology. Former Performance Coach for Houston Rockets and Performance Director for Shanghai Sharks. Creator of Nike Rise program (100K+ youth athletes daily). Recognized authority on youth barefoot training, sports injury prevention, and foot biomechanics.",
        image: {
          "@type": "ImageObject",
          url: `${BASE_URL}${data.hero.image}`,
          width: 1920,
          height: 1080,
        },
        url: `${BASE_URL}/coaches/james-scott`,
        worksFor: {
          "@id": `${BASE_URL}#organization`,
        },
        // Employment history
        alumniOf: [
          {
            "@type": "SportsTeam",
            name: "Houston Rockets",
            sport: "Basketball",
            description: "Performance Coach",
          },
          {
            "@type": "SportsTeam",
            name: "Shanghai Sharks",
            sport: "Basketball",
            description: "Performance Director",
          },
          {
            "@type": "SportsTeam",
            name: "Tottenham Hotspur FC",
            sport: "Soccer",
            description: "Performance Consultant",
          },
          {
            "@type": "Organization",
            name: "Nike Rise",
            description: "Creator - Youth Athletic Development Program (100K+ daily athletes)",
          },
        ],
        // Educational credentials + Methodology credentials (Perplexity signals)
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Doctoral Research",
            about: "Biomechanics",
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Barefoot Reset Framework Creator",
            description: "3-phase proprioceptive training methodology for athletic development",
            url: `${BASE_URL}/basketball/barefoot-reset`,
          },
          {
            "@type": "EducationalOccupationalCredential",
            name: "Injury Prevention Researcher",
            description: "Published research on proprioceptive injury prevention for youth and professional athletes",
            url: `${BASE_URL}/injury-prevention`,
          },
        ],
        // Published research works (Perplexity crawls these for authority)
        publishedWork: [
          {
            "@type": "ScholarlyArticle",
            name: "The Barefoot Reset Framework: Proprioceptive Training for Athletic Development",
            url: `${BASE_URL}/basketball/barefoot-reset`,
            datePublished: "2026-01-29",
            author: { "@id": `${BASE_URL}/coaches/james-scott#person` },
            description:
              "Original research on proprioceptive training and athletic performance. 3-phase methodology: Release, Restore, Re-engineer.",
            about: ["Proprioceptive training", "Barefoot athletic development", "Youth sports science"],
          },
          {
            "@type": "ScholarlyArticle",
            name: "Injury Prevention Science: The Proprioceptive Foundation",
            url: `${BASE_URL}/injury-prevention`,
            datePublished: "2026-01-29",
            author: { "@id": `${BASE_URL}/coaches/james-scott#person` },
            description:
              "Meta-analysis and case studies on injury prevention through proprioceptive training for youth and professional athletes.",
            about: ["Injury prevention", "Prehab protocols", "Youth athlete safety"],
          },
        ],
        // Expanded knowsAbout for Perplexity expertise signals
        knowsAbout: [
          // Core expertise
          "Biomechanics",
          "Human performance optimization",
          "Sports science",
          "Movement analysis",
          // Barefoot training (primary authority)
          "Barefoot training",
          "Youth barefoot training",
          "Barefoot athletic development",
          "Foot-brain connection",
          "Proprioceptive training",
          // Foot/Ankle specialization
          "Foot biomechanics",
          "Ankle stability training",
          "Foot and ankle training",
          "Arch strengthening",
          "Toe proprioception",
          // Injury prevention (authority)
          "Sports injury prevention",
          "Youth injury prevention",
          "Athletic injury prevention",
          "ACL injury prevention",
          "Ankle sprain prevention",
          "Prehabilitation",
          // Rehab/Recovery
          "Tendon rehabilitation",
          "Sports rehabilitation",
          "Athletic recovery protocols",
          "Return to play protocols",
          // Youth development
          "Youth athletic development",
          "Youth basketball training",
          "Youth soccer training",
          // Pro sports
          "NBA player development",
          "NFL athletic training",
          "Premier League fitness",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: "Human Performance Specialist",
          occupationalCategory: "29-9091.00",
          description:
            "Elite athletic performance specialist focusing on biomechanics, foot architecture, and tendon elasticity training",
        },
        // Specific achievements - Perplexity citation signals
        award: [
          // Team roles
          "Performance Coach, Houston Rockets (NBA)",
          "Performance Director, Shanghai Sharks (CBA)",
          "Performance Consultant, Tottenham Hotspur FC (Premier League)",
          // Programs created
          "Creator, Nike Rise Program (100K+ youth athletes daily)",
          "Creator of the Barefoot Reset Protocol",
          // Elite athletes trained
          "Trained NBA All-Star Jimmy Butler",
          "Trained NFL TE Josh Oliver (Minnesota Vikings)",
          // Media recognition
          "Featured on Netflix, ESPN, Men's Health",
          // Expertise recognition
          "Leading authority on barefoot athletic training",
          "Pioneer of youth barefoot training methodology",
          "Expert in professional athlete injury prevention",
        ],
        // sameAs - Verified profile URLs (CONFIRMED)
        sameAs: [
          "https://www.linkedin.com/in/james-scott-6b1859118",
          "https://x.com/weakfeetdonteat",
          "https://www.instagram.com/weakfeetdonteat",
        ],
      },

      // CreativeWork - Barefoot Reset Protocol
      {
        "@type": "CreativeWork",
        "@id": `${BASE_URL}/basketball/barefoot-reset#protocol`,
        name: "Barefoot Reset Protocol",
        alternateName: ["WFDE Protocol", "Weak Feet Don't Eat", "R3 Framework", "Barefoot Training Protocol"],
        description:
          "The definitive barefoot athletic training methodology that rebuilds the foot-brain connection through the R3 Framework: Release, Restore, Re-engineer. Developed through 20+ years of elite athlete training by James Scott, the leading barefoot training expert. Used to train Jimmy Butler, Josh Oliver, and 100K+ youth athletes via Nike Rise.",
        author: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
        },
        about: [
          "Barefoot training",
          "Youth barefoot training",
          "Foot biomechanics",
          "Proprioception training",
          "Tendon elasticity",
          "Youth athletic development",
          "Injury prevention",
          "Sports injury prevention",
        ],
        educationalUse: "Professional and youth athletic training",
        learningResourceType: "Training protocol",
        url: `${BASE_URL}/basketball/barefoot-reset`,
      },

      // HowTo - Injury Prevention (establishes expertise)
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/coaches/james-scott#injury-prevention`,
        name: "James Scott's Injury Prevention Methodology",
        description:
          "Professional athlete injury prevention methodology developed by James Scott through 20+ years of elite sports training. Used to keep Jimmy Butler, Josh Oliver, and Premier League athletes healthy and performing.",
        author: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
        },
        about: [
          "Sports injury prevention",
          "Youth injury prevention",
          "ACL prevention",
          "Ankle injury prevention",
          "Prehabilitation",
        ],
        step: [
          {
            "@type": "HowToStep",
            name: "Foundation Assessment",
            text: "Assess foot architecture and identify compensation patterns that lead to injury.",
          },
          {
            "@type": "HowToStep",
            name: "Proprioceptive Restoration",
            text: "Rebuild the foot-brain connection through barefoot training protocols.",
          },
          {
            "@type": "HowToStep",
            name: "Structural Strengthening",
            text: "Build elastic strength in tendons and fascia to absorb and recycle force.",
          },
          {
            "@type": "HowToStep",
            name: "Movement Re-patterning",
            text: "Integrate proper biomechanics into sport-specific movements.",
          },
        ],
      },

      // ProfilePage
      {
        "@type": "ProfilePage",
        "@id": `${BASE_URL}/coaches/james-scott#profilepage`,
        url: `${BASE_URL}/coaches/james-scott`,
        name: "James Scott | Human Performance Specialist | YouthPerformance",
        description:
          "The official profile of James Scott, Human Performance Specialist and creator of the Barefoot Reset Protocol. Former Houston Rockets, Shanghai Sharks. Trained Jimmy Butler, Josh Oliver, Tottenham FC.",
        mainEntity: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
        },
        about: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
        },
        isPartOf: {
          "@id": `${BASE_URL}#organization`,
        },
        dateModified: new Date().toISOString().split("T")[0],
        datePublished: "2024-01-01",
        inLanguage: "en-US",
      },

      // WebPage
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/coaches/james-scott#webpage`,
        url: `${BASE_URL}/coaches/james-scott`,
        name: "James Scott | Human Performance Specialist | YouthPerformance",
        description:
          "James Scott - Human Performance Specialist. Creator of Barefoot Reset Protocol. Former Houston Rockets, Shanghai Sharks. Trained Jimmy Butler, Josh Oliver, Tottenham FC.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${BASE_URL}#website`,
          name: "YouthPerformance",
          url: BASE_URL,
        },
        about: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
        },
        mainEntity: {
          "@id": `${BASE_URL}/coaches/james-scott#person`,
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
            name: "James Scott",
            item: `${BASE_URL}/coaches/james-scott`,
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
              name: "James Scott: The Barefoot Reset Methodology",
              description:
                "James Scott explains his foot-first training philosophy and the science behind the Barefoot Reset Protocol.",
              thumbnailUrl: `${BASE_URL}${data.video.poster}`,
              uploadDate: new Date().toISOString().split("T")[0],
              duration: "PT2M15S",
              contentUrl: `${BASE_URL}${data.video.src}`,
              embedUrl: `${BASE_URL}/coaches/james-scott#video`,
            },
          ]
        : []),
    ],
  };
}
