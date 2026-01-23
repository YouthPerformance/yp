import fs from 'fs';
import path from 'path';
import type { Gap } from './ahrefs';

// Reuse detection logic from ahrefs.ts
// These are duplicated here to avoid circular imports and keep CSV parser self-contained

const TARGET_CLUSTERS: Record<string, string[]> = {
  // SILENT BASKETBALL - check FIRST (most specific, highest priority)
  'silent-basketball': ['silent', 'quiet', 'no bounce', 'without bouncing', 'no noise', 'apartment', 'upstairs', 'hotel'],
  // Other clusters
  'home-training': ['home', 'indoor', 'no hoop', 'small space'],
  'shooting': ['shooting', 'shot', 'form', 'accuracy', 'free throw'],
  'ball-handling': ['dribbling', 'ball handling', 'handles', 'crossover'],
  'footwork': ['footwork', 'feet', 'movement', 'agility'],
  'barefoot': ['barefoot', 'foot strength', 'toe', 'ankle', 'flat feet'],
  'injury-prevention': ['injury', 'prevent', 'sever', 'knee', 'ankle sprain'],
  'speed-agility': ['speed', 'agility', 'quick', 'fast', 'acceleration'],
  'youth-development': ['youth', 'kids', 'children', 'young', 'beginner'],
};

function detectAgeGroup(keyword: string): string | undefined {
  const agePatterns = [
    { pattern: /\b(5|6|7)\s*(year|yr)/, group: '5-7' },
    { pattern: /\b(7|8|9)\s*(year|yr)/, group: '7-9' },
    { pattern: /\b(8|9|10)\s*(year|yr)/, group: '8-10' },
    { pattern: /\b(10|11|12)\s*(year|yr)/, group: '10-12' },
    { pattern: /\b(13|14|15)\s*(year|yr)/, group: '13-15' },
    { pattern: /\b(16|17|18)\s*(year|yr)/, group: '16-18' },
    { pattern: /\bkids?\b/i, group: '7-12' },
    { pattern: /\byouth\b/i, group: '8-14' },
    { pattern: /\bteen/i, group: '13-18' },
    { pattern: /\belementary/i, group: '6-10' },
    { pattern: /\bmiddle school/i, group: '11-14' },
    { pattern: /\bhigh school/i, group: '14-18' },
  ];

  for (const { pattern, group } of agePatterns) {
    if (pattern.test(keyword)) return group;
  }
  return undefined;
}

function detectSport(keyword: string): string {
  const kw = keyword.toLowerCase();
  if (kw.includes('basketball') || kw.includes('hoop') || kw.includes('dribbl')) return 'basketball';
  if (kw.includes('soccer') || (kw.includes('football') && !kw.includes('american'))) return 'soccer';
  if (kw.includes('football') || kw.includes('quarterback')) return 'football';
  if (kw.includes('baseball') || kw.includes('batting')) return 'baseball';
  if (kw.includes('barefoot') || kw.includes('foot strength')) return 'barefoot';
  return 'general';
}

function detectCluster(keyword: string): string {
  const kw = keyword.toLowerCase();
  for (const [cluster, patterns] of Object.entries(TARGET_CLUSTERS)) {
    if (patterns.some(p => kw.includes(p))) return cluster;
  }
  return 'general';
}

function detectIntent(keyword: string): Gap['intent'] {
  const kw = keyword.toLowerCase();
  if (kw.includes('buy') || kw.includes('price') || kw.includes('cost')) return 'transactional';
  if (kw.includes('best') || kw.includes('review') || kw.includes('vs')) return 'commercial';
  if (kw.includes('how') || kw.includes('what') || kw.includes('why') || kw.includes('drill')) return 'informational';
  return 'informational';
}

// ============================================================================
// CSV GAP MINER
// Ingests Ahrefs CSV exports - the "Free Intelligence" path
// ============================================================================

export class CsvGapMiner {
  async getGaps(importPath: string): Promise<Gap[]> {
    console.log(`📂 Scanning for CSVs in: ${importPath}`);

    // 1. Find CSV files
    let files: string[] = [];
    if (fs.existsSync(importPath) && fs.lstatSync(importPath).isDirectory()) {
      files = fs.readdirSync(importPath)
        .filter(f => f.endsWith('.csv'))
        .map(f => path.join(importPath, f));
    } else if (fs.existsSync(importPath) && importPath.endsWith('.csv')) {
      files = [importPath];
    }

    if (files.length === 0) {
      console.warn('⚠️  No CSV files found. Export keywords from Ahrefs and drop them in.');
      return [];
    }

    const allGaps: Gap[] = [];

    // 2. Process each file
    for (const file of files) {
      console.log(`   Reading ${path.basename(file)}...`);
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split(/\r?\n/);

      // Find header row (Ahrefs exports vary, look for "Keyword")
      const headerIndex = lines.findIndex(l =>
        l.toLowerCase().includes('keyword') && l.toLowerCase().includes('volume')
      );

      if (headerIndex === -1) {
        console.warn(`   ⚠️  Skipping ${path.basename(file)}: Could not find header row`);
        continue;
      }

      // Map columns
      const headers = this.parseLine(lines[headerIndex]);
      const colMap = {
        keyword: headers.findIndex(h => h.toLowerCase().trim() === 'keyword'),
        volume: headers.findIndex(h => h.toLowerCase().trim() === 'volume'),
        kd: headers.findIndex(h =>
          h.toLowerCase().includes('difficulty') ||
          h.toLowerCase().trim() === 'kd'
        ),
      };

      // Validate we found required columns
      if (colMap.keyword === -1) {
        console.warn(`   ⚠️  Skipping ${path.basename(file)}: No 'Keyword' column found`);
        continue;
      }

      let parsed = 0;
      let skipped = 0;

      // Parse rows
      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = this.parseLine(line);

        // Extract and clean keyword (remove wrapping quotes)
        const keyword = cols[colMap.keyword]?.replace(/^"|"$/g, '').trim();
        const volume = parseInt(cols[colMap.volume] || '0', 10);
        const difficulty = parseInt(cols[colMap.kd] || '0', 10);

        // Skip junk rows
        if (!keyword || keyword.length < 3 || volume < 10) {
          skipped++;
          continue;
        }

        // Build gap with auto-enrichment
        allGaps.push({
          keyword,
          volume,
          difficulty: isNaN(difficulty) ? 0 : difficulty,
          intent: detectIntent(keyword),
          cluster: detectCluster(keyword),
          sport: detectSport(keyword),
          age_group: detectAgeGroup(keyword),
          source: 'ahrefs', // Mark as ahrefs for typing compatibility
        });
        parsed++;
      }

      console.log(`   ✓ Parsed ${parsed} keywords (skipped ${skipped} low-value rows)`);
    }

    console.log(`✅ Extracted ${allGaps.length} gaps from ${files.length} CSV file(s)`);
    return allGaps;
  }

  /**
   * Quote-aware CSV line parser
   * Handles "Drills, Fast" without breaking on the comma
   */
  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Toggle quote state
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Push last field
    result.push(current.trim());

    return result;
  }
}
