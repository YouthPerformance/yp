# xLENS Web SDK

> Verified Athletic Performance Capture for Web
> "Proof of Physical Work" - The missing standard for web browsers

## Overview

xLENS Web provides cryptographically verified jump capture for web browsers, enabling users without native app access to participate in verified athletic performance tracking.

**Key Features:**
- **WebCodecs Encoding**: Hardware-accelerated H.264 video capture (60fps)
- **MediaRecorder Fallback**: Support for older browsers
- **Web Crypto Signing**: ECDSA P-256 signatures
- **TUS Resumable Uploads**: Reliable video upload to Cloudflare Stream
- **Svelte 5 Runes**: Modern reactive state management

## Verification Tiers

| Tier | Requirements | Trust Level |
|------|--------------|-------------|
| **Measured** | Basic capture | Low |
| **Bronze** | Valid crypto + nonce | Medium |
| **Silver** | + Device attestation (max for web) | High |

> Note: Gold tier (hardware attestation) requires native iOS/Android apps.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── lib/
│   ├── capture/           # Video & sensor capture
│   │   ├── CameraManager.svelte.ts
│   │   ├── MotionCapture.ts
│   │   ├── WebCodecsEncoder.ts
│   │   └── MediaRecorderFallback.ts
│   ├── crypto/            # Cryptographic operations
│   │   ├── KeyStorage.ts
│   │   ├── WebCryptoSigner.ts
│   │   └── ProofGenerator.ts
│   ├── upload/            # Video upload
│   │   └── TusUploader.ts
│   ├── client/            # Main client
│   │   └── XLensWebClient.svelte.ts
│   ├── stores/            # Svelte stores
│   ├── utils/             # Utilities
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Public exports
├── routes/
│   ├── +page.svelte       # Landing page
│   ├── capture/           # Capture flow
│   └── result/[jumpId]/   # Result display
└── components/            # Reusable UI components
```

## Usage

### Basic Integration

```svelte
<script lang="ts">
  import { createXLensWebClient } from '@yp/xlens-web';

  const client = createXLensWebClient({
    convexUrl: 'https://your-app.convex.cloud',
    userId: 'user_123'
  });

  async function captureJump() {
    // Check compatibility
    await client.checkCompatibility();

    // Request permissions
    await client.requestPermissions();

    // Create session
    await client.createSession();

    // Start capture
    await client.startCapture();

    // ... user performs jump ...

    // Stop and submit
    const capture = await client.stopCapture();
    const result = await client.submitJump(capture);

    console.log('Jump submitted:', result.jumpId);
  }
</script>
```

### Reactive State

```svelte
<script lang="ts">
  import { createXLensWebClient, getStateLabel, formatDuration } from '@yp/xlens-web';

  const client = createXLensWebClient({ ... });

  // All state is reactive via Svelte 5 Runes
  // client.state, client.session, client.recordingDuration, etc.
</script>

<div>
  <p>Status: {getStateLabel(client)}</p>
  <p>Recording: {formatDuration(client.recordingDuration)}</p>
  {#if client.session}
    <p>Nonce: {client.session.nonceDisplay}</p>
  {/if}
</div>
```

## Browser Support

| Browser | WebCodecs | MediaRecorder | DeviceMotion |
|---------|-----------|---------------|--------------|
| Safari iOS 17+ | ✅ | ✅ | ✅ |
| Chrome 94+ | ✅ | ✅ | ✅ |
| Firefox | ❌ | ✅ | ✅ |
| WeChat Browser | ❌ | ✅ | ⚠️ Limited |

## Environment Variables

```env
VITE_CONVEX_URL=https://your-app.convex.cloud
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
```

## Deployment

### Cloudflare Pages

```bash
# Build
pnpm build

# Deploy (via Wrangler)
npx wrangler pages deploy .svelte-kit/cloudflare
```

Or connect your repository to Cloudflare Pages for automatic deployments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    XLensWebClient                           │
│                   (Svelte 5 Runes)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐│
│  │   Camera    │  │   Motion    │  │    WebCodecs/        ││
│  │   Manager   │  │   Capture   │  │    MediaRecorder     ││
│  │ ($state)    │  │             │  │                      ││
│  └─────────────┘  └─────────────┘  └──────────────────────┘│
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐│
│  │   Proof     │  │   Key       │  │    TUS Uploader      ││
│  │   Generator │  │   Storage   │  │                      ││
│  │             │  │  (IndexedDB)│  │                      ││
│  └─────────────┘  └─────────────┘  └──────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │    Convex Backend     │
              │  (Sessions, Jumps)    │
              └───────────────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │   Cloudflare Stream   │
              │   (Video Storage)     │
              └───────────────────────┘
```

## Security

- **Web Crypto API**: ECDSA P-256 key generation and signing
- **IndexedDB**: Secure local key storage (non-extractable private keys)
- **Session Nonces**: Time-limited (120s) server-issued challenges
- **SHA-256 Hashes**: Video and sensor data integrity verification
- **TUS Protocol**: Resumable, verified uploads

## License

Proprietary - YouthPerformance
