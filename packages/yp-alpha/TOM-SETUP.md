# TOM - Chief of Staff AI Setup

> Tom is an AI Chief of Staff for the YP internal team.
> Jarvis precision + Tony Robbins energy + Ted Lasso heart.

## Quick Start

### 1. Verify Convex Deployment

```bash
cd packages/yp-alpha
npx convex dev --once
```

### 2. Seed Team Users

```bash
npx tsx scripts/seed-tom-users.ts
```

### 3. Test the System

```bash
npx tsx scripts/test-tom.ts
```

---

## WhatsApp Setup

### Step 1: Create Meta Business App

1. Go to [Meta Developer Console](https://developers.facebook.com/apps/)
2. Create a new app (Business type)
3. Add WhatsApp product
4. Note your **Phone Number ID** and **API Token**

### Step 2: Configure Webhook

1. In your app settings, go to WhatsApp > Configuration
2. Set webhook URL: `https://app.youthperformance.com/api/whatsapp`
3. Set verify token: `tom-webhook-verify-2024` (or your custom token)
4. Subscribe to: `messages` field

### Step 3: Add Environment Variables

Copy `.env.tom.template` to your root `.env.local` and fill in:

```bash
WHATSAPP_API_TOKEN=EAAxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=1234567890
WHATSAPP_VERIFY_TOKEN=tom-webhook-verify-2024
WHATSAPP_APP_SECRET=your-app-secret

TOM_PHONE_MIKE=14155551234
TOM_PHONE_JAMES=14155551235
TOM_PHONE_ADAM=14155551236
TOM_PHONE_ANNIE=14155551237
```

### Step 4: Update Users with Phone Numbers

Run the seed script again after setting phone env vars:

```bash
npx tsx scripts/seed-tom-users.ts
```

---

## Testing Without WhatsApp

You can test Tom's brain without WhatsApp integration:

```bash
npx tsx scripts/test-tom.ts
```

This tests:
- User management
- Context operations (backlog, daily log)
- Capture classification
- Intent detection
- Voice mode switching (Jarvis/Robbins/Lasso)

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/whatsapp` | GET | Webhook verification |
| `/api/whatsapp` | POST | Incoming messages |

---

## Inngest Workflows

| Event | Trigger | Purpose |
|-------|---------|---------|
| `tom/briefing` | Cron (6am ET) | Morning briefings |
| `tom/capture` | WhatsApp message | Process captures |
| `tom/knowledge-sync` | Cron (4am ET) | Sync Google Drive |
| `tom/trend-scan` | Manual | Search trending topics |

---

## Voice Modes

Tom automatically switches between three modes:

| Mode | Trigger | Style |
|------|---------|-------|
| **Jarvis** | Errors, code, metrics | Technical, precise |
| **Robbins** | Goals, launches, growth | High energy, motivational |
| **Lasso** | Greetings, feedback, team | Warm, encouraging |

---

## Special Tools

| Tool | User | Trigger |
|------|------|---------|
| Product Visualization | James | "sketch", "visualize", "design" |
| Trend Search | Adam | "trending", "what's hot", "pulse" |
| Policy Draft | Annie | "rewrite", "customer response" |
| Executive Summary | Mike | "radar", "team status" |

---

## Convex Tables

All Tom data is in `tom_*` prefixed tables:

- `tom_users` - Team member configs
- `tom_contexts` - Active context, backlog, daily log
- `tom_captures` - WhatsApp/voice captures
- `tom_briefings` - Morning briefings
- `tom_logs` - Message history
- `tom_tasks` - Task queue
- `tom_knowledge` - Google Drive sync (P1)

---

## Troubleshooting

### "Unknown WhatsApp number"

Make sure the phone number in the env var matches WhatsApp format:
- No `+` prefix
- Country code included
- Example: `14155551234` for US +1 (415) 555-1234

### "Could not query Convex for user"

Run `npx convex dev --once` to ensure schema is deployed.

### Webhook not receiving messages

1. Check webhook URL is accessible (not localhost)
2. Verify the verify token matches
3. Check Meta Developer Console for delivery status

---

## Architecture

```
WhatsApp Message
       ↓
  /api/whatsapp (webhook)
       ↓
  Inngest: tom/capture
       ↓
  ┌─────────────────┐
  │ Intent Classify │ → Special Tool?
  └─────────────────┘        ↓
         ↓ no          Product Viz (James)
  ┌─────────────────┐   Trend Search (Adam)
  │ Capture Class   │   Policy Draft (Annie)
  │ task/note/idea  │
  └─────────────────┘
         ↓
  Store in Context
         ↓
  Generate Response (if needed)
         ↓
  Send WhatsApp Reply
```
