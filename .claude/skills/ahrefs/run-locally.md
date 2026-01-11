# Running Ahrefs Locally

## Quick Setup (5 minutes)

### 1. Set Environment Variables

```bash
# Add to your ~/.zshrc or ~/.bashrc
export AHREFS_API_TOKEN="uU8BrpXwDwCdC7tAAg9vcsvuluUzDofkMjlX8pfD"
```

Then reload:
```bash
source ~/.zshrc
```

### 2. Install Dependencies

```bash
cd /path/to/yp
pnpm add -D tsx
```

### 3. Run Keyword Research

```bash
# Single keyword analysis
npx tsx .claude/skills/ahrefs/ahrefs-api.ts keyword "youth speed training"

# Keyword gap analysis
npx tsx .claude/skills/ahrefs/ahrefs-api.ts gap youthperformance.com overtimeathletes.com

# Find opportunities
npx tsx .claude/skills/ahrefs/ahrefs-api.ts opportunities "barefoot training"
```

### 4. Batch Keyword Research

Create a file `keywords-to-research.txt`:
```
youth speed training
youth agility training
youth strength training
first step quickness
landing mechanics
```

Run batch:
```bash
cat keywords-to-research.txt | while read keyword; do
  npx tsx .claude/skills/ahrefs/ahrefs-api.ts keyword "$keyword"
done > keyword-results.json
```

## Output Format

Results are JSON:
```json
{
  "keyword": "youth speed training",
  "volume": 8100,
  "difficulty": 38,
  "cpc": 2.45,
  "clicks": 6200,
  "related": [
    { "keyword": "speed drills for kids", "volume": 3200, "difficulty": 25 },
    { "keyword": "youth sprint training", "volume": 1800, "difficulty": 32 }
  ]
}
```

## Integrate with Dashboard

The dashboard at `/admin/content-strategy` can pull this data.
Just save results to `apps/web-academy/src/data/keywords.json` and import.
