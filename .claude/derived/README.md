# Derived Context Docs

> Sanitized, commit-safe versions of proprietary materials.

These files are **derived** from private source documents in `.claude/private/` (which is gitignored).

## Purpose

Agents need context about brand voices, content guidelines, and team members. The original documents contain proprietary information that shouldn't be committed to git. These derived guides extract the useful patterns while keeping sensitive details private.

## Files

| File | Source | Purpose |
|------|--------|---------|
| `adam-voice-guide.md` | Private Adam docs | Adam Harrington voice for content generation |
| `james-voice-guide.md` | Private James docs | James Scott voice for content generation |
| `mike-voice-guide.md` | Private Mike docs | Mike Di / Lawrence voice for public comms |

## Usage

Reference these in prompts or system instructions:

```
Read .claude/derived/adam-voice-guide.md for Adam's voice patterns.
```

## Relationship to Code

The TypeScript voice definitions in `packages/yp-alpha/src/voices/` are the **production** implementation used by the AI system. These markdown guides are for:

1. Agent context during content creation sessions
2. Quick human reference
3. Onboarding new team members

## Updating

When private source docs change:
1. Read the new private docs
2. Update these derived guides
3. Update the TS voice files if needed

## Security

- **Safe to commit:** These derived files contain no proprietary details
- **Never commit:** `.claude/private/*` (gitignored)
