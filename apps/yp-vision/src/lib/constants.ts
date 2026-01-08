// Hardcoded "Live" Data for MVP
// CEO Note: "Simulated Live" is fine for Series A pitch

export const METRICS = {
  arr: 1200000,
  users: 15000,
  retention: 88,
  nps: 72,
  ballsSold: 8500,
  workoutsToday: 1247,
  countriesActive: 12,
};

export const UNIT_ECONOMICS = {
  cac: 42,
  ltv: 380,
  paybackMonths: 3.2,
  grossMargin: 68,
  churnRate: 2.1,
};

export const INVESTOR_QA: Record<string, string> = {
  retention:
    "We retain 88% of users after 3 months. Hardware owners churn 4x less than app-only users. The ball creates stickiness—it's sitting in their garage, reminding them to train.",
  cac:
    "Blended CAC is $42. Organic is $18 (TikTok virality), paid is $65. LTV is $380. We're profitable on first purchase and expand through subscriptions.",
  moat:
    "Three layers: 1) Hardware lock-in (they own the ball), 2) Data moat (millions of training sessions powering our AI), 3) Brand (Wolf Pack identity). Competitors can copy the ball, not the community.",
  market:
    "Youth sports training is a $40B market. We're targeting the 'serious recreational' segment—kids who want to go pro but whose families can't afford $200/hr trainers.",
  team:
    "Founded by D1 athletes and ex-Peloton engineers. We've built consumer hardware before and know how to create cult brands in fitness.",
};

export const LIVE_TICKER_ITEMS = [
  "Josh S. just completed 'Vertical Jump 101' in Ohio",
  "1,247 athletes training right now",
  "New PR set by Sarah M. - 32in vertical",
  "Pack growing: 847 new members this week",
  "Silent Ball shipped to Brazil - going global",
  "Marcus D. earned 'Iron Chassis' badge",
  "Coach AI: 12,000 form corrections today",
];

export const GROWTH_DATA = [
  { month: "Jan", arr: 180000, users: 2100 },
  { month: "Feb", arr: 280000, users: 3200 },
  { month: "Mar", arr: 420000, users: 5100 },
  { month: "Apr", arr: 580000, users: 7200 },
  { month: "May", arr: 780000, users: 9800 },
  { month: "Jun", arr: 920000, users: 11500 },
  { month: "Jul", arr: 1050000, users: 13200 },
  { month: "Aug", arr: 1200000, users: 15000 },
];

export const COHORT_DATA = [
  { month: 0, retention: 100 },
  { month: 1, retention: 94 },
  { month: 2, retention: 91 },
  { month: 3, retention: 88 },
  { month: 4, retention: 86 },
  { month: 5, retention: 85 },
  { month: 6, retention: 84 },
];

export const CONTACT = {
  email: "mike@youthperformance.com",
  deckUrl: "https://docsend.com/yp-series-a",
};
