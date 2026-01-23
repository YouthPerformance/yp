# xLENS Web SDK - Product Requirements Document

> **Version:** 1.0.0
> **Status:** Draft
> **Last Updated:** 2026-01-22
> **Author:** YouthPerformance Engineering

---

## Executive Summary

### Vision
Bring verified jump capture to **anyone with a modern browser** - no app store, no downloads, instant access. Enable athletes in regions without App Store access (China, emerging markets) to participate in the YP Jump ecosystem.

### One-Liner
**"Proof of Physical Work - Now on the Web"**

### Success Metrics
| Metric | Target | Timeline |
|--------|--------|----------|
| Time to First Capture | < 10 seconds | Launch |
| Capture Success Rate | > 85% | Month 1 |
| Global Latency (upload) | < 3 seconds | Launch |
| Bundle Size (gzipped) | < 50KB | Launch |
| Browser Coverage | > 90% | Launch |

---

## Problem Statement

### The Gap
1. **App Store Barriers**: 40% of global smartphone users face friction downloading apps (China, data costs, storage limits)
2. **Instant Access Need**: Coaches at camps/clinics need athletes to capture jumps immediately
3. **QR Code Workflows**: WeChat/Alipay QR scans open web views, not app stores
4. **Emerging Markets**: Feature phones with browsers but limited app support

### The Opportunity
- **949M WeChat users** can access web apps via mini-program web views
- **75%+ global browser support** for WebCodecs API
- **Zero friction onboarding** - share a link, start jumping

---

## Solution Overview

### What We're Building
A **SvelteKit Progressive Web App** that captures verified jump videos using:
- WebCodecs API for hardware-accelerated video encoding
- DeviceMotion API for IMU sensor data
- Web Crypto API for client-side proof generation
- Cloudflare Stream for edge video uploads

### What We're NOT Building (Phase 1)
- Offline-first functionality (requires IndexedDB complexity)
- Push notifications
- Background sync
- Full PWA install flow (Add to Home Screen)

### Verification Tier Ceiling
| Platform | Max Tier | Why |
|----------|----------|-----|
| iOS Native | Gold | Secure Enclave + 120fps + Full IMU |
| Android Native | Gold | StrongBox + 120fps + Full IMU |
| **Web (This)** | **Silver** | No hardware attestation, ~60fps, basic IMU |
| WeChat Mini | Bronze | Limited APIs, no crypto |

---

## User Stories

### Primary Persona: Camp Athlete
> "I'm at a basketball camp. Coach shows a QR code. I scan it, my camera opens, I see a code on screen, I jump, and 30 seconds later my height shows up on the big screen."

### Secondary Persona: International User
> "I'm in Shanghai. I can't download American apps. But I can open a web link in WeChat and record my jump to compete with my American cousins."

### Tertiary Persona: Coach/Recruiter
> "I need to verify a prospect's vertical before they arrive. I text them a link, they record, I see verified results in my dashboard within minutes."

---

## Functional Requirements

### FR-1: Camera Capture

#### FR-1.1: Camera Access
| Requirement | Detail |
|-------------|--------|
| API | `navigator.mediaDevices.getUserMedia()` |
| Resolution | 1280x720 minimum, 1920x1080 preferred |
| Frame Rate | Request 60fps, accept 30fps minimum |
| Facing Mode | `environment` (back camera) preferred, `user` (front) fallback |
| Permission | Must handle denied/dismissed states gracefully |

#### FR-1.2: Video Encoding (WebCodecs)
| Requirement | Detail |
|-------------|--------|
| Codec | H.264 (AVC) - universal playback |
| Bitrate | 4 Mbps target, adaptive based on device |
| Keyframe | Every 1 second |
| Container | MP4 (via mp4-muxer library) |
| Max Duration | 15 seconds |
| Hardware Accel | Required - fallback to MediaRecorder if unavailable |

