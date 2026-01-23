// ============================================================================
// MOCK DATA FOR TESTING
// Allows testing the pipeline without Ahrefs API
// ============================================================================

import type { Gap } from '../gap-miner/sources/ahrefs';

export const MOCK_GAPS: Gap[] = [
  // Home Training (Adam)
  {
    keyword: 'basketball drills at home without hoop',
    source: 'ahrefs',
    volume: 2400,
    difficulty: 12,
    intent: 'informational',
    cluster: 'home-training',
    sport: 'basketball',
  },
  {
    keyword: 'quiet basketball drills for apartment',
    source: 'ahrefs',
    volume: 1800,
    difficulty: 8,
    intent: 'informational',
    cluster: 'home-training',
    sport: 'basketball',
  },
  {
    keyword: 'indoor basketball training for kids',
    source: 'ahrefs',
    volume: 1200,
    difficulty: 15,
    intent: 'informational',
    cluster: 'home-training',
    sport: 'basketball',
    age_group: '7-12',
  },

  // Shooting (Adam)
  {
    keyword: 'how to fix basketball shooting form',
    source: 'ahrefs',
    volume: 4800,
    difficulty: 22,
    intent: 'informational',
    cluster: 'shooting',
    sport: 'basketball',
  },
  {
    keyword: 'basketball free throw routine for youth',
    source: 'ahrefs',
    volume: 1600,
    difficulty: 10,
    intent: 'informational',
    cluster: 'shooting',
    sport: 'basketball',
    age_group: '10-14',
  },
  {
    keyword: 'shooting drills for 8 year olds',
    source: 'ahrefs',
    volume: 900,
    difficulty: 5,
    intent: 'informational',
    cluster: 'shooting',
    sport: 'basketball',
    age_group: '7-9',
  },

  // Ball Handling (Adam)
  {
    keyword: 'ball handling drills for beginners',
    source: 'ahrefs',
    volume: 3200,
    difficulty: 18,
    intent: 'informational',
    cluster: 'ball-handling',
    sport: 'basketball',
  },
  {
    keyword: 'how to improve dribbling skills at home',
    source: 'ahrefs',
    volume: 2100,
    difficulty: 14,
    intent: 'informational',
    cluster: 'ball-handling',
    sport: 'basketball',
  },

  // Barefoot (James)
  {
    keyword: 'barefoot training for youth athletes',
    source: 'ahrefs',
    volume: 800,
    difficulty: 6,
    intent: 'informational',
    cluster: 'barefoot',
    sport: 'barefoot',
  },
  {
    keyword: 'foot strengthening exercises for kids',
    source: 'ahrefs',
    volume: 1400,
    difficulty: 11,
    intent: 'informational',
    cluster: 'barefoot',
    sport: 'barefoot',
    age_group: '8-14',
  },
  {
    keyword: 'flat feet exercises for children',
    source: 'ahrefs',
    volume: 2200,
    difficulty: 19,
    intent: 'informational',
    cluster: 'barefoot',
    sport: 'barefoot',
    age_group: '6-12',
  },

  // Injury Prevention (James)
  {
    keyword: 'sever\'s disease exercises for athletes',
    source: 'ahrefs',
    volume: 1900,
    difficulty: 16,
    intent: 'informational',
    cluster: 'injury-prevention',
    sport: 'general',
    age_group: '10-14',
  },
  {
    keyword: 'youth athlete ankle strengthening',
    source: 'ahrefs',
    volume: 1100,
    difficulty: 9,
    intent: 'informational',
    cluster: 'injury-prevention',
    sport: 'general',
  },
  {
    keyword: 'how to prevent knee injuries in basketball',
    source: 'ahrefs',
    volume: 1500,
    difficulty: 21,
    intent: 'informational',
    cluster: 'injury-prevention',
    sport: 'basketball',
  },

  // Speed & Agility (James)
  {
    keyword: 'speed training for 10 year olds',
    source: 'ahrefs',
    volume: 1700,
    difficulty: 13,
    intent: 'informational',
    cluster: 'speed-agility',
    sport: 'general',
    age_group: '8-12',
  },
  {
    keyword: 'agility ladder drills for youth',
    source: 'ahrefs',
    volume: 2800,
    difficulty: 17,
    intent: 'informational',
    cluster: 'speed-agility',
    sport: 'general',
  },
  {
    keyword: 'how to get faster for basketball',
    source: 'ahrefs',
    volume: 2400,
    difficulty: 20,
    intent: 'informational',
    cluster: 'speed-agility',
    sport: 'basketball',
  },

  // Youth Development (James - catch-all)
  {
    keyword: 'youth strength training age guidelines',
    source: 'ahrefs',
    volume: 1300,
    difficulty: 14,
    intent: 'informational',
    cluster: 'youth-development',
    sport: 'general',
  },
  {
    keyword: 'when should kids start weight training',
    source: 'ahrefs',
    volume: 2600,
    difficulty: 23,
    intent: 'informational',
    cluster: 'youth-development',
    sport: 'general',
  },
  {
    keyword: 'athletic development for 7 year olds',
    source: 'ahrefs',
    volume: 700,
    difficulty: 7,
    intent: 'informational',
    cluster: 'youth-development',
    sport: 'general',
    age_group: '5-9',
  },
];

export function getMockGaps(): Gap[] {
  return MOCK_GAPS;
}
