// ============================================================================
// GUARDRAILS - All checks must pass before publishing
// ============================================================================

export interface GuardrailResult {
  pass: boolean;
  checks: {
    uniqueness: { pass: boolean; score: number; reason?: string };
    hasAsset: { pass: boolean; assetType?: string; reason?: string };
    hasQuickAnswer: { pass: boolean; bulletCount?: number; reason?: string };
    youthSafe: { pass: boolean; issues?: string[]; reason?: string };
    hasInternalLinks: { pass: boolean; linkCount?: number; reason?: string };
  };
  overall_score: number;
}

// Blocked phrases for youth safety
const BLOCKED_PHRASES = [
  'cure', 'treat', 'diagnosis', 'medical advice',
  'guaranteed results', 'always works', 'never fails',
  'instant results', 'miracle', 'secret formula',
  'lose weight fast', 'bulk up quick',
];

// Required disclaimers by topic
const REQUIRED_DISCLAIMERS: Record<string, string> = {
  injury: 'Consult a healthcare professional before starting any new exercise program, especially if recovering from injury.',
  pain: 'If pain persists or worsens, stop immediately and consult a healthcare provider.',
  nutrition: 'Individual nutritional needs vary. Consult a registered dietitian for personalized advice.',
  growth: 'Young athletes are still developing. Always prioritize proper form over intensity.',
};

// Valid unique asset types
const VALID_ASSETS = [
  'session-builder-embed',
  'drill-picker-embed',
  'hydration-calculator-embed',
  'miss-analyzer-embed',
  'r3-progress-tracker',
  'coach-corner-tip',
  'proprietary-drill-variant',
  'first-party-stat',
  'video-embed',
];

export function runGuardrails(page: {
  title: string;
  content: string;
  quick_answer?: string[];
  asset_type?: string;
  internal_links?: string[];
  uniqueness_score?: number;
}): GuardrailResult {
  const checks: GuardrailResult['checks'] = {
    uniqueness: { pass: false, score: 0 },
    hasAsset: { pass: false },
    hasQuickAnswer: { pass: false },
    youthSafe: { pass: false },
    hasInternalLinks: { pass: false },
  };

  // 1. Uniqueness Check
  const uniquenessScore = page.uniqueness_score ?? 100;
  checks.uniqueness = {
    pass: uniquenessScore >= 70,
    score: uniquenessScore,
    reason: uniquenessScore < 70 ? `Score ${uniquenessScore}% is below 70% threshold` : undefined,
  };

  // 2. Asset Check
  const hasValidAsset = page.asset_type && VALID_ASSETS.includes(page.asset_type);
  checks.hasAsset = {
    pass: hasValidAsset || false,
    assetType: page.asset_type,
    reason: !hasValidAsset ? 'No valid unique asset found' : undefined,
  };

  // 3. Quick Answer Check
  const bulletCount = page.quick_answer?.length ?? 0;
  checks.hasQuickAnswer = {
    pass: bulletCount >= 2 && bulletCount <= 6,
    bulletCount,
    reason: bulletCount < 2 ? 'Need at least 2 bullets' :
            bulletCount > 6 ? 'Too many bullets (max 6)' : undefined,
  };

  // 4. Youth Safety Check
  const contentLower = page.content.toLowerCase();
  const foundBlockedPhrases = BLOCKED_PHRASES.filter(phrase =>
    contentLower.includes(phrase.toLowerCase())
  );

  // Check for required disclaimers
  const missingDisclaimers: string[] = [];
  for (const [topic, disclaimer] of Object.entries(REQUIRED_DISCLAIMERS)) {
    if (contentLower.includes(topic) && !page.content.includes(disclaimer.substring(0, 30))) {
      missingDisclaimers.push(topic);
    }
  }

  checks.youthSafe = {
    pass: foundBlockedPhrases.length === 0 && missingDisclaimers.length === 0,
    issues: [...foundBlockedPhrases, ...missingDisclaimers.map(t => `missing ${t} disclaimer`)],
    reason: foundBlockedPhrases.length > 0 ?
            `Blocked phrases found: ${foundBlockedPhrases.join(', ')}` :
            missingDisclaimers.length > 0 ?
            `Missing disclaimers for: ${missingDisclaimers.join(', ')}` : undefined,
  };

  // 5. Internal Links Check
  const linkCount = page.internal_links?.length ?? 0;
  checks.hasInternalLinks = {
    pass: linkCount >= 3, // Pillar + 2 spokes
    linkCount,
    reason: linkCount < 3 ? `Need at least 3 internal links (found ${linkCount})` : undefined,
  };

  // Calculate overall
  const passCount = Object.values(checks).filter(c => c.pass).length;
  const totalChecks = Object.keys(checks).length;

  return {
    pass: passCount === totalChecks,
    checks,
    overall_score: Math.round((passCount / totalChecks) * 100),
  };
}