#### FR-1.3: Fallback Path
```
WebCodecs Available?
    ├─ YES → Use VideoEncoder (preferred)
    └─ NO → Use MediaRecorder (degraded quality warning)
```

### FR-2: Sensor Capture

#### FR-2.1: DeviceMotion API
| Requirement | Detail |
|-------------|--------|
| API | `DeviceMotionEvent` |
| Sample Rate | 60Hz target (browser-dependent) |
| Data Points | accelerationIncludingGravity (x,y,z), rotationRate (alpha,beta,gamma) |
| iOS Permission | Must call `DeviceMotionEvent.requestPermission()` on user gesture |
| HTTPS | Required (secure context) |

#### FR-2.2: Sensor Data Format
```typescript
interface WebIMUSample {
  timestamp: number;        // performance.now() in ms
  accelX: number;          // m/s²
  accelY: number;
  accelZ: number;
  rotationAlpha: number;   // deg/s
  rotationBeta: number;
  rotationGamma: number;
}
```

### FR-3: Nonce Display

#### FR-3.1: Visual Requirements
| Requirement | Detail |
|-------------|--------|
| Format | 6-character alphanumeric (e.g., "A7B3X9") |
| Font | Monospace, high contrast |
| Size | Minimum 48px, scales with viewport |
| Position | Top-center of camera preview |
| Background | Semi-transparent black (0.7 opacity) |
| Timer | Countdown showing seconds remaining |

#### FR-3.2: Session Flow
```
1. User taps "Start Session"
2. Request nonce from Convex → jump/sessions:create
3. Display nonce overlay (120 second TTL)
4. User taps "Record"
5. Capture video + sensors (max 15 seconds)
6. User taps "Stop" (or auto-stop at 15s)
7. Generate proof payload
8. Upload to Cloudflare Stream
9. Submit to Convex → jump/jumps:submit
10. Poll for results
```

### FR-4: Cryptographic Proofs

#### FR-4.1: Hashing
| Requirement | Detail |
|-------------|--------|
| Algorithm | SHA-256 via Web Crypto API |
| Video Hash | Hash of raw video bytes before muxing |
| Sensor Hash | Hash of JSON-encoded sensor array |
| Metadata Hash | Hash of session metadata object |

#### FR-4.2: Signing
| Requirement | Detail |
|-------------|--------|
| Algorithm | ECDSA P-256 (ES256) |
| Key Storage | IndexedDB (encrypted with device fingerprint) |
| Key Generation | `crypto.subtle.generateKey()` |
| Hardware Level | Always "software" (no web equivalent of Secure Enclave) |

#### FR-4.3: Proof Payload Structure
```typescript
interface WebProofPayload {
  sessionId: string;
  nonce: string;
  capture: {
    testType: "VERT_JUMP";
    startedAtMs: number;
    endedAtMs: number;
    fps: number;
    device: {
      platform: "web";
      userAgent: string;
      screenWidth: number;
      screenHeight: number;
    };
  };
  hashes: {
    videoSha256: string;
    sensorSha256: string;
    metadataSha256: string;
  };
  signature: {
    alg: "ES256";
    keyId: string;
    sig: string;  // base64
  };
}
```

### FR-5: Video Upload

#### FR-5.1: Cloudflare Stream Integration
| Requirement | Detail |
|-------------|--------|
| Protocol | TUS 1.0.0 (resumable uploads) |
| Direct Upload | Use creator upload URLs (no server proxy) |
| Max Size | 200MB (should never hit with 15s limit) |
| Chunk Size | 5MB |
| Retry | 3 attempts with exponential backoff |

#### FR-5.2: Upload Flow
```
1. Request upload URL from Convex → jump/uploads:createDirectUrl
2. Initialize TUS upload to Cloudflare
3. Upload with progress callbacks
4. On complete, receive storageId
5. Submit storageId to Convex with proof payload
```

### FR-6: Error Handling

