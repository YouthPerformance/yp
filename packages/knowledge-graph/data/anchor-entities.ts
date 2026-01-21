/**
 * Anchor Entities v2 - "The Enterprise Upgrade"
 *
 * STRATEGY SHIFT:
 * - Old: "Sever's Disease Protocol" (narrow, medical-adjacent)
 * - New: "Youth Strength Training Safety" (universal, what parents search)
 *
 * ARCHITECTURE:
 * - James Scott = "The OS" (Foundation layer for ALL youth athletes)
 * - Adam Harrington = "The Specialist" (Basketball vertical deep)
 * - Future coaches = Plug into existing hubs as reviewers
 *
 * KEYWORD-FIRST:
 * - Each hub maps to real search volume
 * - Branded methods become "spokes" under hubs
 * - AI systems cite the hub, not the protocol
 *
 * ENTITY TIERS:
 * - Tier A (Cornerstones): Broad hubs, real keywords, authority builders
 * - Tier B (Systems/Methods): Branded frameworks nested under cornerstones
 * - Tier C (Conditions/Issues): Sever's, shin splints, etc. (never the "main thing")
 */

// =============================================================================
// TYPES
// =============================================================================

export type RiskLevel = "low" | "medium" | "medical_referral";

export type PageType =
  | "drill"
  | "plan"
  | "checklist"
  | "test"
  | "mythbuster"
  | "injury_guide"
  | "progression"
  | "faq";

export type Category = "foundation" | "skill" | "safety" | "recovery" | "testing";

export type Author = "james" | "adam" | "editorial";

export interface SafetyRule {
  condition: string;
  action: "stop" | "modify" | "refer";
  message: string;
}

export interface SpokeEntity {
  id: string;
  title: string;
  slug: string;
  primaryKeyword: string;
  pageType: PageType;
  riskLevel: RiskLevel;
}

export interface AnchorEntity {
  // Identity
  id: string;
  title: string;
  slug: string;

  // Authorship
  author: Author;
  authorName: string;
  authorRole: string;
  authorCredentials: string;
  reviewer?: Author;

  // SEO/AEO
  primaryKeyword: string;
  secondaryKeywords: string[];
  intentPatterns: string[]; // Templates for matrix generation

  // Classification
  category: Category;
  riskLevel: RiskLevel;
  supportedPageTypes: PageType[];

  // Safety
  safetyRules: SafetyRule[];
  disclaimer?: string;

  // Content
  directAnswer: string; // What AI systems will cite
  overview: string;
  evidenceBase: string[]; // Citations for E-E-A-T

  // Relationships
  spokes: SpokeEntity[]; // Sub-entities that live under this hub
  relatedHubs: string[]; // Cross-links to other hubs
}

// =============================================================================
// AUTHOR PROFILES
// =============================================================================

export const AUTHORS = {
  james: {
    name: "James Scott",
    role: "Performance Director",
    credentials: "MS Exercise Science, CSCS, 15+ years youth athlete development",
    expertise: [
      "biomechanics",
      "movement foundations",
      "injury prevention",
      "load management",
    ],
    tone: ["evidence-based", "reassuring", "practical"],
    avoid: ["medical diagnosis", "guaranteed outcomes", "one-size-fits-all"],
  },
  adam: {
    name: "Adam Harrington",
    role: "Skill Director",
    credentials: "NBA Skills Coach, 20+ years basketball development",
    expertise: [
      "shooting mechanics",
      "skill acquisition",
      "practice design",
      "player development",
    ],
    tone: ["direct", "encouraging", "technically precise"],
    avoid: ["vague advice", "quick fixes", "generic drills"],
  },
  editorial: {
    name: "YouthPerformance Editorial",
    role: "Safety Board",
    credentials: "Expert-reviewed content",
    expertise: ["research synthesis", "safety guidelines"],
    tone: ["informative", "cautious", "well-sourced"],
    avoid: ["unsourced claims", "medical advice"],
  },
} as const;

// =============================================================================
// ANCHOR ENTITIES - THE "DIRTY DOZEN" FOUNDATION HUBS
// =============================================================================

