// ═══════════════════════════════════════════════════════════
// BULLETPROOF ANKLES TEASER MODULE
// Free lead magnet → Barefoot Reset Challenge ($88)
// ═══════════════════════════════════════════════════════════

import type { LearningSection, TeaserModule } from "../types";

// ─────────────────────────────────────────────────────────────
// SECTION 0: THE PROOF (L1 - 5 cards)
// Hook with real results
// ─────────────────────────────────────────────────────────────

const section0Proof: LearningSection = {
  id: "teaser-s0-proof",
  order: 0,
  title: "The Proof",
  level: 1,
  unlockThreshold: 0,
  cards: [
    {
      id: "t-s0-l1",
      sectionId: "teaser-s0-proof",
      order: 0,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE PROOF",
          body: "My son Dominic rolled his ankle mid-game.\n\nWe watched the replay: a nasty twist that usually means crutches.\n\nBut here's what actually happened:\n\n→ He didn't limp\n→ He didn't ask out\n→ He finished the game\n→ Zero pain\n\nHow? Keep swiping.",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/ankle-roll-moment.jpg",
          caption: "The moment of impact",
        },
        parent: {
          headline: "CLINICAL EVIDENCE",
          body: "During competition, my son Dominic experienced a severe lateral ankle inversion—the mechanism typically associated with Grade II ligament sprains and 4-6 week recovery timelines.\n\nThe outcome defied conventional expectations:\n\n• Zero inflammatory response\n• Immediate return to play\n• No post-game symptoms\n• Full practice the following day\n\nThis wasn't luck. It was preparation.",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/ankle-roll-moment.jpg",
          caption: "Lateral inversion event during competition",
        },
      },
    },
    {
      id: "t-s0-l2",
      sectionId: "teaser-s0-proof",
      order: 1,
      type: "Lesson",
      content: {
        athlete: {
          headline: "NOT JUST HIM",
          body: 'After Dominic, I started tracking.\n\n5 different athletes.\nSame story every time:\n\n"I rolled it... braced for pain... and felt nothing."\n\nNo swelling.\nNo limp.\nBack to playing immediately.\n\nThis kept happening. That\'s when I knew we were onto something real.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "PATTERN RECOGNITION",
          body: "Following this initial case, I began systematic documentation across my athlete population.\n\nWithin months, five separate athletes reported identical experiences:\n\n• Inversion mechanism occurred\n• Anticipated pain response\n• Actual outcome: asymptomatic\n\nThe consistency of these outcomes suggested a reproducible adaptation pattern, not statistical anomaly.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s0-l3",
      sectionId: "teaser-s0-proof",
      order: 2,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THIS ISN'T LUCK",
          body: 'Some people will say "good genes" or "lucky."\n\nNope.\n\nWe didn\'t reduce injury risk.\n\nWe ENGINEERED bulletproof ankles.\n\nThere\'s a system. It works. And you\'re about to learn it.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "ENGINEERED OUTCOMES",
          body: "The temptation is to attribute these results to genetic factors or chance.\n\nThe evidence suggests otherwise.\n\nThrough systematic tissue preparation—applying principles from sports science and rehabilitation research—we have developed a protocol that consistently produces more resilient ankle structures.\n\nThis module explains the mechanism and the method.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s0-l4",
      sectionId: "teaser-s0-proof",
      order: 3,
      type: "Lesson",
      content: {
        athlete: {
          headline: "WHAT YOU'LL LEARN",
          body: "In the next few minutes, you'll discover:\n\n→ Why ankle injuries are getting WORSE (not better)\n→ The hidden problem with braces and tape\n→ How your body builds armor\n→ The 3-step system we use\n\nThis is free. No catch.\n\nLet's go.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "MODULE OVERVIEW",
          body: "This educational module covers:\n\n• The protection paradox: why conventional interventions fail\n• The Glass Cannon phenomenon in youth athletes\n• Davis's Law and tissue adaptation principles\n• The R3 Protocol framework\n\nEstimated completion: 8-10 minutes\n\nNo purchase required—this knowledge is foundational.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s0-c1",
      sectionId: "teaser-s0-proof",
      order: 4,
      type: "Check",
      content: {
        athlete: {
          headline: "QUICK CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "COMPREHENSION CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      question: {
        athlete: "What happened after Dominic rolled his ankle?",
        parent: "What was the outcome following Dominic's lateral ankle inversion?",
      },
      options: [
        {
          id: "a",
          text: {
            athlete: "He sat out the rest of the game",
            parent: "He was removed from competition for evaluation",
          },
          isCorrect: false,
          feedback: {
            athlete: "Nope! He stayed in and kept playing.",
            parent: "Incorrect. He remained in competition without intervention.",
          },
        },
        {
          id: "b",
          text: {
            athlete: "He finished the game pain-free",
            parent: "He completed the game without symptoms",
          },
          isCorrect: true,
          feedback: {
            athlete: "That's it. Bulletproof in action.",
            parent:
              "Correct. This outcome demonstrates the potential of proactive tissue preparation.",
          },
        },
        {
          id: "c",
          text: {
            athlete: "He needed to get taped up",
            parent: "He required external stabilization to continue",
          },
          isCorrect: false,
          feedback: {
            athlete: "No tape needed. His ankles ARE the support.",
            parent: "Incorrect. No external support was required.",
          },
        },
        {
          id: "d",
          text: {
            athlete: "He was out for two weeks",
            parent: "He required a standard 2-week recovery protocol",
          },
          isCorrect: false,
          feedback: {
            athlete: "Zero time missed. That's the whole point.",
            parent: "Incorrect. No recovery time was needed.",
          },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: "Think about what makes this story surprising...",
        parent: "Consider what distinguished this outcome from typical inversion injuries...",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 1: THE GLASS CANNON (L1 - 6 cards)
// Protection paradox, sensory amnesia
// ─────────────────────────────────────────────────────────────

const section1GlassCannon: LearningSection = {
  id: "teaser-s1-glasscannon",
  order: 1,
  title: "The Glass Cannon",
  level: 1,
  unlockThreshold: 1,
  cards: [
    {
      id: "t-s1-l1",
      sectionId: "teaser-s1-glasscannon",
      order: 0,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE LIE THEY SOLD YOU",
          body: 'For years, everyone said:\n\n→ Wear high-tops\n→ Tape your ankles\n→ Get more cushion\n→ Use a brace\n\nThey promised protection.\n\nBut here\'s the truth: ankle injuries went UP by 60%.\n\nMore "protection" = more injuries.\n\nWeird, right?',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "THE PROTECTION PARADOX",
          body: "For decades, the sports medicine consensus emphasized external support:\n\n• High-top footwear for ankle stability\n• Prophylactic taping protocols\n• Cushioned midsoles for impact absorption\n• Rigid bracing for high-risk athletes\n\nDespite these interventions, lower extremity injuries have increased by over 60% in modern sport.\n\nThe conventional wisdom has failed.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s1-l2",
      sectionId: "teaser-s1-glasscannon",
      order: 1,
      type: "Lesson",
      content: {
        athlete: {
          headline: "SUPPORT KILLS STRENGTH",
          body: "Here's what they don't tell you:\n\nSupport helps bridges.\nSupport WEAKENS living tissue.\n\nYour body is smart. When something does the work for you, your body stops trying.\n\nBrace your ankle? Your ligaments get lazy.\nWear thick cushion? Your foot forgets how to feel.\n\nThe \"help\" is actually hurting you.",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/bridge-vs-tissue.jpg",
          caption: "Bridges need support. You don't.",
        },
        parent: {
          headline: "THE COST OF EXTERNAL SUPPORT",
          body: "There's a fundamental distinction between mechanical structures and biological tissue:\n\n• Bridges benefit from external reinforcement\n• Living tissue weakens when load is removed\n\nThis is the principle of mechanotransduction: biological structures adapt to the demands placed upon them.\n\nWhen external devices absorb forces meant for ligaments and tendons, those structures atrophy. The support becomes a dependency.",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/bridge-vs-tissue.jpg",
          caption: "Mechanical vs. biological structures",
        },
      },
    },
    {
      id: "t-s1-l3",
      sectionId: "teaser-s1-glasscannon",
      order: 2,
      type: "Lesson",
      content: {
        athlete: {
          headline: "YOUR BRAIN FORGETS YOUR FEET",
          body: "Your foot has 200,000+ sensors.\n\nThey tell your brain exactly what's happening with the ground.\n\nBut when you wrap your foot in foam and plastic?\n\nSilence.\n\nYour brain can't protect what it can't feel.\n\nThis is called \"sensory amnesia\" — your brain literally forgets your feet exist.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "SENSORY AMNESIA",
          body: 'The human foot contains approximately 200,000 exteroceptors—sensory nerve endings that provide real-time feedback about ground contact, pressure distribution, and joint position.\n\nThis proprioceptive input enables feed-forward motor control: the brain anticipates perturbations and pre-activates stabilizing musculature.\n\nCushioned footwear and rigid bracing effectively "mute" this sensory channel, compromising the neuromuscular system\'s ability to respond to unexpected forces.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s1-l4",
      sectionId: "teaser-s1-glasscannon",
      order: 3,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE GLASS CANNON",
          body: 'So what do we end up with?\n\nAthletes with:\n→ Powerful legs\n→ Explosive hips\n→ Strong quads\n\nMounted on:\n→ Weak ankles\n→ Stiff feet\n→ Zero foundation\n\nWe call this the "Glass Cannon."\n\nBig engine. Fragile base. Recipe for disaster.',
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/glass-cannon.jpg",
          caption: "Strong up top, fragile at the foundation",
        },
        parent: {
          headline: "THE GLASS CANNON PHENOMENON",
          body: 'Modern athletic development creates a dangerous imbalance:\n\nUpper kinetic chain: Highly developed through progressive resistance training\n\nLower kinetic chain (distal): Underdeveloped due to chronic external support\n\nThe result is the "Glass Cannon" athlete: powerful force generation capacity mounted on an unstable, injury-prone foundation.\n\nThis architectural vulnerability explains the paradox of increasing injuries despite advancing "protective" technology.',
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/glass-cannon.jpg",
          caption: "The Glass Cannon architecture",
        },
      },
    },
    {
      id: "t-s1-l5",
      sectionId: "teaser-s1-glasscannon",
      order: 4,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE HIDDEN COST",
          body: 'Every rolled ankle costs more than time.\n\nIt costs:\n→ Confidence (hesitation on cuts)\n→ Development (missed practice)\n→ Long-term health (repeat injuries)\n\nAnd the worst part?\n\nMost kids accept it as normal.\n\n"Everyone gets hurt."\n\nNo. Not if you train smart.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "CUMULATIVE IMPACT",
          body: "The true cost of ankle instability extends beyond acute injury:\n\n• Psychological: Movement hesitation, fear of re-injury\n• Developmental: Training time lost during recovery\n• Chronic: Each sprain increases future injury probability by 40-70%\n\nThis normalization of injury represents a failure of conventional training approaches.\n\nIt is not inevitable. It is preventable.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s1-c1",
      sectionId: "teaser-s1-glasscannon",
      order: 5,
      type: "Check",
      content: {
        athlete: {
          headline: "QUICK CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "COMPREHENSION CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      question: {
        athlete: "Despite better shoes and braces, ankle injuries have:",
        parent: "Despite advances in protective equipment, lower extremity injury rates have:",
      },
      options: [
        {
          id: "a",
          text: { athlete: "Gone down a lot", parent: "Decreased significantly" },
          isCorrect: false,
          feedback: {
            athlete: "That's what you'd expect, but it's the opposite.",
            parent: "This would be the expected outcome, but data shows otherwise.",
          },
        },
        {
          id: "b",
          text: { athlete: "Stayed about the same", parent: "Remained relatively stable" },
          isCorrect: false,
          feedback: {
            athlete: "Nope. The numbers changed — in the wrong direction.",
            parent: "Incorrect. Significant changes have occurred.",
          },
        },
        {
          id: "c",
          text: { athlete: "Gone UP by 60%", parent: "Increased by over 60%" },
          isCorrect: true,
          feedback: {
            athlete: 'Exactly. More "protection" = more injuries. That\'s the paradox.',
            parent:
              "Correct. This counterintuitive finding is central to understanding the problem.",
          },
        },
        {
          id: "d",
          text: {
            athlete: "Only affected pro athletes",
            parent: "Affected only elite populations",
          },
          isCorrect: false,
          feedback: {
            athlete: "This affects everyone — youth athletes especially.",
            parent: "Incorrect. This pattern is observed across all competitive levels.",
          },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: "Think about the paradox we talked about...",
        parent: "Recall the protection paradox discussed earlier...",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 2: THE SCIENCE (L2 - 7 cards)
// Davis's Law, springs vs pistons, angle specificity
// ─────────────────────────────────────────────────────────────

const section2Science: LearningSection = {
  id: "teaser-s2-science",
  order: 2,
  title: "The Science",
  level: 2,
  unlockThreshold: 2,
  cards: [
    {
      id: "t-s2-l1",
      sectionId: "teaser-s2-science",
      order: 0,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE RULE: DAVIS'S LAW",
          body: "Here's the science in one sentence:\n\nYour body builds what you stress.\n\nWant stronger ligaments? You have to load them.\nWant tougher tendons? You have to challenge them.\n\nStrength isn't wished for.\nIt's FORCED through training.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "DAVIS'S LAW",
          body: 'The biological principle underlying BPA is Davis\'s Law:\n\n"Soft tissue remodels itself along the lines of imposed demand."\n\nThis means connective tissue—ligaments, tendons, fascia—adapts specifically to the stresses placed upon it. Collagen fibers align and thicken in response to mechanical load.\n\nImplication: If you want ankle structures capable of surviving violent inversion forces, you must expose them to controlled stress before competition.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s2-l2",
      sectionId: "teaser-s2-science",
      order: 1,
      type: "Lesson",
      content: {
        athlete: {
          headline: "PISTONS VS. SPRINGS",
          body: "Most training builds pistons:\n→ Muscles that grind\n→ Burn fuel\n→ Break down\n\nBPA builds springs:\n→ Absorb force\n→ Store energy\n→ Snap back instantly\n\nPistons wear out.\nSprings bounce back.\n\nWhich do you want?",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/piston-vs-spring.jpg",
          caption: "Pistons grind. Springs bounce.",
        },
        parent: {
          headline: "CONTRACTILE VS. ELASTIC TISSUE",
          body: "Traditional strength training emphasizes contractile tissue—muscle fibers that generate force through metabolic processes.\n\nBPA emphasizes elastic tissue—tendons and ligaments that store and release mechanical energy through deformation.\n\nContractile tissue (pistons):\n• Active force production\n• Metabolic cost\n• Fatigue-dependent\n\nElastic tissue (springs):\n• Passive force absorption\n• Energy-efficient\n• Fatigue-resistant",
          mediaType: "image",
          mediaUrl: "/images/modules/bpa/piston-vs-spring.jpg",
          caption: "Contractile vs. elastic tissue function",
        },
      },
    },
    {
      id: "t-s2-l3",
      sectionId: "teaser-s2-science",
      order: 2,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE RUBBER BAND ANKLE",
          body: "When a BPA-trained athlete rolls an ankle:\n\nThe tissue stretches under load...\nAbsorbs the force...\nAnd SNAPS BACK to position.\n\nLike a thick rubber band.\nNot a piece of string.\n\nString breaks. Rubber bands bounce back.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "ELASTIC RECOIL MECHANISM",
          body: "In a BPA-conditioned ankle, the lateral ligament complex behaves as a viscoelastic structure:\n\n1. Force application causes controlled deformation\n2. Energy is stored in the tissue matrix\n3. Elastic recoil returns the joint to neutral position\n4. No plastic (permanent) deformation occurs\n\nThis is analogous to a high-tensile rubber band versus an inelastic cord—both can stretch, but only one returns to its original state.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s2-l4",
      sectionId: "teaser-s2-science",
      order: 3,
      type: "Lesson",
      content: {
        athlete: {
          headline: "TRAIN THE DANGER ZONE",
          body: "Here's the secret:\n\nMost people AVOID the positions where injuries happen.\n\nWe do the opposite.\n\nWe find the danger zone...\nAnd we TRAIN IT.\n\nWhy? Because when you stress tissue at scary angles, your body builds strength RIGHT THERE.\n\nThe danger zone becomes your strength zone.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "POSITION-SPECIFIC ADAPTATION",
          body: 'A counterintuitive principle of tissue remodeling: adaptation is angle-specific.\n\nCollagen fibers are laid down along the exact vectors of mechanical stress. Training at neutral angles produces strength at neutral angles—but leaves vulnerable positions unfortified.\n\nBy applying controlled resistance in the inversion position (the "roll" angle), we signal the body to reinforce precisely where injuries occur.\n\nThe danger zone becomes the strength zone.',
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s2-l5",
      sectionId: "teaser-s2-science",
      order: 4,
      type: "Lesson",
      content: {
        athlete: {
          headline: "ISOMETRICS: THE SECRET WEAPON",
          body: "So how do we safely train dangerous angles?\n\nIsometrics.\n\nYou push HARD...\nBut nothing actually moves.\n\nAll the force.\nNone of the risk.\n\nThis is how we build armor without getting hurt.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "ISOMETRIC LOADING",
          body: "Isometric contractions—force generation without joint movement—provide an ideal training modality for connective tissue remodeling:\n\n• High force production is achievable\n• Joint position can be precisely controlled\n• End-range loading is safe (no acceleration through vulnerable positions)\n• Minimal equipment required\n\nThis makes isometrics the preferred method for strengthening tissue at specific angles.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s2-c1",
      sectionId: "teaser-s2-science",
      order: 5,
      type: "Check",
      content: {
        athlete: {
          headline: "QUICK CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "COMPREHENSION CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      question: {
        athlete: "Davis's Law says your body:",
        parent: "Davis's Law states that soft tissue:",
      },
      options: [
        {
          id: "a",
          text: {
            athlete: "Gets weaker with age no matter what",
            parent: "Inevitably degrades with chronological aging",
          },
          isCorrect: false,
          feedback: {
            athlete: "Nope. You have more control than that.",
            parent: "Incorrect. Tissue adaptation responds to mechanical signals, not just age.",
          },
        },
        {
          id: "b",
          text: {
            athlete: "Builds what you stress",
            parent: "Remodels along lines of imposed demand",
          },
          isCorrect: true,
          feedback: {
            athlete: "Exactly. Stress it = strengthen it. That's the whole game.",
            parent: "Correct. This principle is the biological foundation of the BPA protocol.",
          },
        },
        {
          id: "c",
          text: {
            athlete: "Needs rest more than training",
            parent: "Requires passive recovery over active loading",
          },
          isCorrect: false,
          feedback: {
            athlete: "Rest is part of it, but load drives adaptation.",
            parent:
              "Incorrect. While recovery is necessary, mechanical load drives tissue remodeling.",
          },
        },
        {
          id: "d",
          text: {
            athlete: "Is mostly genetic",
            parent: "Is primarily determined by genetic factors",
          },
          isCorrect: false,
          feedback: {
            athlete: "Genetics matter, but training matters more for this.",
            parent:
              "Incorrect. While genetics influence baseline, tissue adaptation is highly trainable.",
          },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: "Stress → strength",
        parent: "Consider the relationship between mechanical demand and tissue response...",
      },
    },
    {
      id: "t-s2-c2",
      sectionId: "teaser-s2-science",
      order: 6,
      type: "Check",
      content: {
        athlete: {
          headline: "QUICK CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "COMPREHENSION CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      question: {
        athlete: "BPA trains your ankle to act like:",
        parent: "The BPA protocol conditions ankle tissue to function as:",
      },
      options: [
        {
          id: "a",
          text: { athlete: "A piston", parent: "A contractile force generator" },
          isCorrect: false,
          feedback: {
            athlete: "Pistons grind and break down. We want bounce.",
            parent: "Incorrect. Contractile tissue is metabolically costly and fatigue-dependent.",
          },
        },
        {
          id: "b",
          text: { athlete: "A spring", parent: "An elastic energy storage system" },
          isCorrect: true,
          feedback: {
            athlete: "Yes! Absorb force, snap back. That's bulletproof.",
            parent: "Correct. Elastic tissue absorbs and returns energy without structural damage.",
          },
        },
        {
          id: "c",
          text: { athlete: "A rock", parent: "A rigid, immobile structure" },
          isCorrect: false,
          feedback: {
            athlete: "Rocks are stiff but they crack. We want flexible strength.",
            parent: "Incorrect. Rigidity creates brittleness, not resilience.",
          },
        },
        {
          id: "d",
          text: { athlete: "A muscle", parent: "A muscular contractile unit" },
          isCorrect: false,
          feedback: {
            athlete: "Muscles are important, but this is about connective tissue.",
            parent: "Incorrect. BPA targets connective tissue, not contractile tissue.",
          },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: "What bounces back?",
        parent: "Consider which structure stores and returns energy...",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 3: THE SOLUTION TEASE (L2 - 5 cards)
// R3 overview + conversion CTA
// ─────────────────────────────────────────────────────────────

const section3Solution: LearningSection = {
  id: "teaser-s3-solution",
  order: 3,
  title: "The Solution",
  level: 2,
  unlockThreshold: 4,
  cards: [
    {
      id: "t-s3-l1",
      sectionId: "teaser-s3-solution",
      order: 0,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE R3 FRAMEWORK",
          body: "Now you know WHY ankles break.\n\nHere's HOW we fix them.\n\nThe R3 System:\n\n1. RELEASE — Wake up your feet\n2. RESTORE — Build the armor\n3. RE-ENGINEER — Add the bounce\n\nThree phases. In order. That's the whole system.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "THE R3 PROTOCOL",
          body: "The BPA system follows a structured, three-phase progression known as R3:\n\n1. RELEASE — Sensory re-awakening and tissue preparation\n2. RESTORE — Structural loading and collagen remodeling\n3. RE-ENGINEER — Integration into dynamic movement patterns\n\nEach phase builds on the previous, creating a coherent developmental pathway from vulnerable to resilient.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s3-l2",
      sectionId: "teaser-s3-solution",
      order: 1,
      type: "Lesson",
      content: {
        athlete: {
          headline: "WHAT'S IN EACH PHASE",
          body: "RELEASE: Turn your foot sensors back on. Feel the ground again.\n\nRESTORE: Load the tissue at dangerous angles. Build the spring.\n\nRE-ENGINEER: Connect everything to real movement. Train like you play.\n\n42 days. 15 minutes daily.\n\nThat's all it takes.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "PHASE BREAKDOWN",
          body: "RELEASE (Days 1-14):\n• Barefoot exposure protocols\n• Texture differentiation drills\n• Proprioceptive activation\n\nRESTORE (Days 15-28):\n• Progressive isometric loading\n• Angle-specific strengthening\n• Tissue remodeling stimulus\n\nRE-ENGINEER (Days 29-42):\n• Dynamic integration\n• Sport-specific transfer\n• Reactive stabilization\n\nTotal commitment: ~15 minutes per day.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s3-l3",
      sectionId: "teaser-s3-solution",
      order: 2,
      type: "Lesson",
      content: {
        athlete: {
          headline: "THE RESULT",
          body: "After 42 days:\n\n✓ Ankles that bounce, not break\n✓ Confidence in every cut\n✓ No more fear of landing\n✓ Zero missed games\n\nThis isn't theory.\n\nThis is what happened with Dominic.\nThis is what happens with every athlete who follows the system.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "EXPECTED OUTCOMES",
          body: "Athletes who complete the 42-day R3 protocol demonstrate:\n\n• Reduced incidence of lateral ankle sprains\n• Decreased severity when sprains do occur\n• Faster return-to-play timelines\n• Improved subjective confidence in cutting/landing\n• Enhanced proprioceptive acuity\n\nThese outcomes are reproducible and consistent with the underlying biomechanical principles.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: "t-s3-c1",
      sectionId: "teaser-s3-solution",
      order: 3,
      type: "Check",
      content: {
        athlete: {
          headline: "FINAL CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "FINAL CHECK",
          body: null,
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      question: {
        athlete: "The three phases of the R3 Framework are:",
        parent: "The R3 Protocol consists of which three phases?",
      },
      options: [
        {
          id: "a",
          text: {
            athlete: "Run, Rest, Repeat",
            parent: "Running, Resting, Repeating",
          },
          isCorrect: false,
          feedback: {
            athlete: "Not quite — think about what each R stands for.",
            parent: "Incorrect. Review the R3 framework structure.",
          },
        },
        {
          id: "b",
          text: {
            athlete: "Release, Restore, Re-Engineer",
            parent: "Release, Restore, Re-Engineer",
          },
          isCorrect: true,
          feedback: {
            athlete: "Perfect! Wake up → Build armor → Add bounce. You've got it.",
            parent: "Correct. This three-phase progression forms the core of the BPA protocol.",
          },
        },
        {
          id: "c",
          text: {
            athlete: "Resist, Recover, Return",
            parent: "Resistance, Recovery, Return",
          },
          isCorrect: false,
          feedback: {
            athlete: "Close, but those aren't the three R's we use.",
            parent: "Incorrect. These terms are not part of the R3 framework.",
          },
        },
        {
          id: "d",
          text: {
            athlete: "Relax, Rehabilitate, Restart",
            parent: "Relaxation, Rehabilitation, Restart",
          },
          isCorrect: false,
          feedback: {
            athlete: "Remember — this isn't rehab. It's building armor BEFORE injury.",
            parent: "Incorrect. BPA is proactive (prehabilitation), not reactive (rehabilitation).",
          },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: "Release... Restore... and?",
        parent: "The final phase focuses on dynamic integration...",
      },
    },
    {
      id: "t-s3-completion",
      sectionId: "teaser-s3-solution",
      order: 4,
      type: "Completion",
      content: {
        athlete: {
          headline: "YOU DID IT!",
          body: "You now understand:\n\n✓ Why ankle injuries keep happening\n✓ The Glass Cannon problem\n✓ How your body builds armor\n✓ The R3 Framework\n\nKnowledge is step one.\n\nNow it's time to DO THE WORK.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: "MODULE COMPLETE",
          body: "You have completed the foundational education for the Bulletproof Ankles system.\n\nConcepts covered:\n• Protection paradox\n• Glass Cannon phenomenon\n• Davis's Law and tissue adaptation\n• R3 Protocol overview\n\nNext step: practical application through the full 42-day challenge.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      unlockedContent: [], // Handled by conversion config instead
      completionBadge: {
        id: "ankle-intel",
        name: "Ankle Intel",
        icon: "🧠",
        description: "Completed the BPA foundations course",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// FULL TEASER MODULE EXPORT
// ─────────────────────────────────────────────────────────────

export const bpaTeaser: TeaserModule = {
  id: "bpa-teaser-v1",
  slug: "bulletproof-ankles-teaser",
  title: "Bulletproof Ankles",
  subtitle: "Free Foundations Course",
  shortDescription:
    "Learn why ankle injuries keep happening — and the science behind preventing them.",
  longDescription:
    "This free module teaches you the science behind bulletproof ankles. You'll understand the Glass Cannon problem, Davis's Law, and the R3 Protocol framework. No fluff, no upsell walls — just the knowledge you need to understand WHY before learning HOW.",
  sport: "Barefoot",
  author: "James Scott",
  reviewedBy: "James Scott",
  estimatedMinutes: 10,
  maxXp: 150,
  maxShards: 2,
  thumbnailUrl: "/images/modules/bpa-teaser-thumb.jpg",
  heroVideoUrl: null,
  prerequisites: [],
  unlocksContent: [], // Handled by conversion
  sections: [section0Proof, section1GlassCannon, section2Science, section3Solution],
  seo: {
    title: "Bulletproof Ankles: Free Youth Ankle Training Course | YP Academy",
    description:
      "Learn the science behind preventing ankle injuries in young athletes. Free 10-minute course covering the Glass Cannon problem, Davis's Law, and the R3 Protocol framework.",
    pillarSlug: "/barefoot-training/",
    clusterSlug: "/barefoot-training/ankle-stability/",
    keywords: [
      "youth ankle stability",
      "free ankle training course",
      "prevent ankle sprains",
      "youth sports injury prevention",
      "ankle strength exercises kids",
    ],
  },
  analytics: {
    expectedCompletionRate: 0.75,
    targetAccuracyRange: [0.7, 0.9],
    avgTimePerCard: 25,
    dropoffWarningThreshold: 0.2,
  },
  createdAt: "2026-01-08T00:00:00Z",
  updatedAt: "2026-01-08T00:00:00Z",

  // ─────────────────────────────────────────────────────────────
  // TEASER-SPECIFIC FIELDS
  // ─────────────────────────────────────────────────────────────

  isTeaser: true,

  conversion: {
    productSlug: "barefoot-reset-42",
    productName: "Barefoot Reset Challenge",
    price: 8800, // $88
    originalPrice: 12900, // $129 (strikethrough)
    features: [
      "42 days of guided workouts",
      "Video demonstrations for every drill",
      "Daily progress tracking",
      "Parent dashboard & reports",
      "Lifetime access",
    ],
    headline: "Ready to bulletproof your ankles?",
    subheadline: "You learned WHY. Now learn HOW.",
  },

  emailGate: {
    enabled: true,
    rewardSlug: "bpa-drill-stack-preview",
    rewardName: "BPA Drill Stack Preview",
    ctaText: "Get Free Drill Stack",
  },

  teaserBadge: {
    id: "ankle-intel",
    name: "Ankle Intel",
    icon: "🧠",
    description: "Completed the BPA foundations course",
  },
};

// ─────────────────────────────────────────────────────────────
// REGISTRY HELPERS
// ─────────────────────────────────────────────────────────────

export function getTeaserModuleBySlug(slug: string): TeaserModule | undefined {
  if (slug === "bulletproof-ankles-teaser") {
    return bpaTeaser;
  }
  return undefined;
}
