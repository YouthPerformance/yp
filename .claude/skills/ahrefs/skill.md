# /ahrefs - SEO Intelligence Skill

Use this skill to research keywords, analyze competitors, and find content opportunities using the Ahrefs API.

## When to Use

- Finding keywords to target for new content
- Analyzing what competitors rank for
- Identifying content gaps
- Validating keyword search volumes
- Building content strategy with data

## Commands

### Keyword Research
```
/ahrefs keywords "youth speed training"
```
Returns: search volume, difficulty, CPC, related keywords

### Keyword Gap Analysis
```
/ahrefs gap youthperformance.com overtimeathletes.com
```
Returns: keywords competitor ranks for that we don't

### Content Opportunities
```
/ahrefs opportunities "barefoot training"
```
Returns: low-difficulty, high-volume keywords to target

### Backlink Analysis
```
/ahrefs backlinks overtimeathletes.com
```
Returns: backlink count, referring domains, domain rating

## Implementation

The skill uses the Ahrefs API v3. Credentials:
- Token: `AHREFS_API_TOKEN`
- Key: `AHREFS_API_KEY`

Store these in `.env` or pass directly.

## Output Format

Results are returned as JSON with:
- `keywords`: Array of keyword objects
- `metrics`: Volume, difficulty, CPC data
- `opportunities`: Filtered low-competition keywords

## Integration

This skill integrates with:
- `CONTENT_STRATEGY.md` - Validates keyword targets
- `ARTICLE_BRIEFS.md` - Provides data for briefs
- Content dashboard - Real-time keyword tracking
