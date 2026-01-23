# xLENS Web SDK

> Verified Athletic Performance Capture for Web Browsers

## Package Context

This is the web browser implementation of xLENS, providing cryptographically verified jump capture without native app installation.

## Quick Reference

| Item | Value |
|------|-------|
| **Port** | 3007 |
| **Framework** | SvelteKit 2.x + Svelte 5 |
| **State** | Svelte 5 Runes ($state, $derived) |
| **Deploy** | Cloudflare Pages |
| **Max Tier** | Silver (no Secure Enclave in browsers) |

## Key Decisions

1. **SvelteKit over SolidStart**: AI (Claude) writes better Svelte code - standard HTML/CSS/JS vs JSX confusion
2. **WebCodecs first, MediaRecorder fallback**: Hardware-accelerated H.264 when available
3. **IndexedDB for keys**: Non-extractable private keys via Web Crypto API
4. **TUS protocol**: Resumable uploads for poor network conditions (China market)

## File Structure

```
src/lib/
├── capture/       # Video & sensor capture
├── crypto/        # Key storage & signing
├── upload/        # TUS uploader
├── client/        # Main orchestrator (XLensWebClient)
├── stores/        # Svelte context/stores
├── utils/         # Browser compatibility
├── types.ts       # TypeScript definitions
└── index.ts       # Public exports
```

## State Machine

```
idle → checking_compatibility → requesting_permissions → preparing_session
                                                                ↓
error ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ session_ready
                                                                ↓
complete ← submitted ← uploading ← processing ← capturing
```

## Commands

```bash
pnpm dev          # Start dev server (port 3007)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm typecheck    # Run type checking
```

## Browser Compatibility

| Browser | WebCodecs | DeviceMotion | Max FPS |
|---------|-----------|--------------|---------|
| Safari iOS 17+ | ✅ | ✅ | 60 |
| Chrome 94+ | ✅ | ✅ | 60 |
| Firefox | ❌ (fallback) | ✅ | 30 |
| WeChat | ❌ (fallback) | ⚠️ | 30 |

## Related Packages

- `xlens-ios`: Native iOS SDK (Gold tier capable)
- `yp-alpha/convex`: Backend APIs for sessions/jumps

## Environment Variables

```
VITE_CONVEX_URL=https://your-app.convex.cloud
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
```