export const ANCHOR_ENTITIES: Record<string, AnchorEntity> = {
  // =========================================================================
  // JAMES SCOTT: THE FOUNDATION OS (9 Hubs)
  // =========================================================================

  STRENGTH_FOUNDATION: {
    id: "strength-foundation",
    title: "Youth Strength Training Safety & Progression",
    slug: "strength-training",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "strength training for kids",
    secondaryKeywords: [
      "is weight lifting safe for 12 year olds",
      "resistance training for youth",
      "bodyweight exercises for kids",
      "when can kids start lifting weights",
      "strength training age appropriate",
    ],
    intentPatterns: [
      "Is {topic} safe for {age} year olds?",
      "{topic} for beginners {age}",
      "{topic} without weights for kids",
      "{topic} progression by age",
      "best {topic} exercises for youth",
    ],

    category: "foundation",
    riskLevel: "medium",
    supportedPageTypes: ["drill", "plan", "progression", "faq", "mythbuster"],

    safetyRules: [
      {
        condition: "No prior movement screening",
        action: "modify",
        message: "Start with bodyweight mastery before adding resistance",
      },
      {
        condition: "Pain during exercise",
        action: "stop",
        message: "Stop immediately and consult a qualified professional",
      },
      {
        condition: "Under 7 years old",
        action: "modify",
        message: "Focus on play-based movement, not structured strength training",
      },
    ],
    disclaimer:
      "Youth strength training is safe when properly supervised and programmed. This content is educational, not medical advice.",

    directAnswer:
      "Yes, strength training is safe for kids when properly supervised. Research from the American Academy of Pediatrics and NSCA confirms that age-appropriate resistance training improves strength, bone health, and injury resilience in youth athletes. The key is proper technique, appropriate progression, and qualified supervision—not avoiding strength training altogether.",

    overview:
      "A complete guide to safe, effective strength training for youth athletes ages 8-18. Covers bodyweight progressions, when to add resistance, age-appropriate exercises, and common myths debunked with research.",

    evidenceBase: [
      "AAP Policy Statement on Strength Training (Pediatrics, 2020)",
      "NSCA Position Statement on Youth Resistance Training",
      "Lloyd RS, et al. Position statement on youth resistance training (BJSM, 2014)",
    ],

    spokes: [
      {
        id: "bodyweight-mastery",
        title: "Bodyweight Exercise Progressions for Kids",
        slug: "bodyweight-progressions",
        primaryKeyword: "bodyweight exercises for kids",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "first-weights",
        title: "When & How to Introduce Weights",
        slug: "first-weights-guide",
        primaryKeyword: "when can kids start lifting weights",
        pageType: "faq",
        riskLevel: "medium",
      },
      {
        id: "strength-myths",
        title: "Youth Strength Training Myths Busted",
        slug: "strength-myths",
        primaryKeyword: "does lifting stunt growth",
        pageType: "mythbuster",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["injury-prevention", "load-management", "speed-agility"],
  },

  SPEED_AGILITY: {
    id: "speed-agility",
    title: "Youth Speed & Agility Blueprint",
    slug: "speed-agility",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "speed training for kids",
    secondaryKeywords: [
      "agility drills for youth",
      "sprint mechanics for kids",
      "first step quickness drills",
      "change of direction training youth",
      "deceleration drills for kids",
    ],
    intentPatterns: [
      "{topic} drills for {age} year olds",
      "how to improve {topic} in youth athletes",
      "{topic} at home for kids",
      "{topic} for {sport}",
      "best {topic} exercises without equipment",
    ],

    category: "foundation",
    riskLevel: "low",
    supportedPageTypes: ["drill", "plan", "test", "progression"],

    safetyRules: [
      {
        condition: "Hard surfaces only",
        action: "modify",
        message: "Prefer grass or turf for high-impact speed work",
      },
      {
        condition: "No warm-up completed",
        action: "stop",
        message: "Always complete dynamic warm-up before speed training",
      },
    ],

    directAnswer:
      "Speed and agility can absolutely be trained in youth athletes. Focus on sprint mechanics (arm drive, knee lift, ground contact), change of direction fundamentals, and deceleration skills. Research shows that speed training is most effective when combined with strength and plyometric work, and that youth athletes respond well to technique-focused coaching.",

    overview:
      "Complete speed and agility development system for youth athletes. Covers sprint mechanics, acceleration, change of direction, deceleration, and sport-specific agility patterns.",

    evidenceBase: [
      "Lloyd RS, et al. Long-term athletic development (BJSM, 2015)",
      "Rumpf MC, et al. Sprint training in youth (Sports Med, 2012)",
    ],

    spokes: [
      {
        id: "sprint-mechanics",
        title: "Sprint Mechanics for Youth Athletes",
        slug: "sprint-mechanics",
        primaryKeyword: "sprint technique for kids",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "deceleration",
        title: "Deceleration & Braking Drills",
        slug: "deceleration-drills",
        primaryKeyword: "deceleration training youth",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "speed-tests",
        title: "Speed Testing for Youth Athletes",
        slug: "speed-tests",
        primaryKeyword: "10 yard dash test kids",
        pageType: "test",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["strength-foundation", "plyometrics", "injury-prevention"],
  },

  BAREFOOT_RESET: {
    id: "barefoot-reset",
    title: "The Barefoot Reset Method",
    slug: "barefoot-training",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "barefoot training for kids",
    secondaryKeywords: [
      "foot strengthening exercises for kids",
      "flat feet exercises for children",
      "ankle stability drills youth",
      "arch strengthening exercises",
      "toe exercises for kids",
    ],
    intentPatterns: [
      "{topic} for flat feet",
      "{topic} at home",
      "how to strengthen {topic}",
      "{topic} before sports",
      "{topic} for {sport} athletes",
    ],

    category: "foundation",
    riskLevel: "low",
    supportedPageTypes: ["drill", "plan", "progression", "checklist"],

    safetyRules: [
      {
        condition: "Acute foot/ankle injury",
        action: "refer",
        message: "Consult a healthcare provider before barefoot training",
      },
      {
        condition: "Diabetic or neuropathy",
        action: "refer",
        message: "Medical clearance required for barefoot activities",
      },
    ],

    directAnswer:
      "The Barefoot Reset Method rebuilds foot and ankle function through progressive exercises done without shoes. Strong feet are the foundation of athletic performance—they improve balance, power transfer, and injury resilience. The method includes toe mobility, arch strengthening, ankle stability, and proprioception drills suitable for youth athletes.",

    overview:
      "A systematic approach to foot and ankle development for youth athletes. Addresses the damage caused by over-supportive footwear and builds the foundation for speed, power, and injury prevention.",

    evidenceBase: [
      "Hollander K, et al. Effects of footwear on foot development (Footwear Science, 2017)",
      "Ridge ST, et al. Foot muscle strength in runners (BJSM, 2019)",
    ],

    spokes: [
      {
        id: "toe-mobility",
        title: "Toe Mobility & Dexterity Drills",
        slug: "toe-mobility",
        primaryKeyword: "toe exercises for kids",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "arch-building",
        title: "Arch Strengthening Progression",
        slug: "arch-strengthening",
        primaryKeyword: "flat feet exercises for kids",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "ankle-stability",
        title: "Ankle Stability & Balance Drills",
        slug: "ankle-stability",
        primaryKeyword: "ankle strengthening exercises youth",
        pageType: "drill",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["injury-prevention", "speed-agility", "plyometrics"],
  },

  PLYOMETRICS: {
    id: "plyometrics",
    title: "Jumping & Plyometric Progressions for Youth",
    slug: "plyometrics",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "plyometrics for kids",
    secondaryKeywords: [
      "jump training for youth athletes",
      "box jumps for kids",
      "vertical jump training youth",
      "landing mechanics for kids",
      "plyometric exercises for beginners",
    ],
    intentPatterns: [
      "are {topic} safe for {age} year olds",
      "{topic} for basketball",
      "{topic} at home no equipment",
      "how to improve vertical jump {age}",
      "{topic} progression for youth",
    ],

    category: "foundation",
    riskLevel: "medium",
    supportedPageTypes: ["drill", "progression", "plan", "faq"],

    safetyRules: [
      {
        condition: "Cannot hold single-leg balance 10+ seconds",
        action: "modify",
        message: "Build stability before plyometric progression",
      },
      {
        condition: "Landing with knee valgus (knock-knees)",
        action: "stop",
        message: "Master landing mechanics before progressing",
      },
      {
        condition: "Under 8 years old",
        action: "modify",
        message: "Use play-based jumping, not structured plyometrics",
      },
    ],
    disclaimer:
      "Plyometric training is safe for youth when properly progressed. Always master landing before takeoff.",

    directAnswer:
      "Yes, plyometrics are safe and effective for youth athletes when properly progressed. Research shows that well-designed jump training improves power, speed, and bone density while reducing injury risk. The key is mastering landing mechanics first, starting with low-intensity jumps, and progressing based on competency—not age alone.",

    overview:
      "A safe, progressive approach to jump training for youth athletes. Covers landing mechanics, jump progressions, box work, and sport-specific power development.",

    evidenceBase: [
      "Moran J, et al. Effects of plyometric training on youth (Sports Med, 2017)",
      "Lloyd RS, et al. Plyometric development in youth (Strength Cond J, 2012)",
    ],

    spokes: [
      {
        id: "landing-mechanics",
        title: "Landing Mechanics Mastery",
        slug: "landing-mechanics",
        primaryKeyword: "proper landing technique kids",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "vertical-jump",
        title: "Vertical Jump Training for Youth",
        slug: "vertical-jump-training",
        primaryKeyword: "how to increase vertical jump kids",
        pageType: "plan",
        riskLevel: "medium",
      },
      {
        id: "plyometric-tests",
        title: "Jump Testing & Benchmarks",
        slug: "jump-tests",
        primaryKeyword: "vertical jump test for kids",
        pageType: "test",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["strength-foundation", "speed-agility", "injury-prevention"],
  },

  INJURY_PREVENTION: {
    id: "injury-prevention",
    title: "Youth Injury Prevention & Warm-Up System",
    slug: "injury-prevention",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "injury prevention warm up youth",
    secondaryKeywords: [
      "ACL prevention program youth",
      "dynamic warm up for kids",
      "prehab exercises for young athletes",
      "neuromuscular warm up",
      "FIFA 11+ for kids",
    ],
    intentPatterns: [
      "how to prevent {injury} in youth athletes",
      "{injury} prevention exercises",
      "warm up for {sport} youth",
      "prehab for {body_part}",
      "ACL prevention for {sport}",
    ],

    category: "safety",
    riskLevel: "medium",
    supportedPageTypes: ["drill", "plan", "checklist", "injury_guide"],

    safetyRules: [
      {
        condition: "Current pain or injury",
        action: "refer",
        message: "Get cleared by a healthcare provider before prevention work",
      },
      {
        condition: "History of ACL injury",
        action: "modify",
        message: "Follow post-rehab prevention protocol from your PT",
      },
    ],

    directAnswer:
      "Research-backed warm-up programs like FIFA 11+ can reduce youth sports injuries by 30-50%. Effective injury prevention includes dynamic warm-up, neuromuscular training, landing mechanics, and sport-specific movement prep. The key is consistency—these programs only work when done before every practice and game.",

    overview:
      "Evidence-based injury prevention system for youth athletes. Includes dynamic warm-up protocols, neuromuscular training, ACL prevention, and sport-specific prehab routines.",

    evidenceBase: [
      "Soligard T, et al. FIFA 11+ injury prevention (BMJ, 2008)",
      "Emery CA, et al. Neuromuscular training for youth (BJSM, 2015)",
      "Myer GD, et al. ACL prevention in female athletes (AJSM, 2013)",
    ],

    spokes: [
      {
        id: "dynamic-warmup",
        title: "Dynamic Warm-Up Templates by Sport",
        slug: "dynamic-warmup",
        primaryKeyword: "dynamic warm up for kids",
        pageType: "checklist",
        riskLevel: "low",
      },
      {
        id: "acl-prevention",
        title: "ACL Prevention Program for Youth",
        slug: "acl-prevention",
        primaryKeyword: "ACL prevention exercises youth",
        pageType: "plan",
        riskLevel: "medium",
      },
      {
        id: "severs-guide",
        title: "Heel Pain (Sever's Disease) Guide",
        slug: "severs-disease",
        primaryKeyword: "severs disease treatment",
        pageType: "injury_guide",
        riskLevel: "medical_referral",
      },
      {
        id: "osgood-guide",
        title: "Knee Pain (Osgood-Schlatter) Guide",
        slug: "osgood-schlatter",
        primaryKeyword: "osgood schlatter exercises",
        pageType: "injury_guide",
        riskLevel: "medical_referral",
      },
    ],

    relatedHubs: ["load-management", "recovery", "barefoot-reset"],
  },

  LOAD_MANAGEMENT: {
    id: "load-management",
    title: "Training Load & Overuse Prevention",
    slug: "load-management",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "overuse injury prevention youth",
    secondaryKeywords: [
      "how much training is too much for kids",
      "youth sports burnout prevention",
      "pitch count rules youth baseball",
      "rest days for young athletes",
      "specialization vs multi-sport",
    ],
    intentPatterns: [
      "how many {activities} per week for {age} year old",
      "is my kid {training} too much",
      "signs of {overuse} in youth athletes",
      "when to take a break from {sport}",
      "{specialization} vs {multi_sport}",
    ],

    category: "safety",
    riskLevel: "low",
    supportedPageTypes: ["faq", "checklist", "plan", "mythbuster"],

    safetyRules: [
      {
        condition: "Pain that persists more than 2 weeks",
        action: "refer",
        message: "See a sports medicine professional",
      },
      {
        condition: "Participating in same sport year-round",
        action: "modify",
        message: "Consider off-season breaks and cross-training",
      },
    ],

    directAnswer:
      "Youth athletes should generally train their sport no more hours per week than their age (e.g., a 12-year-old: max 12 hours/week). Research shows that early specialization increases overuse injury risk, while multi-sport participation builds broader athletic skills and reduces burnout. Key warning signs include persistent pain, declining performance, and loss of enthusiasm.",

    overview:
      "Guidelines for managing training load in youth athletes to prevent overuse injuries and burnout. Covers weekly limits, rest recommendations, specialization decisions, and warning signs.",

    evidenceBase: [
      "Brenner JS, et al. Overuse injuries in youth (Pediatrics, 2007)",
      "DiFiori JP, et al. Overuse injuries and burnout in youth sports (BJSM, 2014)",
      "Myer GD, et al. Early sport specialization (AJSM, 2015)",
    ],

    spokes: [
      {
        id: "weekly-limits",
        title: "Weekly Training Limits by Age",
        slug: "training-limits",
        primaryKeyword: "how many hours of sports per week",
        pageType: "checklist",
        riskLevel: "low",
      },
      {
        id: "overuse-signs",
        title: "Signs of Overtraining in Kids",
        slug: "overtraining-signs",
        primaryKeyword: "overtraining symptoms in youth athletes",
        pageType: "checklist",
        riskLevel: "low",
      },
      {
        id: "specialization",
        title: "Sport Specialization: When & Why",
        slug: "sport-specialization",
        primaryKeyword: "youth sport specialization age",
        pageType: "faq",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["injury-prevention", "recovery", "strength-foundation"],
  },

  RECOVERY: {
    id: "recovery",
    title: "Recovery Essentials for Young Athletes",
    slug: "recovery",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "recovery for young athletes",
    secondaryKeywords: [
      "sleep for teen athletes",
      "muscle soreness relief for kids",
      "rest days for youth athletes",
      "tournament recovery plan",
      "how much sleep do athletes need",
    ],
    intentPatterns: [
      "how to recover from {activity} faster",
      "sore {body_part} after {sport}",
      "how much sleep for {age} year old athlete",
      "tournament {recovery} plan",
      "{recovery} tips for youth athletes",
    ],

    category: "recovery",
    riskLevel: "low",
    supportedPageTypes: ["checklist", "plan", "faq"],

    safetyRules: [
      {
        condition: "Severe or worsening pain",
        action: "refer",
        message: "Consult a healthcare provider if pain doesn't improve with rest",
      },
    ],

    directAnswer:
      "Recovery is when adaptation happens. Teen athletes need 8-10 hours of sleep per night for optimal recovery and performance. Beyond sleep, effective recovery includes proper nutrition timing, active recovery activities, and scheduled rest days. Tournament weekends require special planning to manage multiple games in short timeframes.",

    overview:
      "Complete recovery guide for youth athletes covering sleep, nutrition timing, active recovery, and tournament management.",

    evidenceBase: [
      "Hirshkowitz M, et al. Sleep duration recommendations (Sleep Health, 2015)",
      "Halson SL. Sleep and athletic performance (BJSM, 2014)",
    ],

    spokes: [
      {
        id: "sleep-guide",
        title: "Sleep Guide for Teen Athletes",
        slug: "athlete-sleep",
        primaryKeyword: "how much sleep do teen athletes need",
        pageType: "faq",
        riskLevel: "low",
      },
      {
        id: "tournament-recovery",
        title: "Tournament Weekend Recovery Plan",
        slug: "tournament-recovery",
        primaryKeyword: "recovery between games tournament",
        pageType: "plan",
        riskLevel: "low",
      },
      {
        id: "soreness-guide",
        title: "Managing Muscle Soreness in Kids",
        slug: "muscle-soreness",
        primaryKeyword: "sore muscles after practice kids",
        pageType: "faq",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["load-management", "injury-prevention", "nutrition"],
  },

  TESTING_BENCHMARKS: {
    id: "testing-benchmarks",
    title: "Youth Performance Testing & Benchmarks",
    slug: "performance-testing",

    author: "james",
    authorName: "James Scott",
    authorRole: "Performance Director",
    authorCredentials: "MS Exercise Science, CSCS",

    primaryKeyword: "fitness test for kids",
    secondaryKeywords: [
      "vertical jump test kids",
      "40 yard dash average by age",
      "agility test for youth",
      "flexibility test for kids",
      "youth athlete assessment",
    ],
    intentPatterns: [
      "average {metric} for {age} year old",
      "how to test {metric} at home",
      "{test} norms by age",
      "youth athlete {assessment}",
      "{sport} fitness test for kids",
    ],

    category: "testing",
    riskLevel: "low",
    supportedPageTypes: ["test", "checklist", "faq"],

    safetyRules: [
      {
        condition: "Testing with pain or injury",
        action: "stop",
        message: "Don't test until fully recovered",
      },
      {
        condition: "No warm-up before max effort tests",
        action: "stop",
        message: "Always warm up thoroughly before performance testing",
      },
    ],

    directAnswer:
      "Performance testing helps track progress and identify areas for improvement. Key tests for youth athletes include vertical jump (power), 10-20 yard sprint (acceleration), T-test or 5-10-5 (agility), and basic flexibility assessments. Test 2-4 times per year and focus on improvement from baseline—not comparison to others.",

    overview:
      "A practical guide to testing youth athletic performance at home or in training. Includes test protocols, age-appropriate benchmarks, and tracking templates.",

    evidenceBase: [
      "Faigenbaum AD, et al. Youth fitness testing (ACSM, 2020)",
      "Lloyd RS, et al. Youth physical development (Strength Cond J, 2014)",
    ],

    spokes: [
      {
        id: "vertical-test",
        title: "Vertical Jump Test & Norms",
        slug: "vertical-jump-test",
        primaryKeyword: "vertical jump test for kids",
        pageType: "test",
        riskLevel: "low",
      },
      {
        id: "sprint-test",
        title: "Sprint Testing (10-40 yard)",
        slug: "sprint-test",
        primaryKeyword: "40 yard dash time by age",
        pageType: "test",
        riskLevel: "low",
      },
      {
        id: "agility-test",
        title: "Agility Tests (T-Test, 5-10-5)",
        slug: "agility-test",
        primaryKeyword: "agility test for youth athletes",
        pageType: "test",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["speed-agility", "strength-foundation", "plyometrics"],
  },

  NUTRITION: {
    id: "nutrition",
    title: "Sports Nutrition for Youth Athletes",
    slug: "nutrition",

    author: "editorial",
    authorName: "YouthPerformance Editorial",
    authorRole: "Safety Board",
    authorCredentials: "Expert-reviewed content based on AAP guidelines",
    reviewer: "james",

    primaryKeyword: "sports nutrition for kids",
    secondaryKeywords: [
      "pre game meal for youth athletes",
      "post workout snacks for kids",
      "hydration for young athletes",
      "protein for teen athletes",
      "what should athletes eat before a game",
    ],
    intentPatterns: [
      "what to eat before {sport}",
      "best {meal_type} for young athletes",
      "how much {nutrient} for {age} year old athlete",
      "{timing} nutrition for sports",
      "healthy {snacks} for athletes",
    ],

    category: "recovery",
    riskLevel: "low",
    supportedPageTypes: ["checklist", "faq", "plan"],

    safetyRules: [
      {
        condition: "Eating disorders or disordered eating patterns",
        action: "refer",
        message: "Consult a healthcare provider and registered dietitian",
      },
      {
        condition: "Supplement recommendations",
        action: "stop",
        message: "We don't recommend supplements for youth athletes",
      },
    ],
    disclaimer:
      "Nutrition information is educational only. Consult a registered dietitian for personalized advice.",

    directAnswer:
      "Youth athletes need balanced nutrition with adequate carbohydrates for energy, protein for growth and recovery, and proper hydration. Pre-game meals should be eaten 2-3 hours before competition and focus on familiar, easily digested foods. Post-workout nutrition within 30-60 minutes helps recovery. Most young athletes don't need supplements—real food is sufficient.",

    overview:
      "Evidence-based nutrition guidance for youth athletes. Covers pre-game meals, post-workout nutrition, hydration, and common myths—without supplement pushing.",

    evidenceBase: [
      "AAP Committee on Nutrition. Sports drinks and energy drinks (Pediatrics, 2011)",
      "Purcell LK. Sport nutrition for young athletes (Paediatr Child Health, 2013)",
    ],

    spokes: [
      {
        id: "pre-game-meals",
        title: "Pre-Game Meal Ideas by Sport",
        slug: "pre-game-meals",
        primaryKeyword: "what to eat before a game",
        pageType: "checklist",
        riskLevel: "low",
      },
      {
        id: "hydration-guide",
        title: "Hydration Guide for Youth Sports",
        slug: "hydration",
        primaryKeyword: "hydration for young athletes",
        pageType: "faq",
        riskLevel: "low",
      },
      {
        id: "post-workout",
        title: "Post-Workout Nutrition for Kids",
        slug: "post-workout-nutrition",
        primaryKeyword: "post game snacks for kids",
        pageType: "checklist",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["recovery", "load-management"],
  },

  // =========================================================================
  // ADAM HARRINGTON: THE BASKETBALL SPECIALIST (4 Hubs)
  // =========================================================================

  BASKETBALL_SKILLS_LAB: {
    id: "basketball-skills",
    title: "Youth Basketball Skills Lab",
    slug: "basketball-skills",

    author: "adam",
    authorName: "Adam Harrington",
    authorRole: "Skill Director",
    authorCredentials: "NBA Skills Coach, 20+ years basketball development",

    primaryKeyword: "youth basketball drills",
    secondaryKeywords: [
      "basketball training for kids",
      "dribbling drills for youth",
      "ball handling exercises",
      "basketball practice plan",
      "basketball skills for beginners",
    ],
    intentPatterns: [
      "{skill} drills for {age} year olds",
      "how to improve {skill} basketball",
      "{skill} basketball drills at home",
      "basketball {skill} for beginners",
      "{position} skills for youth",
    ],

    category: "skill",
    riskLevel: "low",
    supportedPageTypes: ["drill", "plan", "progression"],

    safetyRules: [
      {
        condition: "Finger/hand injury",
        action: "modify",
        message: "Avoid ball-handling drills until cleared",
      },
    ],

    directAnswer:
      "Youth basketball development should focus on skill mastery before complex plays. The fundamentals—ball handling, shooting form, footwork, and passing—transfer across all positions and ages. Practice quality over quantity: 20 focused minutes beats 60 distracted minutes. Film yourself regularly to catch bad habits early.",

    overview:
      "Complete basketball skills development system for youth players. Covers ball handling, shooting, finishing, footwork, and practice design principles.",

    evidenceBase: [
      "Harrington, A. NBA shooting coach methodology",
      "USA Basketball Youth Development Guidelines",
    ],

    spokes: [
      {
        id: "ball-handling",
        title: "Ball Handling Progression",
        slug: "ball-handling",
        primaryKeyword: "dribbling drills for kids",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "footwork",
        title: "Basketball Footwork Drills",
        slug: "basketball-footwork",
        primaryKeyword: "basketball footwork drills youth",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "passing",
        title: "Passing Drills for Youth Basketball",
        slug: "passing-drills",
        primaryKeyword: "passing drills basketball youth",
        pageType: "drill",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["shooting-mechanics", "silent-basketball", "girls-basketball"],
  },

  SHOOTING_MECHANICS: {
    id: "shooting-mechanics",
    title: "Shooting Mechanics Fix System",
    slug: "shooting-mechanics",

    author: "adam",
    authorName: "Adam Harrington",
    authorRole: "Skill Director",
    authorCredentials: "NBA Skills Coach, 20+ years basketball development",

    primaryKeyword: "how to fix shooting form basketball",
    secondaryKeywords: [
      "guide hand shooting fix",
      "elbow alignment basketball",
      "shooting arc basketball",
      "one motion vs two motion shot",
      "basketball shooting form for kids",
    ],
    intentPatterns: [
      "how to fix {issue} in basketball shot",
      "{mechanic} shooting drill",
      "why does my shot {problem}",
      "shooting form for {age} year olds",
      "{shot_type} form basketball",
    ],

    category: "skill",
    riskLevel: "low",
    supportedPageTypes: ["drill", "progression", "faq", "mythbuster"],

    safetyRules: [],

    directAnswer:
      "The three most common shooting form issues in youth basketball are: (1) guide hand interference—the non-shooting hand should release cleanly without pushing, (2) elbow flare—keep the elbow under the ball, aligned with the basket, and (3) inconsistent release point—develop a repeatable release through deliberate practice. Fix one thing at a time, starting with the guide hand.",

    overview:
      "A systematic approach to diagnosing and fixing basketball shooting mechanics. Covers guide hand, elbow alignment, release point, arc, and common myths about shooting form.",

    evidenceBase: [
      "Harrington, A. NBA shooting methodology",
      "Button C, et al. Motor learning in sports skills (Sports Med, 2012)",
    ],

    spokes: [
      {
        id: "guide-hand-fix",
        title: "Guide Hand Fix System",
        slug: "guide-hand-fix",
        primaryKeyword: "guide hand shooting basketball",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "elbow-alignment",
        title: "Elbow Alignment System",
        slug: "elbow-alignment",
        primaryKeyword: "elbow in shooting form",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "release-point",
        title: "Consistent Release Point Drills",
        slug: "release-point",
        primaryKeyword: "basketball release point",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "shooting-myths",
        title: "Shooting Form Myths Busted",
        slug: "shooting-myths",
        primaryKeyword: "basketball shooting myths",
        pageType: "mythbuster",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["basketball-skills", "silent-basketball"],
  },

  SILENT_BASKETBALL: {
    id: "silent-basketball",
    title: "Silent Basketball Training System",
    slug: "silent-basketball",

    author: "adam",
    authorName: "Adam Harrington",
    authorRole: "Skill Director",
    authorCredentials: "NBA Skills Coach, 20+ years basketball development",

    primaryKeyword: "silent basketball drills",
    secondaryKeywords: [
      "apartment basketball training",
      "basketball drills without dribbling",
      "quiet basketball practice",
      "indoor basketball drills no hoop",
      "basketball training at home",
    ],
    intentPatterns: [
      "{skill} drills without {limitation}",
      "basketball training in {location}",
      "quiet {drill_type} basketball",
      "no {equipment} basketball drills",
      "apartment-friendly {activity}",
    ],

    category: "skill",
    riskLevel: "low",
    supportedPageTypes: ["drill", "plan", "checklist"],

    safetyRules: [
      {
        condition: "Limited ceiling height",
        action: "modify",
        message: "Avoid any drills requiring ball release above head",
      },
    ],

    directAnswer:
      "You can develop serious basketball skills without a hoop, gym, or making noise. Silent training focuses on: (1) form shooting into a couch/bed, (2) ball handling with a tennis ball, (3) footwork patterns, (4) core and leg strength for explosion, and (5) visualization and film study. Many NBA players did their early development in small spaces.",

    overview:
      "Complete basketball development system for apartments, hotels, and spaces where you can't dribble or shoot. Proves you don't need a gym to get better.",

    evidenceBase: [
      "Harrington, A. Home training methodology",
      "Motor learning research on blocked vs random practice",
    ],

    spokes: [
      {
        id: "form-shooting-silent",
        title: "Silent Form Shooting Drills",
        slug: "silent-form-shooting",
        primaryKeyword: "shooting practice without a hoop",
        pageType: "drill",
        riskLevel: "low",
      },
      {
        id: "tennis-ball-handling",
        title: "Tennis Ball Handling Progression",
        slug: "tennis-ball-handling",
        primaryKeyword: "tennis ball dribbling drills",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "hotel-workout",
        title: "Hotel Room Basketball Workout",
        slug: "hotel-basketball-workout",
        primaryKeyword: "basketball workout hotel room",
        pageType: "plan",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["basketball-skills", "shooting-mechanics"],
  },

  GIRLS_BASKETBALL: {
    id: "girls-basketball",
    title: "Girls Basketball Training Blueprint",
    slug: "girls-basketball",

    author: "adam",
    authorName: "Adam Harrington",
    authorRole: "Skill Director",
    authorCredentials: "NBA Skills Coach, 20+ years basketball development",
    reviewer: "james", // For ACL prevention content

    primaryKeyword: "girls basketball training",
    secondaryKeywords: [
      "basketball drills for girls",
      "female athlete basketball",
      "WNBA training methods",
      "ACL prevention basketball girls",
      "girls basketball skills",
    ],
    intentPatterns: [
      "{skill} for girls basketball",
      "girls basketball {training_type}",
      "female athlete {topic}",
      "{injury_prevention} for girls basketball",
      "best {drills} for girls basketball",
    ],

    category: "skill",
    riskLevel: "low",
    supportedPageTypes: ["drill", "plan", "progression", "faq"],

    safetyRules: [
      {
        condition: "Female athletes have higher ACL injury rates",
        action: "modify",
        message: "Include neuromuscular training in all programs",
      },
    ],

    directAnswer:
      "Girls basketball training should emphasize the same skill development as boys—ball handling, shooting mechanics, and footwork—while incorporating injury prevention specific to female athletes. ACL injuries are 2-8x more common in female athletes, making neuromuscular training and landing mechanics essential. The fundamentals are identical; the injury prevention protocol should be enhanced.",

    overview:
      "Skills development and injury prevention for female basketball players. Covers technique, ACL prevention, and addresses common coaching gaps in girls basketball.",

    evidenceBase: [
      "Myer GD, et al. ACL injuries in female athletes (AJSM, 2013)",
      "Hewett TE, et al. Neuromuscular training for female athletes (AJSM, 2006)",
    ],

    spokes: [
      {
        id: "girls-skills",
        title: "Skills Development for Girls Basketball",
        slug: "girls-basketball-skills",
        primaryKeyword: "basketball skills for girls",
        pageType: "progression",
        riskLevel: "low",
      },
      {
        id: "girls-acl-prevention",
        title: "ACL Prevention for Female Basketball Players",
        slug: "acl-prevention-girls-basketball",
        primaryKeyword: "ACL prevention basketball girls",
        pageType: "plan",
        riskLevel: "medium",
      },
      {
        id: "girls-training-program",
        title: "Complete Girls Basketball Training Program",
        slug: "girls-basketball-program",
        primaryKeyword: "girls basketball training program",
        pageType: "plan",
        riskLevel: "low",
      },
    ],

    relatedHubs: ["basketball-skills", "injury-prevention", "strength-foundation"],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all anchor entities as an array
 */
export function getAllAnchors(): AnchorEntity[] {
  return Object.values(ANCHOR_ENTITIES);
}

/**
 * Get anchors by author
 */
export function getAnchorsByAuthor(author: Author): AnchorEntity[] {
  return getAllAnchors().filter((a) => a.author === author);
}

/**
 * Get anchors by category
 */
export function getAnchorsByCategory(category: Category): AnchorEntity[] {
  return getAllAnchors().filter((a) => a.category === category);
}

/**
 * Get all spokes from all anchors
 */
export function getAllSpokes(): (SpokeEntity & { parentHub: string })[] {
  const spokes: (SpokeEntity & { parentHub: string })[] = [];
  for (const anchor of getAllAnchors()) {
    for (const spoke of anchor.spokes) {
      spokes.push({ ...spoke, parentHub: anchor.slug });
    }
  }
  return spokes;
}

/**
 * Get total entity count (anchors + spokes)
 */
export function getTotalEntityCount(): { anchors: number; spokes: number; total: number } {
  const anchors = getAllAnchors().length;
  const spokes = getAllSpokes().length;
  return { anchors, spokes, total: anchors + spokes };
}

/**
 * Get anchor by slug
 */
export function getAnchorBySlug(slug: string): AnchorEntity | undefined {
  return getAllAnchors().find((a) => a.slug === slug);
}

/**
 * Get hub relationship graph (for internal linking)
 */
export function getHubGraph(): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const anchor of getAllAnchors()) {
    graph.set(anchor.slug, anchor.relatedHubs);
  }
  return graph;
}