#### FR-6.1: Error Categories
| Category | User Message | Recovery Action |
|----------|--------------|-----------------|
| Camera Denied | "Camera access required" | Link to browser settings |
| Motion Denied | "Motion sensors required for verification" | Continue with Bronze tier |
| WebCodecs Unavailable | "Your browser doesn't support high-quality capture" | Fall back to MediaRecorder |
| Network Error | "Upload failed - tap to retry" | Retry button, save locally |
| Session Expired | "Session timed out - start new session" | Auto-restart flow |

---

## Non-Functional Requirements

### NFR-1: Performance

| Metric | Requirement |
|--------|-------------|
| First Contentful Paint | < 1.5 seconds |
| Time to Interactive | < 3 seconds |
| Bundle Size (JS) | < 50KB gzipped |
| Memory Usage | < 150MB during capture |
| Battery Drain | < 5% for full capture flow |

### NFR-2: Browser Support

| Browser | Minimum Version | Priority |
|---------|-----------------|----------|
| Chrome (Android) | 94+ | P0 |
| Safari (iOS) | 15.4+ | P0 |
| Chrome (Desktop) | 94+ | P1 |
| Edge | 94+ | P1 |
| Firefox | 100+ | P2 |
| Samsung Internet | 16+ | P2 |
| WeChat Browser | Latest | P0 (China) |

### NFR-3: Accessibility

| Requirement | Detail |
|-------------|--------|
| Screen Reader | Announce capture states |
| Color Contrast | WCAG AA (4.5:1 minimum) |
| Touch Targets | Minimum 44x44px |
| Reduced Motion | Respect `prefers-reduced-motion` |

### NFR-4: Security

| Requirement | Detail |
|-------------|--------|
| HTTPS | Required (no HTTP) |
| CSP | Strict Content Security Policy |
| CORS | Restrict to known origins |
| Key Storage | IndexedDB with encryption |
| No Secrets | No API keys in client bundle |

### NFR-5: Internationalization

| Requirement | Detail |
|-------------|--------|
| Languages (Phase 1) | English, Simplified Chinese |
| RTL | Not required (Phase 1) |
| Date/Time | ISO 8601, display in local timezone |
| Numbers | Locale-aware formatting |

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | SvelteKit 2.x + Svelte 5 | Smallest bundle, AI-friendly, compiler-based |
| Styling | Tailwind CSS | Utility-first, tree-shakeable |
| Video Encoding | WebCodecs + mp4-muxer | Hardware-accelerated, universal playback |
| Crypto | Web Crypto API | Native, no dependencies |
| Upload | tus-js-client | Resumable, battle-tested |
| State | Svelte 5 Runes ($state, $derived) | Built-in reactivity |
| Backend | Convex (existing) | Already integrated |
| CDN/Edge | Cloudflare (Stream + Workers) | Global, fast |

### Package Structure

