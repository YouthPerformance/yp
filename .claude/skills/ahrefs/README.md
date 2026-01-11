# Ahrefs SEO Intelligence

Use this skill to analyze keywords, find content opportunities, and research competitors using the Ahrefs API.

## Available Commands

### Keyword Research
```
/ahrefs keywords <keyword> [--country=us]
```
Get search volume, keyword difficulty, and related keywords.

### Keyword Gap Analysis
```
/ahrefs gap <our-domain> <competitor-domain>
```
Find keywords competitors rank for that we don't.

### Content Opportunities
```
/ahrefs opportunities <topic>
```
Find low-competition, high-volume keywords for a topic.

### Backlink Analysis
```
/ahrefs backlinks <domain>
```
Analyze backlink profile of a domain.

## API Configuration

The Ahrefs API credentials are stored securely:
- API Token: Set via environment variable `AHREFS_API_TOKEN`
- API Key: Set via environment variable `AHREFS_API_KEY`

## Usage Examples

```bash
# Find keywords for youth speed training
/ahrefs keywords "youth speed training"

# Find gaps vs competitor
/ahrefs gap youthperformance.com overtimeathletes.com

# Find opportunities in barefoot training niche
/ahrefs opportunities "barefoot training for athletes"
```
