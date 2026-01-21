# SYNC Folder - Claude → Codex File Transfer

> Created: 2026-01-19
> Base commit: `5169f77` (Move 20: AI-Native Architecture)
> Target: Move 22-23 Enterprise Edition

## How to Apply

Codex should be on commit `5169f77`. Apply patches in order:

```bash
cd /path/to/yp-monorepo

# Apply each patch
git apply SYNC/01-anchor-entities.patch
git apply SYNC/02-generate-entity-matrix.patch
git apply SYNC/03-import-anchor-entities.patch
git apply SYNC/04-tsconfig.patch
git apply SYNC/05-package-json.patch
git apply SYNC/06-status.patch

# Install deps
cd packages/knowledge-graph
npm install

# Test
npx ts-node scripts/generate-entity-matrix.ts
npx ts-node scripts/import-anchor-entities.ts
```

## Patch Contents

| File | Lines | Description |
|------|-------|-------------|
| `01-anchor-entities.patch` | 1318 | **NEW FILE** - 13 Foundation Hubs with intent patterns |
| `02-generate-entity-matrix.patch` | 532 | Entity matrix generator v2 |
| `03-import-anchor-entities.patch` | 410 | Import script v2 |
| `04-tsconfig.patch` | 33 | **NEW FILE** - TypeScript config |
| `05-package-json.patch` | 12 | Added @types/node |
| `06-status.patch` | 144 | Updated STATUS.md |

## Expected Output After Apply

```
📊 Entity Matrix v2 Summary
══════════════════════════════════════════════════════

📌 By Entity Type:
   🏠 hub_page: 13
   🔗 spoke_page: 41
   ⚠️ safety_page: 52
   👶 age_variant: 52
   🔒 constraint_variant: 143

📊 Total Entities: 301
```

## If Patches Fail

If `git apply` fails (whitespace or context issues), use:

```bash
git apply --3way SYNC/01-anchor-entities.patch
```

Or apply with reject files:

```bash
git apply --reject SYNC/01-anchor-entities.patch
# Then manually resolve .rej files
```

## After Successful Apply

Commit with:

```bash
git add -A
git commit -m "Move 22-23: Enterprise Edition (synced from Claude sandbox)"
```