```
packages/xlens-web/
├── src/
│   ├── lib/
│   │   ├── capture/
│   │   │   ├── CameraManager.svelte.ts    # Camera access + preview
│   │   │   ├── WebCodecsEncoder.ts        # VideoEncoder wrapper
│   │   │   ├── MediaRecorderFallback.ts   # Fallback for old browsers
│   │   │   ├── MotionCapture.ts           # DeviceMotion wrapper
│   │   │   └── Mp4Muxer.ts                # MP4 container creation
│   │   │
│   │   ├── crypto/
│   │   │   ├── WebCryptoSigner.ts         # ECDSA key management
│   │   │   ├── ProofGenerator.ts          # Hash + sign payloads
│   │   │   └── KeyStorage.ts              # IndexedDB key persistence
│   │   │
│   │   ├── upload/
│   │   │   ├── TusUploader.ts             # Resumable upload client
│   │   │   └── CloudflareStream.ts        # Stream-specific logic
│   │   │
│   │   ├── client/
│   │   │   ├── XLensWebClient.svelte.ts   # Main SDK (reactive)
│   │   │   ├── types.ts                   # TypeScript interfaces
│   │   │   └── errors.ts                  # Error definitions
│   │   │
│   │   └── utils/
│   │       ├── browser.ts                 # Feature detection
│   │       ├── permissions.ts             # Permission helpers
│   │       └── i18n.ts                    # Internationalization
│   │
│   ├── routes/
│   │   ├── +layout.svelte                 # App shell
│   │   ├── +page.svelte                   # Landing/home
│   │   ├── capture/
│   │   │   ├── +page.svelte               # Main capture flow
│   │   │   └── +page.ts                   # Load session data
│   │   ├── result/
│   │   │   └── [jumpId]/
│   │   │       └── +page.svelte           # View results
│   │   └── api/
│   │       └── upload-url/
│   │           └── +server.ts             # Proxy for upload URLs
│   │
│   ├── components/
│   │   ├── CameraPreview.svelte           # Video preview component
│   │   ├── NonceOverlay.svelte            # Nonce display
│   │   ├── CaptureButton.svelte           # Record/stop button
│   │   ├── UploadProgress.svelte          # Upload status
│   │   ├── PermissionGate.svelte          # Permission request UI
│   │   └── ErrorBoundary.svelte           # Error handling
│   │
│   └── app.html                           # HTML template
│
├── static/
│   ├── manifest.json                      # PWA manifest
│   └── icons/                             # App icons
│
├── tests/
│   ├── unit/
│   │   ├── ProofGenerator.test.ts
│   │   ├── WebCodecsEncoder.test.ts
│   │   └── MotionCapture.test.ts
│   └── e2e/
│       └── capture-flow.spec.ts
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER DEVICE (Browser)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐                   │
│  │   Camera   │────▶│ WebCodecs  │────▶│  MP4 Muxer │                   │
│  │ getUserMedia│     │ Encoder    │     │            │                   │
│  └────────────┘     └────────────┘     └─────┬──────┘                   │
│        │                                      │                          │
│        │ Preview                              │ video.mp4                │
│        ▼                                      │                          │
│  ┌────────────┐                               │                          │
│  │  <video>   │                               │                          │
│  │  Preview   │                               │                          │
│  └────────────┘                               │                          │
│                                               │                          │
│  ┌────────────┐     ┌────────────┐           │                          │
│  │DeviceMotion│────▶│  Sensor    │           │                          │
│  │   Events   │     │  Buffer    │───────────┼──┐                       │
│  └────────────┘     └────────────┘           │  │                       │
│                                               │  │ sensors.json          │
│                                               │  │                       │
│                     ┌────────────────────────┴──┴──┐                    │
│                     │       Proof Generator        │                    │
│                     │  ┌─────────┐  ┌──────────┐  │                    │
│                     │  │ SHA-256 │  │  ECDSA   │  │                    │
│                     │  │  Hash   │  │   Sign   │  │                    │
│                     │  └─────────┘  └──────────┘  │                    │
│                     └──────────────┬───────────────┘                    │
│                                    │                                     │
│                                    │ proofPayload                        │
│                                    ▼                                     │
│                     ┌────────────────────────────┐                      │
│                     │      TUS Uploader          │                      │
│                     │  (Resumable, Chunked)      │                      │
│                     └─────────────┬──────────────┘                      │
│                                   │                                      │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │
                                    │ HTTPS (TUS Protocol)
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE EDGE                                   │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐              ┌─────────────────┐                    │
│  │ Cloudflare      │              │ Cloudflare      │                    │
│  │ Stream          │              │ Workers AI      │                    │
│  │ (video storage) │              │ (quick verify)  │                    │
│  └────────┬────────┘              └────────┬────────┘                    │
│           │                                │                              │
│           │ storageId                      │ preliminary score            │
│           ▼                                ▼                              │
│  ┌─────────────────────────────────────────────────────┐                 │
│  │              Cloudflare Worker                       │                 │
│  │  (route to Convex, validate, rate limit)            │                 │
│  └──────────────────────┬──────────────────────────────┘                 │
│                         │                                                 │
└─────────────────────────┼─────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         CONVEX BACKEND                                    │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    │
│  │ jump/sessions   │     │ jump/jumps      │     │ jump/verify     │    │
│  │ :create         │     │ :submit         │     │ :process        │    │
│  │ :validate       │     │ :markUploaded   │     │                 │    │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                        Convex Database                           │     │
│  │  sessions | jumps | jumpUsers | deviceKeys | vpcs               │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### State Machine

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
              ┌──────────┐                                │
              │   IDLE   │◀─────────────────────┐        │
              └────┬─────┘                      │        │
                   │                            │        │
                   │ startSession()             │        │
                   ▼                            │        │
         ┌─────────────────┐                    │        │
         │ REQUESTING_     │                    │        │
         │ PERMISSIONS     │                    │        │
         └────────┬────────┘                    │        │
                  │                             │        │
                  │ permissions granted         │ cancel()
                  ▼                             │        │
         ┌─────────────────┐                    │        │
         │ PREPARING_      │────────────────────┤        │
         │ SESSION         │  error             │        │
         └────────┬────────┘                    │        │
                  │                             │        │
                  │ nonce received              │        │
                  ▼                             │        │
         ┌─────────────────┐                    │        │
         │ SESSION_READY   │────────────────────┤        │
         └────────┬────────┘  timeout           │        │
                  │                             │        │
                  │ startCapture()              │        │
                  ▼                             │        │
         ┌─────────────────┐                    │        │
         │   CAPTURING     │────────────────────┤        │
         └────────┬────────┘  error             │        │
                  │                             │        │
                  │ stopCapture()               │        │
                  ▼                             │        │
         ┌─────────────────┐                    │        │
         │   PROCESSING    │────────────────────┤        │
         │ (encoding/hash) │  error             │        │
         └────────┬────────┘                    │        │
                  │                             │        │
                  │ proof ready                 │        │
                  ▼                             │        │
         ┌─────────────────┐                    │        │
         │   UPLOADING     │────────────────────┘        │
         └────────┬────────┘  error (retry available)    │
                  │                                      │
                  │ upload complete                      │
                  ▼                                      │
         ┌─────────────────┐                             │
         │   SUBMITTED     │                             │
         └────────┬────────┘                             │
                  │                                      │
                  │ results received                     │
                  ▼                                      │
         ┌─────────────────┐                             │
         │   COMPLETE      │─────────────────────────────┘
         └─────────────────┘  reset()
```

