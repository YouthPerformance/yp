// ═══════════════════════════════════════════════════════════
// BULLETPROOF ANKLES (BPA) MODULE
// The Armor-Building System by James Scott
// ═══════════════════════════════════════════════════════════

import type { LearningModule, LearningSection } from '../types';

// ─────────────────────────────────────────────────────────────
// SECTION 0: THE IMPOSSIBLE RECOVERY
// ─────────────────────────────────────────────────────────────

const section0Intro: LearningSection = {
  id: 'section-0-intro',
  order: 0,
  title: 'The Impossible Recovery',
  level: 1, // L1: 35 XP, 0 shards
  unlockThreshold: 0,
  cards: [
    {
      id: 's0-l1',
      sectionId: 'section-0-intro',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE PROOF',
          body: "My son Dominic rolled his ankle mid-game.\n\nWe watched the replay: a nasty twist that usually means crutches.\n\nBut here's what actually happened:\n\n→ He didn't limp\n→ He didn't ask out\n→ He finished the game\n→ Zero pain\n\nHow? Keep swiping.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/ankle-roll-moment.jpg',
          caption: 'The moment of impact',
        },
        parent: {
          headline: 'CLINICAL EVIDENCE',
          body: "During competition, my son Dominic experienced a severe lateral ankle inversion—the mechanism typically associated with Grade II ligament sprains and 4-6 week recovery timelines.\n\nThe outcome defied conventional expectations:\n\n• Zero inflammatory response\n• Immediate return to play\n• No post-game symptoms\n• Full practice the following day\n\nThis wasn't luck. It was preparation.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/ankle-roll-moment.jpg',
          caption: 'Lateral inversion event during competition',
        },
      },
    },
    {
      id: 's0-l2',
      sectionId: 'section-0-intro',
      order: 1,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'NOT JUST HIM',
          body: "After Dominic, I started tracking.\n\n5 different athletes.\nSame story every time:\n\n\"I rolled it... braced for pain... and felt nothing.\"\n\nNo swelling.\nNo limp.\nBack to playing immediately.\n\nThis kept happening. That's when I knew we were onto something real.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'PATTERN RECOGNITION',
          body: "Following this initial case, I began systematic documentation across my athlete population.\n\nWithin months, five separate athletes reported identical experiences:\n\n• Inversion mechanism occurred\n• Anticipated pain response\n• Actual outcome: asymptomatic\n\nThe consistency of these outcomes suggested a reproducible adaptation pattern, not statistical anomaly.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's0-l3',
      sectionId: 'section-0-intro',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: "THIS ISN'T LUCK",
          body: "Some people will say \"good genes\" or \"lucky.\"\n\nNope.\n\nWe didn't reduce injury risk.\n\nWe ENGINEERED bulletproof ankles.\n\nThere's a system. It works. And you're about to learn it.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'ENGINEERED OUTCOMES',
          body: "The temptation is to attribute these results to genetic factors or chance.\n\nThe evidence suggests otherwise.\n\nThrough systematic tissue preparation—applying principles from sports science and rehabilitation research—we have developed a protocol that consistently produces more resilient ankle structures.\n\nThis module explains the mechanism and the method.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's0-c1',
      sectionId: 'section-0-intro',
      order: 3,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'What happened after Dominic rolled his ankle?',
        parent: "What was the outcome following Dominic's lateral ankle inversion?",
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'He sat out the rest of the game', parent: 'He was removed from competition for evaluation' },
          isCorrect: false,
          feedback: { athlete: 'Nope! He stayed in and kept playing.', parent: 'Incorrect. He remained in competition without intervention.' },
        },
        {
          id: 'b',
          text: { athlete: 'He finished the game pain-free', parent: 'He completed the game without symptoms' },
          isCorrect: true,
          feedback: { athlete: "That's it. Bulletproof in action.", parent: 'Correct. This outcome demonstrates the potential of proactive tissue preparation.' },
        },
        {
          id: 'c',
          text: { athlete: 'He needed to get taped up', parent: 'He required external stabilization to continue' },
          isCorrect: false,
          feedback: { athlete: 'No tape needed. His ankles ARE the support.', parent: 'Incorrect. No external support was required.' },
        },
        {
          id: 'd',
          text: { athlete: 'He was out for two weeks', parent: 'He required a standard 2-week recovery protocol' },
          isCorrect: false,
          feedback: { athlete: "Zero time missed. That's the whole point.", parent: 'Incorrect. No recovery time was needed.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Think about what makes this story surprising...',
        parent: 'Consider what distinguished this outcome from typical inversion injuries...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 1: THE GLASS CANNON PROBLEM
// ─────────────────────────────────────────────────────────────

const section1Problem: LearningSection = {
  id: 'section-1-problem',
  order: 1,
  title: 'The Glass Cannon Problem',
  level: 1, // L1 continued
  unlockThreshold: 1,
  cards: [
    {
      id: 's1-l1',
      sectionId: 'section-1-problem',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE LIE THEY SOLD YOU',
          body: "For years, everyone said:\n\n→ Wear high-tops\n→ Tape your ankles\n→ Get more cushion\n→ Use a brace\n\nThey promised protection.\n\nBut here's the truth: ankle injuries went UP by 60%.\n\nMore \"protection\" = more injuries.\n\nWeird, right?",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'THE PROTECTION PARADOX',
          body: "For decades, the sports medicine consensus emphasized external support:\n\n• High-top footwear for ankle stability\n• Prophylactic taping protocols\n• Cushioned midsoles for impact absorption\n• Rigid bracing for high-risk athletes\n\nDespite these interventions, lower extremity injuries have increased by over 60% in modern sport.\n\nThe conventional wisdom has failed.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's1-l2',
      sectionId: 'section-1-problem',
      order: 1,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'SUPPORT KILLS STRENGTH',
          body: "Here's what they don't tell you:\n\nSupport helps bridges.\nSupport WEAKENS living tissue.\n\nYour body is smart. When something does the work for you, your body stops trying.\n\nBrace your ankle? Your ligaments get lazy.\nWear thick cushion? Your foot forgets how to feel.\n\nThe \"help\" is actually hurting you.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/bridge-vs-tissue.jpg',
          caption: "Bridges need support. You don't.",
        },
        parent: {
          headline: 'THE COST OF EXTERNAL SUPPORT',
          body: "There's a fundamental distinction between mechanical structures and biological tissue:\n\n• Bridges benefit from external reinforcement\n• Living tissue weakens when load is removed\n\nThis is the principle of mechanotransduction: biological structures adapt to the demands placed upon them.\n\nWhen external devices absorb forces meant for ligaments and tendons, those structures atrophy. The support becomes a dependency.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/bridge-vs-tissue.jpg',
          caption: 'Mechanical vs. biological structures',
        },
      },
    },
    {
      id: 's1-l3',
      sectionId: 'section-1-problem',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'YOUR BRAIN FORGETS YOUR FEET',
          body: "Your foot has 200,000+ sensors.\n\nThey tell your brain exactly what's happening with the ground.\n\nBut when you wrap your foot in foam and plastic?\n\nSilence.\n\nYour brain can't protect what it can't feel.\n\nThis is called \"sensory amnesia\" — your brain literally forgets your feet exist.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'SENSORY AMNESIA',
          body: "The human foot contains approximately 200,000 exteroceptors—sensory nerve endings that provide real-time feedback about ground contact, pressure distribution, and joint position.\n\nThis proprioceptive input enables feed-forward motor control: the brain anticipates perturbations and pre-activates stabilizing musculature.\n\nCushioned footwear and rigid bracing effectively \"mute\" this sensory channel, compromising the neuromuscular system's ability to respond to unexpected forces.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's1-l4',
      sectionId: 'section-1-problem',
      order: 3,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE GLASS CANNON',
          body: "So what do we end up with?\n\nAthletes with:\n→ Powerful legs\n→ Explosive hips\n→ Strong quads\n\nMounted on:\n→ Weak ankles\n→ Stiff feet\n→ Zero foundation\n\nWe call this the \"Glass Cannon.\"\n\nBig engine. Fragile base. Recipe for disaster.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/glass-cannon.jpg',
          caption: 'Strong up top, fragile at the foundation',
        },
        parent: {
          headline: 'THE GLASS CANNON PHENOMENON',
          body: "Modern athletic development creates a dangerous imbalance:\n\nUpper kinetic chain: Highly developed through progressive resistance training\n\nLower kinetic chain (distal): Underdeveloped due to chronic external support\n\nThe result is the \"Glass Cannon\" athlete: powerful force generation capacity mounted on an unstable, injury-prone foundation.\n\nThis architectural vulnerability explains the paradox of increasing injuries despite advancing \"protective\" technology.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/glass-cannon.jpg',
          caption: 'The Glass Cannon architecture',
        },
      },
    },
    {
      id: 's1-c1',
      sectionId: 'section-1-problem',
      order: 4,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'Despite better shoes and braces, ankle injuries have:',
        parent: 'Despite advances in protective equipment, lower extremity injury rates have:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Gone down a lot', parent: 'Decreased significantly' },
          isCorrect: false,
          feedback: { athlete: "That's what you'd expect, but it's the opposite.", parent: 'This would be the expected outcome, but data shows otherwise.' },
        },
        {
          id: 'b',
          text: { athlete: 'Stayed about the same', parent: 'Remained relatively stable' },
          isCorrect: false,
          feedback: { athlete: 'Nope. The numbers changed — in the wrong direction.', parent: 'Incorrect. Significant changes have occurred.' },
        },
        {
          id: 'c',
          text: { athlete: 'Gone UP by 60%', parent: 'Increased by over 60%' },
          isCorrect: true,
          feedback: { athlete: "Exactly. More \"protection\" = more injuries. That's the paradox.", parent: 'Correct. This counterintuitive finding is central to understanding the problem.' },
        },
        {
          id: 'd',
          text: { athlete: 'Only affected pro athletes', parent: 'Affected only elite populations' },
          isCorrect: false,
          feedback: { athlete: 'This affects everyone — youth athletes especially.', parent: 'Incorrect. This pattern is observed across all competitive levels.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Think about the paradox we talked about...',
        parent: 'Recall the protection paradox discussed earlier...',
      },
    },
    {
      id: 's1-c2',
      sectionId: 'section-1-problem',
      order: 5,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'A "Glass Cannon" athlete is someone who:',
        parent: 'The "Glass Cannon" phenomenon describes an athlete who:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Is strong everywhere', parent: 'Has balanced strength throughout the kinetic chain' },
          isCorrect: false,
          feedback: { athlete: "Not quite. There's a weak spot.", parent: 'Incorrect. The defining feature is imbalance.' },
        },
        {
          id: 'b',
          text: { athlete: 'Has a powerful engine on a fragile foundation', parent: 'Has developed proximal strength but distal vulnerability' },
          isCorrect: true,
          feedback: { athlete: "Exactly. Big engine, weak base. That's the problem we're fixing.", parent: 'Correct. This proximal-distal imbalance is the core vulnerability we address.' },
        },
        {
          id: 'c',
          text: { athlete: 'Is slow but durable', parent: 'Prioritizes injury prevention over performance' },
          isCorrect: false,
          feedback: { athlete: "Opposite — they're fast but breakable.", parent: 'Incorrect. Glass Cannons are high-performing but vulnerable.' },
        },
        {
          id: 'd',
          text: { athlete: 'Only plays one sport', parent: 'Specializes too early in a single sport' },
          isCorrect: false,
          feedback: { athlete: "Not about sports — it's about their foundation.", parent: 'Incorrect. The term refers to structural imbalance, not sport specialization.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Think cannon: powerful but...',
        parent: 'Consider what makes glass simultaneously impressive and fragile...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 2: ARMOR BUILDING (NOT REHAB)
// ─────────────────────────────────────────────────────────────

const section2Armor: LearningSection = {
  id: 'section-2-armor',
  order: 2,
  title: 'Armor Building (Not Rehab)',
  level: 2, // L2: 50 XP, 1 shard
  unlockThreshold: 3,
  cards: [
    {
      id: 's2-l1',
      sectionId: 'section-2-armor',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: "THIS ISN'T REHAB",
          body: "Rehab = what you do AFTER something breaks.\n\nBPA = building ARMOR before anything happens.\n\nWe're not fixing injuries.\nWe're making you injury-proof.\n\nBig difference.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'PROACTIVE VS. REACTIVE',
          body: "Traditional rehabilitation operates in a reactive paradigm: tissue is damaged, then restored to baseline function.\n\nBPA (Bulletproof Ankles) operates in a proactive paradigm: tissue is systematically strengthened beyond baseline BEFORE stress occurs.\n\nThis is the distinction between:\n• Rehabilitation: restoring damaged tissue\n• Prehabilitation: fortifying healthy tissue",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's2-l2',
      sectionId: 'section-2-armor',
      order: 1,
      type: 'Lesson',
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
          body: "The biological principle underlying BPA is Davis's Law:\n\n\"Soft tissue remodels itself along the lines of imposed demand.\"\n\nThis means connective tissue—ligaments, tendons, fascia—adapts specifically to the stresses placed upon it. Collagen fibers align and thicken in response to mechanical load.\n\nImplication: If you want ankle structures capable of surviving violent inversion forces, you must expose them to controlled stress before competition.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's2-l3',
      sectionId: 'section-2-armor',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'PISTONS VS. SPRINGS',
          body: "Most training builds pistons:\n→ Muscles that grind\n→ Burn fuel\n→ Break down\n\nBPA builds springs:\n→ Absorb force\n→ Store energy\n→ Snap back instantly\n\nPistons wear out.\nSprings bounce back.\n\nWhich do you want?",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/piston-vs-spring.jpg',
          caption: 'Pistons grind. Springs bounce.',
        },
        parent: {
          headline: 'CONTRACTILE VS. ELASTIC TISSUE',
          body: "Traditional strength training emphasizes contractile tissue—muscle fibers that generate force through metabolic processes.\n\nBPA emphasizes elastic tissue—tendons and ligaments that store and release mechanical energy through deformation.\n\nContractile tissue (pistons):\n• Active force production\n• Metabolic cost\n• Fatigue-dependent\n\nElastic tissue (springs):\n• Passive force absorption\n• Energy-efficient\n• Fatigue-resistant",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/piston-vs-spring.jpg',
          caption: 'Contractile vs. elastic tissue function',
        },
      },
    },
    {
      id: 's2-l4',
      sectionId: 'section-2-armor',
      order: 3,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE RUBBER BAND ANKLE',
          body: "When a BPA-trained athlete rolls an ankle:\n\nThe tissue stretches under load...\nAbsorbs the force...\nAnd SNAPS BACK to position.\n\nLike a thick rubber band.\nNot a piece of string.\n\nString breaks. Rubber bands bounce back.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'ELASTIC RECOIL MECHANISM',
          body: "In a BPA-conditioned ankle, the lateral ligament complex behaves as a viscoelastic structure:\n\n1. Force application causes controlled deformation\n2. Energy is stored in the tissue matrix\n3. Elastic recoil returns the joint to neutral position\n4. No plastic (permanent) deformation occurs\n\nThis is analogous to a high-tensile rubber band versus an inelastic cord—both can stretch, but only one returns to its original state.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's2-c1',
      sectionId: 'section-2-armor',
      order: 4,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: "Davis's Law says your body:",
        parent: "Davis's Law states that soft tissue:",
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Gets weaker with age no matter what', parent: 'Inevitably degrades with chronological aging' },
          isCorrect: false,
          feedback: { athlete: 'Nope. You have more control than that.', parent: 'Incorrect. Tissue adaptation responds to mechanical signals, not just age.' },
        },
        {
          id: 'b',
          text: { athlete: 'Builds what you stress', parent: 'Remodels along lines of imposed demand' },
          isCorrect: true,
          feedback: { athlete: "Exactly. Stress it = strengthen it. That's the whole game.", parent: 'Correct. This principle is the biological foundation of the BPA protocol.' },
        },
        {
          id: 'c',
          text: { athlete: 'Needs rest more than training', parent: 'Requires passive recovery over active loading' },
          isCorrect: false,
          feedback: { athlete: 'Rest is part of it, but load drives adaptation.', parent: 'Incorrect. While recovery is necessary, mechanical load drives tissue remodeling.' },
        },
        {
          id: 'd',
          text: { athlete: 'Is mostly genetic', parent: 'Is primarily determined by genetic factors' },
          isCorrect: false,
          feedback: { athlete: 'Genetics matter, but training matters more for this.', parent: 'Incorrect. While genetics influence baseline, tissue adaptation is highly trainable.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Stress → strength',
        parent: 'Consider the relationship between mechanical demand and tissue response...',
      },
    },
    {
      id: 's2-c2',
      sectionId: 'section-2-armor',
      order: 5,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'BPA trains your ankle to act like:',
        parent: 'The BPA protocol conditions ankle tissue to function as:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'A piston', parent: 'A contractile force generator' },
          isCorrect: false,
          feedback: { athlete: 'Pistons grind and break down. We want bounce.', parent: 'Incorrect. Contractile tissue is metabolically costly and fatigue-dependent.' },
        },
        {
          id: 'b',
          text: { athlete: 'A spring', parent: 'An elastic energy storage system' },
          isCorrect: true,
          feedback: { athlete: "Yes! Absorb force, snap back. That's bulletproof.", parent: 'Correct. Elastic tissue absorbs and returns energy without structural damage.' },
        },
        {
          id: 'c',
          text: { athlete: 'A rock', parent: 'A rigid, immobile structure' },
          isCorrect: false,
          feedback: { athlete: 'Rocks are stiff but they crack. We want flexible strength.', parent: 'Incorrect. Rigidity creates brittleness, not resilience.' },
        },
        {
          id: 'd',
          text: { athlete: 'A muscle', parent: 'A muscular contractile unit' },
          isCorrect: false,
          feedback: { athlete: 'Muscles are important, but this is about connective tissue.', parent: 'Incorrect. BPA targets connective tissue, not contractile tissue.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'What bounces back?',
        parent: 'Consider which structure stores and returns energy...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 3: THE ANGLES
// ─────────────────────────────────────────────────────────────

const section3Angles: LearningSection = {
  id: 'section-3-angles',
  order: 3,
  title: 'The Angles',
  level: 2, // L2 continued
  unlockThreshold: 5,
  cards: [
    {
      id: 's3-l1',
      sectionId: 'section-3-angles',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'INJURIES HAPPEN SIDEWAYS',
          body: "Quick question:\n\nWhen's the last time someone got hurt doing a calf raise?\n\nNever.\n\nBecause injuries don't happen going up and down.\n\nThey happen going SIDEWAYS.\nThey happen with ROTATION.\n\nThat's where ankles actually roll.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'INJURY PLANE SPECIFICITY',
          body: "A critical observation: the vast majority of ankle injuries do not occur in the sagittal plane (up/down movement).\n\nThey occur in:\n• Frontal plane (side-to-side, inversion/eversion)\n• Transverse plane (internal/external rotation)\n\nYet most traditional \"ankle strengthening\" exercises—calf raises, dorsiflexion stretches—operate exclusively in the sagittal plane.\n\nThis is a fundamental training mismatch.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's3-l2',
      sectionId: 'section-3-angles',
      order: 1,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE 3-PLANE DEFENSE',
          body: "Your ankle moves in 3 directions:\n\n1. UP/DOWN (sagittal) ← Most training lives here\n2. SIDE TO SIDE (frontal) ← Where injuries happen\n3. ROTATION (transverse) ← Also where injuries happen\n\nBPA trains ALL THREE.\n\nEspecially that dangerous 45-degree angle where ankles actually roll.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/three-planes.jpg',
          caption: 'The three planes of ankle movement',
        },
        parent: {
          headline: 'TRI-PLANAR TRAINING',
          body: "Human movement occurs across three anatomical planes:\n\n1. Sagittal (flexion/extension) — Traditional training focus\n2. Frontal (abduction/adduction, inversion/eversion) — Injury-prone\n3. Transverse (rotation) — Injury-prone\n\nBPA specifically loads the ankle in the frontal and transverse planes, with particular emphasis on the ~45° \"crossover\" position where lateral ankle sprains typically occur.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/three-planes.jpg',
          caption: 'Tri-planar ankle movement',
        },
      },
    },
    {
      id: 's3-l3',
      sectionId: 'section-3-angles',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'TRAIN THE TWEAK',
          body: "Most people AVOID the positions where they got hurt.\n\nWe do the opposite.\n\nWe find the danger zone...\nAnd we TRAIN IT.\n\nWhy? Because when you stress tissue at scary angles, your body lays down stronger fibers RIGHT THERE.\n\nThe danger zone becomes your strength zone.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'POSITION-SPECIFIC ADAPTATION',
          body: "A counterintuitive principle of tissue remodeling: adaptation is angle-specific.\n\nCollagen fibers are laid down along the exact vectors of mechanical stress. Training at neutral angles produces strength at neutral angles—but leaves vulnerable positions unfortified.\n\nBy applying controlled resistance in the inversion position (the \"roll\" angle), we signal the body to reinforce precisely where injuries occur.\n\nThe danger zone becomes the strength zone.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's3-c1',
      sectionId: 'section-3-angles',
      order: 3,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'Most ankle injuries happen in which direction?',
        parent: 'The majority of ankle injuries occur in which anatomical plane?',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Up and down', parent: 'Sagittal (flexion/extension)' },
          isCorrect: false,
          feedback: { athlete: "That's where most TRAINING happens. Not where injuries happen.", parent: 'Incorrect. This is where most training occurs, not where injuries occur.' },
        },
        {
          id: 'b',
          text: { athlete: 'Side to side / rotation', parent: 'Frontal and transverse planes' },
          isCorrect: true,
          feedback: { athlete: "Yes. That's why we train those angles specifically.", parent: 'Correct. BPA specifically targets these injury-prone planes.' },
        },
        {
          id: 'c',
          text: { athlete: 'Straight forward', parent: 'Forward progression only' },
          isCorrect: false,
          feedback: { athlete: 'Forward movement rarely causes ankle rolls.', parent: 'Incorrect. Linear forward movement rarely produces inversion mechanisms.' },
        },
        {
          id: 'd',
          text: { athlete: 'All directions equally', parent: 'Evenly distributed across all planes' },
          isCorrect: false,
          feedback: { athlete: "Nope. There's a clear pattern — and that's what we train.", parent: 'Incorrect. Injury patterns show clear directional clustering.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Think about which way your ankle actually rolls...',
        parent: 'Consider the mechanism of lateral ankle sprains...',
      },
    },
    {
      id: 's3-c2',
      sectionId: 'section-3-angles',
      order: 4,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'BPA trains dangerous ankle positions because:',
        parent: 'BPA incorporates loading at vulnerable joint angles because:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: "It's fun", parent: 'It provides variety in training' },
          isCorrect: false,
          feedback: { athlete: "There's a real reason — not just for fun.", parent: 'Incorrect. The rationale is biomechanical, not motivational.' },
        },
        {
          id: 'b',
          text: { athlete: 'Stress there builds strength THERE', parent: 'Tissue adaptation is angle-specific' },
          isCorrect: true,
          feedback: { athlete: "Exactly. Danger zone → strength zone. That's the whole concept.", parent: 'Correct. Position-specific loading produces position-specific adaptation.' },
        },
        {
          id: 'c',
          text: { athlete: "To prove you're tough", parent: 'To demonstrate pain tolerance' },
          isCorrect: false,
          feedback: { athlete: "It's not about being tough — it's about being smart.", parent: 'Incorrect. The goal is tissue adaptation, not pain exposure.' },
        },
        {
          id: 'd',
          text: { athlete: 'All angles are the same', parent: 'Angular position is irrelevant to adaptation' },
          isCorrect: false,
          feedback: { athlete: "Angles matter a lot. That's the whole point of this section.", parent: 'Incorrect. Research clearly demonstrates angle-specific adaptation.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Where you stress = where you strengthen',
        parent: 'Recall the specificity principle of tissue adaptation...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 4: THE SOLUTION - ISOMETRICS
// ─────────────────────────────────────────────────────────────

const section4Isometrics: LearningSection = {
  id: 'section-4-isometrics',
  order: 4,
  title: 'The Solution: Isometrics',
  level: 3, // L3: 75 XP, 1 shard
  unlockThreshold: 7,
  cards: [
    {
      id: 's4-l1',
      sectionId: 'section-4-isometrics',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'ISOMETRICS = TENSION WITHOUT MOVEMENT',
          body: "So how do we safely load the ankle at those scary angles?\n\nIsometrics.\n\nYou push HARD...\nBut nothing actually moves.\n\nAll the force.\nNone of the risk.\n\nPerfect for building armor at end-range positions.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'ISOMETRIC LOADING',
          body: "Isometric contractions—force generation without joint movement—provide an ideal training modality for connective tissue remodeling:\n\n• High force production is achievable\n• Joint position can be precisely controlled\n• End-range loading is safe (no acceleration through vulnerable positions)\n• Minimal equipment required\n\nThis makes isometrics the preferred method for strengthening tissue at specific angles.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's4-l2',
      sectionId: 'section-4-isometrics',
      order: 1,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'START WITH YOUR BODYWEIGHT',
          body: "You don't need fancy equipment to start.\n\nExtreme Isometrics use just your bodyweight:\n\n→ Drive your foot INTO the ground\n→ Hold at end-range angles\n→ Create maximum tension\n\nThis alone is enough to wake up dormant tissue and start building.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'PHASE 1: EXTREME ISOMETRICS',
          body: "The initial phase requires no equipment. \"Extreme Isometrics\" leverage bodyweight to create tissue-level stress:\n\n• Ground reaction force creates resistance\n• End-range joint positions are held under tension\n• Internal muscle activation generates load on ligaments\n\nThis stimulus is sufficient to initiate mechanotransduction and begin the remodeling cascade.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's4-l3',
      sectionId: 'section-4-isometrics',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THEN ADD RESISTANCE',
          body: "Once bodyweight gets easy, you add resistance.\n\nOvercoming Isometrics = pushing against something that won't move.\n\nThis lets you generate MAXIMUM force safely.\n\nTools like the Iso-Strap make this easy, but you can start with a wall or doorframe.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/iso-strap-demo.jpg',
          caption: 'Overcoming Isometrics with resistance',
        },
        parent: {
          headline: 'PHASE 2: OVERCOMING ISOMETRICS',
          body: "As tissue tolerance increases, external resistance is introduced to continue the adaptation curve.\n\n\"Overcoming Isometrics\" involve pushing against an immovable object, allowing near-maximal force production without movement risk.\n\nThis can be achieved with:\n• Purpose-built tools (Iso-Strap)\n• Environmental structures (walls, doorframes)\n• Partner resistance\n\nThe key is creating sufficient load at the target angle.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/iso-strap-demo.jpg',
          caption: 'Overcoming Isometric loading',
        },
      },
    },
    {
      id: 's4-l4',
      sectionId: 'section-4-isometrics',
      order: 3,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE FLOATING HEEL',
          body: "One key rule: keep your heel slightly OFF the ground.\n\nWhy?\n\nThis forces your ankle to stabilize under load — just like when you're cutting, jumping, or changing direction in a game.\n\nFlat foot = too easy.\nFloating heel = real-world strength.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'FLOATING HEEL PRINCIPLE',
          body: "A critical protocol element: maintaining heel elevation during isometric loading.\n\nRationale:\n• Sport-specific positions rarely involve full heel contact\n• Elevated heel shifts load to forefoot and ankle stabilizers\n• Replicates ground reaction forces during athletic maneuvers\n• Eliminates \"energy leaks\" through passive heel support\n\nThis position specificity ensures training transfers to competition demands.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's4-c1',
      sectionId: 'section-4-isometrics',
      order: 4,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'Isometrics are special because they generate force:',
        parent: 'Isometric contractions are advantageous because they produce force:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'With lots of movement', parent: 'Through large ranges of motion' },
          isCorrect: false,
          feedback: { athlete: 'Opposite — isometrics have NO movement.', parent: 'Incorrect. Isometrics are defined by the absence of joint movement.' },
        },
        {
          id: 'b',
          text: { athlete: 'Without movement', parent: 'Without joint displacement' },
          isCorrect: true,
          feedback: { athlete: 'Exactly. Maximum tension, zero movement. Safe and effective.', parent: 'Correct. This allows high force production at specific, controlled joint angles.' },
        },
        {
          id: 'c',
          text: { athlete: 'Only for muscles', parent: 'Exclusively through contractile tissue' },
          isCorrect: false,
          feedback: { athlete: "Isometrics load ligaments and tendons too — that's the point.", parent: 'Incorrect. Isometric loading stresses connective tissue as well as muscle.' },
        },
        {
          id: 'd',
          text: { athlete: 'With expensive equipment', parent: 'Only with specialized equipment' },
          isCorrect: false,
          feedback: { athlete: 'You can start with just your bodyweight. No equipment needed.', parent: 'Incorrect. Bodyweight isometrics require no equipment.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Iso = same. Metric = length. Same length = no movement.',
        parent: 'Consider the etymology: iso (same) + metric (measure/length)...',
      },
    },
    {
      id: 's4-c2',
      sectionId: 'section-4-isometrics',
      order: 5,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'The floating heel position is important because:',
        parent: 'Heel elevation during isometric loading is prescribed because:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'It looks cool', parent: 'It has aesthetic appeal' },
          isCorrect: false,
          feedback: { athlete: "There's a real biomechanical reason.", parent: 'Incorrect. The rationale is biomechanical, not aesthetic.' },
        },
        {
          id: 'b',
          text: { athlete: 'It replicates sport G-forces', parent: 'It replicates sport-specific loading patterns' },
          isCorrect: true,
          feedback: { athlete: 'Yes! Train how you play. Floating heel = game-ready ankles.', parent: 'Correct. This position specificity ensures transfer to athletic demands.' },
        },
        {
          id: 'c',
          text: { athlete: 'It makes it easier', parent: 'It reduces training difficulty' },
          isCorrect: false,
          feedback: { athlete: "Actually, it makes it harder — that's the point.", parent: 'Incorrect. Heel elevation increases, not decreases, stabilization demands.' },
        },
        {
          id: 'd',
          text: { athlete: "It's just a personal preference", parent: "It's an optional stylistic choice" },
          isCorrect: false,
          feedback: { athlete: "Nope — it's a key part of the protocol for a reason.", parent: "Incorrect. It's a prescribed protocol element with specific rationale." },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'When do you ever play a sport flat-footed?',
        parent: 'Consider athletic positions during competition...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 5: THE R3 SYSTEM
// ─────────────────────────────────────────────────────────────

const section5R3: LearningSection = {
  id: 'section-5-r3',
  order: 5,
  title: 'The R3 System',
  level: 3, // L3 continued
  unlockThreshold: 9,
  cards: [
    {
      id: 's5-l1',
      sectionId: 'section-5-r3',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE R3 FRAMEWORK',
          body: "BPA isn't random exercises.\n\nIt's a system: R3\n\n1. RELEASE — Wake up your feet\n2. RESTORE — Build the armor\n3. RE-ENGINEER — Add the bounce\n\nThree phases. In order. That's it.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'THE R3 PROTOCOL',
          body: "The BPA system follows a structured, three-phase progression known as R3:\n\n1. RELEASE — Sensory re-awakening and tissue preparation\n2. RESTORE — Structural loading and collagen remodeling\n3. RE-ENGINEER — Integration into dynamic movement patterns\n\nEach phase builds on the previous, creating a coherent developmental pathway.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's5-l2',
      sectionId: 'section-5-r3',
      order: 1,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'PHASE 1: RELEASE',
          body: "First, we wake up your feet.\n\nRemember those 200,000 sensors? Time to turn them back on.\n\n→ Barefoot exposure\n→ Different textures\n→ Ground connection\n\nWhen your brain can FEEL your feet, it can PROTECT them.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'RELEASE: SENSORY RE-AWAKENING',
          body: "Phase 1 focuses on re-establishing the sensorimotor connection between foot and brain:\n\n• Barefoot exposure increases mechanoreceptor sensitivity\n• Varied texture interaction stimulates different receptor types\n• Ground contact time restores proprioceptive acuity\n\nThis \"sensory wake-up\" enables the feed-forward motor control necessary for injury prevention.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's5-l3',
      sectionId: 'section-5-r3',
      order: 2,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'PHASE 2: RESTORE',
          body: "This is where you BUILD THE ARMOR.\n\n→ Static isometric holds\n→ Bodyweight first, then add resistance\n→ Target the danger angles\n\nWe use two proven methods:\n• Rio Protocol — handles pain\n• Berlin Method — builds stiffness\n\nGoal: rebuild the \"half-dome\" of your foot so it stops collapsing.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/half-dome.jpg',
          caption: "The foot's half-dome architecture",
        },
        parent: {
          headline: 'RESTORE: STRUCTURAL LOADING',
          body: "Phase 2 focuses on tissue-level adaptation through isometric loading:\n\n• Progressive overload from bodyweight to external resistance\n• Position-specific loading at vulnerable angles\n• Evidence-based protocols:\n  - Rio Protocol (tendinopathy rehabilitation, pain modulation)\n  - Berlin Method (structural stiffness development)\n\nThe goal is restoring the foot's \"half-dome\" architecture—the medial longitudinal arch system that provides dynamic stability.",
          mediaType: 'image',
          mediaUrl: '/images/modules/bpa/half-dome.jpg',
          caption: 'Medial longitudinal arch (half-dome) anatomy',
        },
      },
    },
    {
      id: 's5-l4',
      sectionId: 'section-5-r3',
      order: 3,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'PHASE 3: RE-ENGINEER',
          body: "Last phase: add THE BOUNCE.\n\n→ Integrate into real movement\n→ Re-teach elastic rebound\n→ Go from grinding to springing\n\nYou're not just strong now — you're springy.\n\nYour ankle absorbs force and SNAPS BACK instead of breaking.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'RE-ENGINEER: DYNAMIC INTEGRATION',
          body: "Phase 3 transitions static strength into dynamic function:\n\n• Plyometric progressions teach elastic energy utilization\n• Movement integration drills connect ankle stability to whole-body patterns\n• Reactive training develops automatic protective responses\n\nThe outcome: tissue that doesn't just resist load, but actively stores and returns energy—the \"spring\" mechanism that characterizes elite athletic performance.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's5-l5',
      sectionId: 'section-5-r3',
      order: 4,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'THE RESULT',
          body: "An ankle that doesn't just survive.\n\nAn ankle that DOMINATES.\n\nNo more fear of landing.\nNo more rolling and praying.\nNo more seasons ended by bad luck.\n\nThis is BULLETPROOF ANKLES.\n\nReplace fragility with resilience.\nReplace fear with confidence.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'CLINICAL OUTCOMES',
          body: "Athletes who complete the R3 protocol demonstrate:\n\n• Reduced incidence of lateral ankle sprains\n• Decreased severity when sprains do occur\n• Faster return-to-play timelines\n• Improved subjective confidence in cutting/landing\n\nThe goal is not merely injury prevention, but performance enhancement through structural optimization.\n\nThis is Bulletproof Ankles: fragility replaced with resilience.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's5-c1',
      sectionId: 'section-5-r3',
      order: 5,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'The first phase of R3 is:',
        parent: 'The initial phase of the R3 protocol is:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Restore', parent: 'Restore (structural loading)' },
          isCorrect: false,
          feedback: { athlete: "Close — but that's Phase 2. Gotta wake up the sensors first.", parent: 'Incorrect. Restore is Phase 2. Sensory preparation precedes loading.' },
        },
        {
          id: 'b',
          text: { athlete: 'Release', parent: 'Release (sensory re-awakening)' },
          isCorrect: true,
          feedback: { athlete: 'Yes! Wake up the feet first, then build the armor.', parent: 'Correct. Sensory restoration precedes and enables structural loading.' },
        },
        {
          id: 'c',
          text: { athlete: 'Re-Engineer', parent: 'Re-Engineer (dynamic integration)' },
          isCorrect: false,
          feedback: { athlete: "That's Phase 3 — the final step.", parent: 'Incorrect. Re-Engineer is the final phase, building on Release and Restore.' },
        },
        {
          id: 'd',
          text: { athlete: 'Repeat', parent: 'Repeat (cyclical loading)' },
          isCorrect: false,
          feedback: { athlete: "Not one of the R's. Release, Restore, Re-Engineer.", parent: 'Incorrect. The phases are Release, Restore, and Re-Engineer.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'You have to wake up before you can work out...',
        parent: 'Consider which phase establishes the foundation for subsequent loading...',
      },
    },
    {
      id: 's5-c2',
      sectionId: 'section-5-r3',
      order: 6,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'How many sensory receptors are in your foot?',
        parent: 'Approximately how many exteroceptors are present in the human foot?',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'About 1,000', parent: 'Approximately 1,000' },
          isCorrect: false,
          feedback: { athlete: 'Way more than that. Your foot is a sensor hub.', parent: 'Incorrect. The foot has significantly higher receptor density.' },
        },
        {
          id: 'b',
          text: { athlete: 'About 10,000', parent: 'Approximately 10,000' },
          isCorrect: false,
          feedback: { athlete: 'Still too low. Think bigger.', parent: 'Incorrect. The actual number is an order of magnitude higher.' },
        },
        {
          id: 'c',
          text: { athlete: 'About 200,000', parent: 'Approximately 200,000' },
          isCorrect: true,
          feedback: { athlete: "That's it. 200,000 sensors — all waiting to help protect you.", parent: 'Correct. This high receptor density enables the sophisticated proprioceptive capacity of the foot.' },
        },
        {
          id: 'd',
          text: { athlete: 'About 1 million', parent: 'Approximately 1,000,000' },
          isCorrect: false,
          feedback: { athlete: 'Not quite that many, but close energy!', parent: 'Incorrect. While the foot is receptor-dense, this overestimates the count.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Two hundred thousand...',
        parent: 'The figure was mentioned in the Release phase description...',
      },
    },
    {
      id: 's5-c3',
      sectionId: 'section-5-r3',
      order: 7,
      type: 'Check',
      content: {
        athlete: { headline: 'QUICK CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
        parent: { headline: 'COMPREHENSION CHECK', body: null, mediaType: null, mediaUrl: null, caption: null },
      },
      question: {
        athlete: 'The goal of the RESTORE phase is to:',
        parent: 'The primary objective of the RESTORE phase is:',
      },
      options: [
        {
          id: 'a',
          text: { athlete: 'Wake up your sensors', parent: 'Re-establish sensorimotor connections' },
          isCorrect: false,
          feedback: { athlete: "That's RELEASE. RESTORE is about building armor.", parent: 'Incorrect. Sensory re-awakening is the Release phase objective.' },
        },
        {
          id: 'b',
          text: { athlete: 'Rebuild the half-dome architecture', parent: 'Restore the medial longitudinal arch system' },
          isCorrect: true,
          feedback: { athlete: 'Yes! Restore rebuilds the structural foundation of your foot.', parent: "Correct. Structural loading restores the foot's arch architecture." },
        },
        {
          id: 'c',
          text: { athlete: 'Add explosive bounce', parent: 'Develop plyometric capacity' },
          isCorrect: false,
          feedback: { athlete: "That's RE-ENGINEER. RESTORE comes first.", parent: 'Incorrect. Dynamic integration is the Re-Engineer phase objective.' },
        },
        {
          id: 'd',
          text: { athlete: 'Take a rest day', parent: 'Implement active recovery' },
          isCorrect: false,
          feedback: { athlete: 'RESTORE is active building, not resting.', parent: 'Incorrect. Restore is an active loading phase, not a recovery phase.' },
        },
      ],
      hintAvailable: true,
      hint: {
        athlete: 'Restore the... what?',
        parent: 'Consider what structural element is being restored...',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECTION 6: YOUR BPA JOURNEY (COMPLETION)
// ─────────────────────────────────────────────────────────────

const section6Completion: LearningSection = {
  id: 'section-6-completion',
  order: 6,
  title: 'Your BPA Journey',
  level: 4, // L4: 100 XP, 2 shards + completion bonus
  unlockThreshold: 12,
  cards: [
    {
      id: 's6-l1',
      sectionId: 'section-6-completion',
      order: 0,
      type: 'Lesson',
      content: {
        athlete: {
          headline: 'YOU NOW KNOW THE SYSTEM',
          body: "Let's recap what you just learned:\n\n✓ Why support actually weakens ankles\n✓ The Glass Cannon problem\n✓ Davis's Law: stress → strength\n✓ Train the danger angles\n✓ Isometrics: force without risk\n✓ The R3 Protocol: Release → Restore → Re-Engineer\n\nYou're not just informed now.\nYou're EQUIPPED.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'KNOWLEDGE SUMMARY',
          body: "You have now completed the theoretical foundation of the BPA system:\n\n• The protection paradox and its implications\n• Glass Cannon architecture and its vulnerabilities\n• Davis's Law and mechanotransduction principles\n• Tri-planar loading rationale\n• Isometric training methodology\n• R3 Protocol structure: Release → Restore → Re-Engineer\n\nThis knowledge provides the conceptual framework for the practical application that follows.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
    },
    {
      id: 's6-completion',
      sectionId: 'section-6-completion',
      order: 1,
      type: 'Completion',
      content: {
        athlete: {
          headline: "WHAT'S NEXT",
          body: "Knowledge is just the start.\n\nNow it's time to DO THE WORK.\n\nYou've unlocked:\n→ BPA Drill Stack (7 exercises, 12 min)\n→ Barefoot Reset Mini program\n\nStart with the drill stack. Your bulletproof journey begins TODAY.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
        parent: {
          headline: 'NEXT STEPS',
          body: "Conceptual understanding must be translated into practical application.\n\nYou have unlocked:\n• BPA Drill Stack: 7 foundational exercises (~12 minutes)\n• Barefoot Reset Mini: Introductory movement program\n\nRecommendation: Begin with the BPA Drill Stack to establish baseline competency in the R3 Protocol movements.\n\nConsistent application of these principles yields the outcomes described in this module.",
          mediaType: null,
          mediaUrl: null,
          caption: null,
        },
      },
      unlockedContent: [
        {
          type: 'DrillStack',
          id: 'bpa-drill-stack-v1',
          title: 'BPA Drill Stack',
          description: '7 foundational exercises',
          duration: '12 min',
        },
        {
          type: 'Program',
          id: 'barefoot-reset-mini',
          title: 'Barefoot Reset Mini',
          description: 'Introductory movement program',
          duration: '7 days',
        },
        {
          type: 'Product',
          id: 'iso-strap',
          title: 'Iso-Strap',
          description: 'Advanced resistance tool for Phase 2',
          handle: 'iso-strap',
          ctaLabel: 'Learn More',
        },
      ],
      completionBadge: {
        id: 'armor-builder',
        name: 'Armor Builder',
        icon: '🛡️',
        description: 'Completed the Bulletproof Ankles knowledge module',
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// FULL MODULE EXPORT
// ─────────────────────────────────────────────────────────────

export const bulletproofAnklesModule: LearningModule = {
  id: 'bpa-v1',
  slug: 'bulletproof-ankles',
  title: 'Bulletproof Ankles',
  subtitle: 'The Armor-Building System',
  shortDescription: 'Learn to build injury-resistant ankles with the R3 Protocol.',
  longDescription: 'This module teaches you the science behind bulletproof ankles and the R3 Protocol (Release → Restore → Re-Engineer) developed by NBA trainer James Scott. Learn why modern footwear creates weakness, how to identify vulnerability, and the systematic approach to building truly resilient ankle structures.',
  sport: 'Barefoot',
  author: 'James Scott',
  reviewedBy: 'James Scott',
  estimatedMinutes: 15,
  // Economy v2: Total possible = 360 XP, 5 shards (≈ 0.5 crystal)
  maxXp: 360,
  maxShards: 5,
  thumbnailUrl: '/images/modules/bpa-thumb.jpg',
  heroVideoUrl: null,
  prerequisites: [],
  unlocksContent: ['bpa-drill-stack-v1', 'barefoot-reset-mini'],
  sections: [
    section0Intro,
    section1Problem,
    section2Armor,
    section3Angles,
    section4Isometrics,
    section5R3,
    section6Completion,
  ],
  seo: {
    title: 'Bulletproof Ankles: Youth Ankle Stability Training | YP Academy',
    description:
      "Learn the R3 Protocol for building injury-resistant ankles in young athletes. Science-backed system by James Scott, NBA trainer. Reduce ankle sprains and build athletic resilience.",
    pillarSlug: '/barefoot-training/',
    clusterSlug: '/barefoot-training/ankle-stability/',
    keywords: [
      'youth ankle stability',
      'ankle injury prevention',
      'basketball ankle exercises',
      'barefoot training youth',
      'R3 protocol',
      'isometric ankle exercises',
      'youth sports injury prevention',
    ],
    faqSchema: [
      {
        question: 'Why have ankle injuries increased despite better protective equipment?',
        answer:
          "External support (braces, high-tops, cushioning) weakens living tissue by removing the mechanical stress needed for adaptation. This creates the 'Glass Cannon' athlete: powerful upper body on a fragile foundation.",
      },
      {
        question: "What is Davis's Law?",
        answer:
          "Davis's Law states that soft tissue remodels itself along the lines of imposed demand. This means connective tissue adapts specifically to the stresses placed upon it—the foundation of the BPA training approach.",
      },
      {
        question: 'What is the R3 Protocol?',
        answer:
          'R3 is a three-phase ankle development system: Release (sensory re-awakening), Restore (structural loading through isometrics), and Re-Engineer (dynamic movement integration).',
      },
      {
        question: "Why train at 'dangerous' ankle angles?",
        answer:
          'Tissue adaptation is angle-specific. Training at vulnerable positions signals the body to lay down stronger collagen fibers exactly where injuries occur, transforming the danger zone into a strength zone.',
      },
      {
        question: 'How many sensory receptors are in the human foot?',
        answer:
          'The human foot contains approximately 200,000 exteroceptors—sensory nerve endings that provide real-time feedback about ground contact and joint position. Cushioned footwear mutes this critical sensory input.',
      },
    ],
  },
  analytics: {
    expectedCompletionRate: 0.65,
    targetAccuracyRange: [0.6, 0.8],
    avgTimePerCard: 12,
    dropoffWarningThreshold: 0.15,
  },
  createdAt: '2026-01-07T00:00:00Z',
  updatedAt: '2026-01-07T00:00:00Z',
};

// ─────────────────────────────────────────────────────────────
// MODULE REGISTRY (for future modules)
// ─────────────────────────────────────────────────────────────

export const moduleRegistry: Record<string, LearningModule> = {
  'bulletproof-ankles': bulletproofAnklesModule,
};

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return moduleRegistry[slug];
}

export function getAllModules(): LearningModule[] {
  return Object.values(moduleRegistry);
}
