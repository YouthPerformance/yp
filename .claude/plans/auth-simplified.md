# Simplified Auth Flow - YP Design

## Design Spec (Based on Efferd Pattern)

### Visual Structure
```
┌─────────────────────────────────────────────┐
│                                             │
│              [YP Logo]                      │
│                                             │
│         Sign In or Join Now!                │
│      Train smarter. Play better.            │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │  🔵  Continue with Google           │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │  🍎  Continue with Apple            │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │  💬  Continue with Discord          │   │  (or GitHub)
│   └─────────────────────────────────────┘   │
│                                             │
│   ───────────── OR ─────────────            │
│                                             │
│   Enter your email to sign in or sign up    │
│   ┌─────────────────────────────────────┐   │
│   │  📧  you@example.com                │   │
│   └─────────────────────────────────────┘   │
│   ┌─────────────────────────────────────┐   │
│   │       Continue With Email      →    │   │  (Cyan CTA)
│   └─────────────────────────────────────┘   │
│                                             │
│   By continuing, you agree to our           │
│   Terms of Service and Privacy Policy.      │
│                                             │
└─────────────────────────────────────────────┘
```

### YP Dark Theme Styling
- **Background**: `#0A0A0A` (wolfBlack) with subtle gradient
- **Card**: `bg-neutral-900/95` with `border-neutral-800`
- **Social buttons**: Full-width, `bg-neutral-800` with icon + text
- **Primary CTA**: `bg-[#00f6e0]` (YP cyan) with glow
- **Text**: White headings, `text-neutral-400` for secondary
- **Inputs**: Dark with cyan focus ring

### Clerk Elements Flow

**Step 1: Start**
- Show social buttons (Google, Apple, Discord)
- Show email input
- User clicks social OR enters email

**Step 2: Verifications** (if email)
- If existing user with password → show password field
- If new user or passwordless → show email code input
- Handle MFA if enabled

**Step 3: Continue** (if needed)
- Collect additional required fields (username, etc.)

### Components Needed

1. **UnifiedAuthPage** - Main page component
2. **SocialAuthButton** - Full-width button with icon + text
3. **EmailInput** - Styled email field
4. **AuthDivider** - "OR" divider
5. **ContinueButton** - Primary cyan CTA

### File Structure
```
apps/web-academy/src/app/sign-in/[[...sign-in]]/page.tsx  (unified)
apps/web-academy/src/app/sign-up/                         (redirect to sign-in)
apps/marketing/src/pages/AuthPage.jsx                     (same design)
```

### Key Differences from Current
| Current | New |
|---------|-----|
| Separate sign-in/sign-up | Unified "Sign In or Join" |
| Social buttons in grid (3 cols) | Social buttons stacked full-width |
| Password shown immediately | Email first, then password/code |
| Circuit decorations | Clean, minimal |
| Complex multi-step | Simple progressive flow |