---

## API Contracts

### Convex Mutations/Queries (Existing)

#### `jump/sessions:create`
```typescript
// Input
{
  userId: string;
  deviceKeyId?: string;
  platform: "web";
}

// Output
{
  sessionId: string;
  nonce: string;
  nonceDisplay: string;
  expiresAt: number;      // Unix timestamp ms
  expiresInMs: number;    // TTL in ms
}
```

#### `jump/jumps:submit`
```typescript
// Input
{
  userId: string;
  sessionId: string;
  videoStorageId: string;
  sensorStorageId: string;
  proofPayload: WebProofPayload;
  gps?: {
    city: string;
    state?: string;
    country: string;
  };
  platform: "web";
}

// Output
{
  jumpId: string;
  status: "processing";
}
```

### New Convex Functions Needed

#### `jump/uploads:createDirectUrl`
```typescript
// Input
{
  userId: string;
  sessionId: string;
  contentType: "video/mp4" | "application/json";
  maxDurationSeconds?: number;
}

// Output
{
  uploadUrl: string;       // Cloudflare Stream TUS endpoint
  storageId: string;       // Pre-generated ID for tracking
  expiresAt: number;       // URL expiration
}
```

#### `jump/deviceKeys:registerWeb`
```typescript
// Input
{
  userId: string;
  publicKey: string;       // Base64 SPKI format
  deviceFingerprint: string;
}

// Output
{
  keyId: string;
  hardwareLevel: "software";
}
```

