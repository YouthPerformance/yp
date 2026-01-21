# Wolf Mail - Protocol 001: The Foundation

> **Subject:** Protocol 001: The Foundation
> **Preview Text:** We're building the future of youth performance. You're the engine.
> **From:** YP Alpha <alpha@send.youthperformance.com>
> **Send Date:** Sunday @ 7:00 PM EST (The Sunday Reset)

---

## Email Content

```
PROTOCOL 001 // THE FOUNDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Most youth sports brands treat you like a customer.

They sell you plastic and hope you break it so you buy more. They post motivational quotes and call it "content." They run camps and call it "development."

We're not a brand. We're a System.

YouthPerformance exists for one reason: To democratize elite athletic development.

We believe "Talent" is just unseen hours.
We believe the kid with the obsessive work ethic deserves the same tools as the pro.
We believe you can build springs, not pistons.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE SYSTEM
━━━━━━━━━━

→ HARDWARE
Tools that eliminate excuses. The NeoBall isn't a ball—it's a feedback loop.
Every bounce teaches you something. No gym required.

→ SOFTWARE
An OS that tracks the invisible work. The Academy isn't an app—it's a
long-term development protocol. 42 days to build the foundation.

→ CULTURE
A Pack that pulls you up. Not a community—a commitment.
We don't post. We train.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS EMAIL
━━━━━━━━━━

This is "Wolf Mail." Your weekly briefing from the Pack.

I won't sell you fluff. I will share:
• The blueprints of what we're building
• The training codes we're discovering
• The athletes who are executing

You're not just watching us build. You're the engine.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATUS CHECK
━━━━━━━━━━━━

[iPhone photo of whiteboard with system architecture]

This week we deployed the Wolf Contract system. 30 levels in 42 days.
Complete it → earn $88 toward your next NeoBall.

No shortcuts. No excuses. Just work.

We broke the auth system twice getting here. Fixed it both times.
That's building.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR MOVE
━━━━━━━━━

Reply to this email with ONE thing:

What's your athlete's biggest bottleneck right now?

I read every reply. Some of them become features.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lock In. Level Up.

— The Architect
   YouthPerformance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You're in the Pack.
Unsubscribe if you want to be average.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Content Breakdown (30/30/40 Rule)

| Section | Type | % |
|---------|------|---|
| The System (Mission) | The Build | 40% |
| Status Check (What we shipped) | The Build | 20% |
| This Email (What to expect) | The Code | 10% |
| Your Move (CTA) | The Pack | 30% |

---

## Design Notes

**Font:** System sans-serif (clean, not marketing-y)
**Background:** Off-white or dark mode compatible (#0a0a0a)
**Accent:** YP Cyan (#00f6e0) for section headers
**Images:** ONE raw iPhone photo (whiteboard, prototype, training)
**NO:** Stock photos, heavy HTML, emojis in body

---

## Metrics to Track

- Open Rate Target: 40%+
- Click Rate Target: 8%+
- Reply Rate Target: 2%+ (key engagement signal)
- Unsubscribe Rate: <0.5%

---

## Loops Event Trigger

```typescript
// Trigger for new Wolf Mail subscribers
await ctx.runAction(internal.loops.triggerLoopsEvent, {
  email: user.email,
  eventName: "wolf_mail_001_sent",
  eventProperties: {
    protocol: "001",
    title: "The Foundation",
  },
});
```

---

## Future Protocols

| Issue | Title | Focus | From |
|-------|-------|-------|------|
| 001 | The Foundation | Mission/Manifesto | YP Alpha |
| 002 | Silence | Train where no one watches | Coach James |
| 003 | The First Step | Start with ankles | Coach James |
| 004 | Ball Control | Handle pressure | Coach Adam |
| 005 | The Pack Highlight | First athlete feature | YP Alpha |
