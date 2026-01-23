# xLENS Web SDK - Setup Instructions

## Quick Start

Run these commands in your terminal:

```bash
# Navigate to the package
cd /Users/magicmike/yp-monorepo/packages/xlens-web

# Install dependencies
pnpm install

# Run type checking
pnpm typecheck

# Run tests
pnpm test:unit

# Start dev server
pnpm dev
```

## Expected Output

### 1. Install Dependencies
```
Packages: +25
...
Done in 15s
```

### 2. Type Check
Should pass without errors. You may see some warnings about browser APIs that are expected.

### 3. Tests
```
✓ src/lib/types.test.ts
✓ src/lib/crypto/WebCryptoSigner.test.ts
✓ src/lib/capture/MotionCapture.test.ts
✓ src/lib/utils/compatibility.test.ts
✓ src/lib/stores/xlens.svelte.test.ts
```

### 4. Dev Server
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3007/
  ➜  Network: use --host to expose
```

## Test in Browser

1. Open http://localhost:3007 in Safari (iOS) or Chrome
2. Click "Start Jump Test"
3. Allow camera access when prompted
4. You should see:
   - Camera preview (mirrored)
   - Nonce display (e.g., "A7B3X9")
   - Session countdown timer
   - Record button (orange circle)

## Known Issues

1. **Convex not connected**: The app will show errors when trying to create sessions until you connect to a real Convex backend
2. **WebCodecs on Firefox**: Falls back to MediaRecorder (lower quality)
3. **DeviceMotion on desktop**: May not be available, sensor data will be empty

## Environment Variables

Create a `.env` file:
```env
VITE_CONVEX_URL=https://your-app.convex.cloud
```

## File Structure Created

```
packages/xlens-web/
├── package.json           # Dependencies and scripts
├── svelte.config.js       # SvelteKit config
├── vite.config.ts         # Vite + Vitest config
├── tailwind.config.js     # Tailwind styles
├── tsconfig.json          # TypeScript config
├── wrangler.toml          # Cloudflare Pages config
├── CLAUDE.md              # Package context for AI
├── README.md              # Documentation
├── SETUP.md               # This file
├── src/
│   ├── app.html           # HTML shell
│   ├── app.css            # Global styles
│   ├── app.d.ts           # TypeScript declarations
│   ├── lib/
│   │   ├── index.ts       # Public exports
│   │   ├── types.ts       # Type definitions
│   │   ├── types.test.ts  # Type tests
│   │   ├── capture/       # Video & sensor capture
│   │   │   ├── CameraManager.svelte.ts
│   │   │   ├── MotionCapture.ts
│   │   │   ├── MotionCapture.test.ts
│   │   │   ├── WebCodecsEncoder.ts
│   │   │   └── MediaRecorderFallback.ts
│   │   ├── crypto/        # Cryptographic operations
│   │   │   ├── KeyStorage.ts
│   │   │   ├── WebCryptoSigner.ts
│   │   │   ├── WebCryptoSigner.test.ts
│   │   │   └── ProofGenerator.ts
│   │   ├── upload/        # Video upload
│   │   │   └── TusUploader.ts
│   │   ├── client/        # Main client
│   │   │   └── XLensWebClient.svelte.ts
│   │   ├── stores/        # Svelte stores
│   │   │   ├── xlens.svelte.ts
│   │   │   └── xlens.svelte.test.ts
│   │   └── utils/         # Utilities
│   │       ├── compatibility.ts
│   │       └── compatibility.test.ts
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte   # Landing page
│       ├── capture/
│       │   ├── +page.svelte    # Capture UI
│       │   └── +page.ts        # SSR disabled
│       └── result/[jumpId]/
│           ├── +page.svelte    # Result display
│           └── +page.ts        # SSR disabled
└── static/                # Static assets
```

## Next Steps After Testing

1. **Connect Convex**: Add your Convex URL to `.env`
2. **Add Convex Functions**: Create backend functions for sessions/jumps
3. **Configure Cloudflare Stream**: Set up video upload endpoint
4. **Deploy**: Run `pnpm build && npx wrangler pages deploy .svelte-kit/cloudflare`