---

## UI/UX Specifications

### Screen: Permission Gate

```
┌─────────────────────────────────────────┐
│                                         │
│         🎥  Camera Access               │
│                                         │
│    xLENS needs access to your camera    │
│    and motion sensors to verify your    │
│    jump.                                │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │      [ Allow Camera ]           │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │      [ Allow Motion ]           │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    Motion sensors help us verify        │
│    you actually jumped.                 │
│                                         │
└─────────────────────────────────────────┘
```

### Screen: Capture Ready

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │      ┌─────────────────────┐      │  │
│  │      │      A 7 B 3 X 9     │      │  │
│  │      │        1:47          │      │  │
│  │      └─────────────────────┘      │  │
│  │                                   │  │
│  │                                   │  │
│  │         [ CAMERA PREVIEW ]        │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Position yourself so your full body    │
│  is visible. Show the code on screen.   │
│                                         │
│         ┌─────────────────────┐         │
│         │                     │         │
│         │   ⏺️  START RECORDING │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

### Screen: Recording

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │      ┌─────────────────────┐      │  │
│  │      │      A 7 B 3 X 9     │      │  │
│  │      │   🔴 REC  0:04       │      │  │
│  │      └─────────────────────┘      │  │
│  │                                   │  │
│  │                                   │  │
│  │         [ CAMERA PREVIEW ]        │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Recording... Jump when ready!          │
│                                         │
│         ┌─────────────────────┐         │
│         │                     │         │
│         │   ⏹️  STOP RECORDING  │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

### Screen: Processing/Upload

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │    Processing...    │         │
│         │                     │         │
│         │   ████████░░░░ 67%  │         │
│         │                     │         │
│         │   Encoding video    │         │
│         └─────────────────────┘         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘

Processing Steps:
1. "Encoding video..."
2. "Generating proof..."
3. "Uploading..." (with progress %)
4. "Verifying..."
```

### Screen: Results

```
┌─────────────────────────────────────────┐
│                                         │
│              ✅ Verified!               │
│                                         │
│         ┌─────────────────────┐         │
│         │                     │         │
│         │       32.5"         │         │
│         │    Vertical Jump    │         │
│         │                     │         │
│         │   🥈 Silver Tier    │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
│    Flight Time: 523ms                   │
│    Confidence: 94%                      │
│    Captured: Jan 22, 2026               │
│                                         │
│         ┌─────────────────────┐         │
│         │   Jump Again        │         │
│         └─────────────────────┘         │
│                                         │
│         ┌─────────────────────┐         │
│         │   Share Results     │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Tests
| Component | Test Cases |
|-----------|------------|
| ProofGenerator | Hash generation, signature creation, payload format |
| WebCodecsEncoder | Frame encoding, bitrate adaptation, error handling |
| MotionCapture | Permission handling, data format, sampling rate |
| TusUploader | Chunking, retry logic, progress tracking |

### Integration Tests
| Flow | Test Cases |
|------|------------|
| Session Creation | Nonce display, expiration handling |
| Full Capture | Camera → Encode → Hash → Sign → Upload |
| Error Recovery | Network failure, permission denial |

### E2E Tests (Playwright)
| Scenario | Test Cases |
|----------|------------|
| Happy Path | Complete capture flow on Chrome Android |
| Safari iOS | DeviceMotion permission, WebCodecs fallback |
| Slow Network | Upload resume after disconnect |
| WeChat Browser | Embed in WebView, verify functionality |

### Device Testing Matrix
| Device | Browser | Priority |
|--------|---------|----------|
| iPhone 14+ | Safari | P0 |
| Pixel 7+ | Chrome | P0 |
| Samsung S23 | Samsung Internet | P1 |
| OnePlus | Chrome | P1 |
| Xiaomi | Mi Browser / WeChat | P0 (China) |

