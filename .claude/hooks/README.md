# Claude Code Hooks

Hooks inject deterministic behavior into the Claude Code workflow.

---

## Available Hook Types

| Hook | Trigger | Use Case |
|------|---------|----------|
| `PreToolUse` | Before any tool is called | Validate, warn, or block actions |
| `PostToolUse` | After a tool completes | Log, notify, or chain actions |
| `Notification` | When Claude needs input | Alert via Slack/Discord |
| `Stop` | When Claude finishes a task | Run tests, validate output |

---

## Recommended Hooks for YP

### 1. Schema Guard Hook

**Purpose:** Remind to sync Convex when schema changes

**Trigger:** When editing `packages/yp-alpha/convex/schema.ts`

**Action:** Output reminder to run `npx convex dev`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "condition": "file_path contains 'convex/schema.ts'",
        "action": "warn",
        "message": "Remember to run 'npx convex dev' after schema changes"
      }
    ]
  }
}
```

### 2. Main Branch Guard

**Purpose:** Prevent direct pushes to main

**Trigger:** When running git push to main

**Action:** Block and suggest PR workflow

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "condition": "command contains 'git push' AND command contains 'main'",
        "action": "block",
        "message": "Direct push to main blocked. Use a PR instead."
      }
    ]
  }
}
```

### 3. Deploy Gate Hook

**Purpose:** Run /prodcheck before deploys

**Trigger:** When running deploy commands

**Action:** Require /prodcheck first

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "condition": "command contains 'deploy' OR command contains 'wrangler pages'",
        "action": "require",
        "requirement": "Run /prodcheck first",
        "bypass": "user confirms"
      }
    ]
  }
}
```

### 4. Test Runner Hook

**Purpose:** Run tests when Claude finishes a feature

**Trigger:** When Claude completes implementation

**Action:** Run test suite, continue if failing

```json
{
  "hooks": {
    "Stop": [
      {
        "condition": "task_type == 'feature'",
        "action": "run",
        "command": "pnpm turbo run test",
        "on_failure": "continue with message"
      }
    ]
  }
}
```

---

## Configuration Location

Hooks are configured in:
- **Project:** `.claude/settings.json` (this repo)
- **User:** `~/.claude/settings.json` (your machine)

Project settings override user settings.

---

## Example settings.json

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "files": ["**/schema.ts"],
        "message": "Schema change detected. Run 'npx convex dev' to sync."
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "pattern": "git commit",
        "action": "log",
        "target": ".claude/docs/changelog.md"
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(pnpm *)",
      "Bash(npx *)",
      "Edit(*)",
      "Write(*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(* --force *main*)"
    ]
  }
}
```

---

## Best Practices

1. **Start Simple:** Begin with warnings, not blocks
2. **Test Locally:** Verify hooks work before committing
3. **Document:** Add comments explaining each hook's purpose
4. **Iterate:** Refine based on actual usage patterns

---

*Hooks are an advanced feature. Start with slash commands and sub-agents first.*