---

## Deployment

### Hosting
| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Vercel | Easy SvelteKit deploy | Not in China | Global |
| Cloudflare Pages | Edge, China PoPs | Newer | **Primary** |
| Netlify | Simple | No China | Backup |

### Domain Strategy
```
jump.youthperformance.com     → Global (Cloudflare Pages)
jump.yp.cn                    → China (Cloudflare China Network or Alibaba CDN)
```

### Environment Variables
```bash
# .env
PUBLIC_CONVEX_URL=https://your-app.convex.cloud
PUBLIC_CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_STREAM_TOKEN=xxx  # Server-side only
```

---

## Rollout Plan

### Phase 1: MVP (Week 1-2)
- [ ] Basic capture flow (camera + sensors)
- [ ] WebCodecs encoding with MediaRecorder fallback
- [ ] Proof generation (hash + sign)
- [ ] Cloudflare Stream upload
- [ ] Convex integration
- [ ] English UI only

### Phase 2: Polish (Week 3)
- [ ] Error handling + retry UX
- [ ] Progress indicators
- [ ] Results display
- [ ] Share functionality
- [ ] Chinese language

### Phase 3: China (Week 4)
- [ ] WeChat browser testing
- [ ] China CDN deployment
- [ ] Mini-program WebView wrapper
- [ ] Alipay browser testing

### Phase 4: Optimization (Week 5+)
- [ ] Offline capture (save locally, upload later)
- [ ] PWA install prompt
- [ ] Push notifications for results
- [ ] Performance monitoring

---

## Open Questions

| Question | Options | Decision |
|----------|---------|----------|
| Offline support Phase 1? | Yes / No | **No** - adds complexity |
| PWA install prompt? | Yes / No | **No** - Phase 4 |
| China-specific domain? | Yes / No | **Yes** - jump.yp.cn |
| WebCodecs polyfill? | Yes / No | **No** - use MediaRecorder fallback |

---

## Appendix

### A. Browser API Support Matrix

| API | Chrome | Safari | Firefox | Samsung | WeChat |
|-----|--------|--------|---------|---------|--------|
| getUserMedia | ✅ 53+ | ✅ 11+ | ✅ 36+ | ✅ | ✅ |
| WebCodecs | ✅ 94+ | ✅ 16.4+ | ✅ 130+ | ✅ 20+ | ⚠️ |
| MediaRecorder | ✅ 47+ | ✅ 14+ | ✅ 25+ | ✅ | ✅ |
| DeviceMotion | ✅ | ✅ (permission) | ✅ | ✅ | ✅ |
| Web Crypto | ✅ 37+ | ✅ 11+ | ✅ 34+ | ✅ | ✅ |
| IndexedDB | ✅ 23+ | ✅ 10+ | ✅ 10+ | ✅ | ✅ |
| TUS Upload | ✅ | ✅ | ✅ | ✅ | ✅ |

### B. Verification Tier Criteria (Web)

| Tier | Requirements | Web Achievable? |
|------|--------------|-----------------|
| Measured | Video only | ✅ |
| Bronze | + Valid nonce | ✅ |
| Silver | + Crypto signature + IMU | ✅ (max) |
| Gold | + Hardware attestation | ❌ (no Secure Enclave) |

### C. Glossary

| Term | Definition |
|------|------------|
| WebCodecs | Browser API for low-level video/audio encoding |
| TUS | Resumable upload protocol (tus.io) |
| Nonce | One-time code from server to prevent replay attacks |
| IMU | Inertial Measurement Unit (accelerometer + gyroscope) |
| ECDSA | Elliptic Curve Digital Signature Algorithm |
| Runes | Svelte 5's reactive primitives ($state, $derived) |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product | | | |
| Engineering | | | |
| Design | | | |
| Security | | | |

---

*Document Version: 1.0.0*
*Last Updated: 2026-01-22*
