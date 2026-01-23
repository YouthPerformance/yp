# Product Requirements Document: xLENS Web SDK (Part 3)

> Continuation of PRD-PART2.md - Sections 11-17

---

## 11. Data models

### 11.1 Client-side data structures

#### 11.1.1 Capture state

```typescript
// src/lib/client/types.ts

export type CaptureState =
  | "idle"
  | "checking_compatibility"
  | "requesting_permissions"
  | "preparing_session"
  | "session_ready"
  | "capturing"
  | "processing"
  | "uploading"
  | "submitted"
  | "complete"
  | "error"
  | "unsupported";

export interface CaptureContext {
  state: CaptureState;
  session: Session | null;
  captureResult: CaptureResult | null;
  uploadProgress: UploadProgress | null;
  jumpResult: JumpResult | null;
  error: CaptureError | null;
  permissions: PermissionState;
  browserInfo: BrowserInfo;
}
```

#### 11.1.2 Session data

```typescript
export interface Session {
  id: string;
  nonce: string;
  nonceDisplay: string;
  expiresAt: Date;
  createdAt: Date;

  // Computed
  isExpired: boolean;
  remainingSeconds: number;
}
```

#### 11.1.3 Capture result

```typescript
export interface CaptureResult {
  video: {
    data: Uint8Array;
    mimeType: "video/mp4";
    durationMs: number;
    fps: number;
    width: number;
    height: number;
    sizeBytes: number;
  };
  sensors: {
    data: IMUSample[];
    json: string;
    sizeBytes: number;
    sampleCount: number;
    samplingRateHz: number;
  };
  metadata: {
    sessionId: string;
    nonce: string;
    startedAt: Date;
    endedAt: Date;
    deviceInfo: DeviceInfo;
  };
  hashes: {
    videoSha256: string;
    sensorSha256: string;
    metadataSha256: string;
  };
}
```

#### 11.1.4 IMU sample

```typescript
export interface IMUSample {
  timestamp: number;        // performance.now() ms

  // Acceleration (m/s²)
  accelX: number;
  accelY: number;
  accelZ: number;

  // Rotation rate (deg/s)
  rotationAlpha: number;
  rotationBeta: number;
  rotationGamma: number;
}
```

#### 11.1.5 Device info

```typescript
export interface DeviceInfo {
  platform: "web";
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  language: string;
  timezone: string;
}
```

#### 11.1.6 Proof payload

```typescript
export interface WebProofPayload {
  sessionId: string;
  nonce: string;

  capture: {
    testType: "VERT_JUMP";
    startedAtMs: number;
    endedAtMs: number;
    fps: number;
    device: DeviceInfo;
  };

  hashes: {
    videoSha256: string;
    sensorSha256: string;
    metadataSha256: string;
  };

  signature: {
    alg: "ES256";
    keyId: string;
    sig: string;       // Base64
  };

  sensorsAvailable: boolean;
}
```

#### 11.1.7 Jump result

```typescript
export interface JumpResult {
  id: string;
  status: "processing" | "complete" | "flagged" | "rejected";

  // Results (when complete)
  heightInches?: number;
  heightCm?: number;
  flightTimeMs?: number;
  confidence?: number;
  verificationTier?: "measured" | "bronze" | "silver";

  // Rejection (when rejected)
  rejectionReason?: string;

  // Timestamps
  createdAt: Date;
  completedAt?: Date;
}
```

#### 11.1.8 Upload progress

```typescript
export interface UploadProgress {
  stage: "video" | "sensor" | "submitting";
  videoProgress: number;    // 0-100
  sensorProgress: number;   // 0-100
  overallProgress: number;  // 0-100

  // Network info
  bytesUploaded: number;
  totalBytes: number;
  uploadSpeedBps: number;
  estimatedRemainingMs: number;

  // Retry info
  retryCount: number;
  maxRetries: number;
}
```

#### 11.1.9 Error types

```typescript
export type CaptureErrorCode =
  // Permission errors
  | "CAMERA_PERMISSION_DENIED"
  | "CAMERA_NOT_FOUND"
  | "MOTION_PERMISSION_DENIED"

  // Browser errors
  | "BROWSER_UNSUPPORTED"
  | "WEBCODECS_UNAVAILABLE"
  | "SECURE_CONTEXT_REQUIRED"

  // Session errors
  | "SESSION_EXPIRED"
  | "SESSION_INVALID"
  | "NONCE_MISMATCH"

  // Capture errors
  | "CAPTURE_TOO_SHORT"
  | "CAPTURE_FAILED"
  | "ENCODING_FAILED"

  // Upload errors
  | "UPLOAD_FAILED"
  | "UPLOAD_TIMEOUT"
  | "NETWORK_ERROR"

  // Server errors
  | "SERVER_ERROR"
  | "VERIFICATION_FAILED";

export interface CaptureError {
  code: CaptureErrorCode;
  message: string;
  details?: unknown;
  recoverable: boolean;
  retryAction?: () => Promise<void>;
}
```

#### 11.1.10 Browser info

```typescript
export interface BrowserInfo {
  supportsWebCodecs: boolean;
  supportsMediaRecorder: boolean;
  supportsGetUserMedia: boolean;
  supportsDeviceMotion: boolean;
  supportsWebCrypto: boolean;
  supportsIndexedDB: boolean;
  isSecureContext: boolean;

  // Encoding capabilities
  videoEncoder: {
    available: boolean;
    hardwareAcceleration: boolean;
    supportedCodecs: string[];
  };

  // Device
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  browserName: string;
  browserVersion: string;
}
```

### 11.2 IndexedDB schema

```typescript
// Key storage database

interface XLensKeyStore {
  databaseName: "xlens-keys";
  version: 1;

  stores: {
    keys: {
      keyPath: "keyId";
      indexes: ["userId", "createdAt"];

      record: {
        keyId: string;
        userId: string;
        privateKeyJwk: JsonWebKey;  // Encrypted
        publicKeySpki: string;       // Base64
        createdAt: number;
        lastUsedAt: number;
      };
    };

    settings: {
      keyPath: "key";

      record: {
        key: string;
        value: unknown;
      };
    };
  };
}
```

### 11.3 Convex database schema additions

```typescript
// packages/yp-alpha/convex/schema.ts additions

// Web-specific device key fields
deviceKeys: defineTable({
  // ... existing fields ...

  // Web-specific
  platform: v.optional(v.literal("web")),
  deviceFingerprint: v.optional(v.string()),
  browserInfo: v.optional(v.object({
    userAgent: v.string(),
    browserName: v.string(),
    browserVersion: v.string(),
  })),
})

// Web upload tracking
webUploads: defineTable({
  sessionId: v.string(),
  userId: v.string(),

  // Upload state
  videoStorageId: v.optional(v.string()),
  sensorStorageId: v.optional(v.string()),
  videoUploadedAt: v.optional(v.number()),
  sensorUploadedAt: v.optional(v.number()),

  // Cloudflare tracking
  cloudflareVideoId: v.optional(v.string()),
  cloudflareSensorId: v.optional(v.string()),

  // Expiration
  expiresAt: v.number(),
})
```

---

## 12. UI/UX specifications

### 12.1 Design system

#### 12.1.1 Color palette

```css
:root {
  /* Primary */
  --color-primary: #2563eb;       /* Blue 600 */
  --color-primary-hover: #1d4ed8; /* Blue 700 */
  --color-primary-light: #dbeafe; /* Blue 100 */

  /* Success */
  --color-success: #16a34a;       /* Green 600 */
  --color-success-light: #dcfce7; /* Green 100 */

  /* Warning */
  --color-warning: #ca8a04;       /* Yellow 600 */
  --color-warning-light: #fef9c3; /* Yellow 100 */

  /* Error */
  --color-error: #dc2626;         /* Red 600 */
  --color-error-light: #fee2e2;   /* Red 100 */

  /* Neutral */
  --color-text: #111827;          /* Gray 900 */
  --color-text-secondary: #6b7280; /* Gray 500 */
  --color-background: #ffffff;
  --color-surface: #f9fafb;       /* Gray 50 */
  --color-border: #e5e7eb;        /* Gray 200 */

  /* Recording */
  --color-recording: #ef4444;     /* Red 500 */

  /* Tiers */
  --color-tier-bronze: #cd7f32;
  --color-tier-silver: #c0c0c0;
  --color-tier-gold: #ffd700;
}
```

#### 12.1.2 Typography

```css
:root {
  /* Font families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;

  /* Font sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */

  /* Nonce display - extra large, monospace */
  --text-nonce: 3rem;
}
```

#### 12.1.3 Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
}
```

### 12.2 Screen specifications

#### 12.2.1 Landing page

```
┌─────────────────────────────────────────┐
│                                         │
│           ╔═══════════════╗             │
│           ║    xLENS      ║             │
│           ║               ║             │
│           ║  [Jump Icon]  ║             │
│           ╚═══════════════╝             │
│                                         │
│       Verified Jump Measurement         │
│                                         │
│    Get your vertical jump height        │
│    verified in seconds.                 │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │        Start Capture            │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    No app download required             │
│                                         │
│    ─────────────────────────────────    │
│                                         │
│    🔒 Secure   ⚡ Fast   ✓ Verified     │
│                                         │
│                         [🌐 EN ▾]       │
│                                         │
└─────────────────────────────────────────┘

SPECIFICATIONS:
- Logo: 80x80px
- Title: text-3xl, font-bold
- Subtitle: text-lg, text-secondary
- Button: Full width, height 56px, primary color
- Language switcher: Bottom right corner
```

#### 12.2.2 Permission gate

```
┌─────────────────────────────────────────┐
│                                         │
│              📷                         │
│                                         │
│       Camera Access Required            │
│                                         │
│    xLENS needs access to your camera    │
│    to record your jump.                 │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │        Allow Camera             │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ─────────────────────────────────    │
│                                         │
│              📱                         │
│                                         │
│       Motion Sensors                    │
│                                         │
│    Motion sensors help verify you       │
│    actually jumped. (Optional)          │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │        Allow Motion             │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    [Skip - Lower verification tier]     │
│                                         │
└─────────────────────────────────────────┘

SPECIFICATIONS:
- Icon: 48px emoji
- Title: text-xl, font-semibold
- Description: text-base, text-secondary
- Button: Full width, height 48px
- Skip link: text-sm, text-secondary, underline
```

#### 12.2.3 Session ready / Capture view

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │      ╔═════════════════════╗      │  │
│  │      ║     A 7 B 3 X 9     ║      │  │
│  │      ║       1:47          ║      │  │
│  │      ╚═════════════════════╝      │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │         [CAMERA PREVIEW]          │  │
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
│         │   ⏺️  RECORD        │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
│              [Cancel]                   │
│                                         │
└─────────────────────────────────────────┘

NONCE OVERLAY SPECIFICATIONS:
- Container: Semi-transparent black (bg-black/70)
- Nonce text: text-5xl, font-mono, font-bold, white
- Timer: text-lg, white/80
- Border radius: 12px
- Padding: 24px horizontal, 12px vertical
- Position: Top center, 20px from top

CAMERA PREVIEW:
- Aspect ratio: 16:9 or full screen
- Object-fit: cover
- Border radius: 12px (on container)

RECORD BUTTON:
- Size: 64px diameter
- Color: Primary (red when recording)
- Icon: Circle (record) / Square (stop)
```

#### 12.2.4 Recording state

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │      ╔═════════════════════╗      │  │
│  │      ║     A 7 B 3 X 9     ║      │  │
│  │      ║   🔴 REC  0:04      ║      │  │
│  │      ╚═════════════════════╝      │  │
│  │                                   │  │
│  │                                   │  │
│  │         [CAMERA PREVIEW]          │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│    Recording... Jump when ready!        │
│                                         │
│         ┌─────────────────────┐         │
│         │                     │         │
│         │   ⏹️  STOP          │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
│    ████████████░░░░░░░░  8/15s          │
│                                         │
└─────────────────────────────────────────┘

RECORDING INDICATOR:
- Red dot: Pulsing animation (1s cycle)
- "REC" text: text-sm, font-bold, red
- Timer: text-lg, white

PROGRESS BAR:
- Height: 4px
- Background: gray-300
- Fill: primary color
- Shows time remaining until auto-stop
```

#### 12.2.5 Processing / Upload view

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │                     │         │
│         │    [Spinner]        │         │
│         │                     │         │
│         │    Processing...    │         │
│         │                     │         │
│         │   ████████░░░░ 67%  │         │
│         │                     │         │
│         │   Encoding video    │         │
│         │                     │         │
│         └─────────────────────┘         │
│                                         │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │ ✓ Video recorded                │  │
│    │ ✓ Sensors captured              │  │
│    │ ◉ Encoding video...             │  │
│    │ ○ Generating proof              │  │
│    │ ○ Uploading                     │  │
│    │ ○ Submitting                    │  │
│    └─────────────────────────────────┘  │
│                                         │
│              [Cancel]                   │
│                                         │
└─────────────────────────────────────────┘

PROGRESS STEPS:
- ✓ Completed: Green check, text-success
- ◉ In progress: Animated spinner, text-primary
- ○ Pending: Gray circle, text-secondary

SPINNER:
- Size: 48px
- Color: Primary
- Animation: Rotate 1s linear infinite
```

#### 12.2.6 Results view

```
┌─────────────────────────────────────────┐
│                                         │
│              ✅                         │
│                                         │
│           Verified!                     │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │         32.5"                   │  │
│    │      (82.6 cm)                  │  │
│    │                                 │  │
│    │    Vertical Jump Height         │  │
│    │                                 │  │
│    │    ┌───────────────────────┐    │  │
│    │    │  🥈 Silver Verified   │    │  │
│    │    └───────────────────────┘    │  │
│    │                                 │  │
│    │    Flight Time: 523ms           │  │
│    │    Confidence: 94%              │  │
│    │    Captured: Jan 22, 2026       │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │        Jump Again               │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │        Share Results            │  │
│    └─────────────────────────────────┘  │
│                                         │
│                                         │
└─────────────────────────────────────────┘

RESULT CARD:
- Background: White
- Border: 1px solid border color
- Border radius: 16px
- Shadow: lg
- Padding: 24px

HEIGHT DISPLAY:
- Primary: text-5xl, font-bold
- Metric: text-lg, text-secondary
- Label: text-base, text-secondary

TIER BADGE:
- Bronze: bg-amber-100, text-amber-800, border-amber-300
- Silver: bg-gray-100, text-gray-800, border-gray-300
- Gold: bg-yellow-100, text-yellow-800, border-yellow-300
- Padding: 8px 16px
- Border radius: full
```

#### 12.2.7 Error view

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│              ⚠️                         │
│                                         │
│       Something Went Wrong              │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │                                 │  │
│    │  Camera access was denied.      │  │
│    │                                 │  │
│    │  To capture your jump, please   │  │
│    │  allow camera access in your    │  │
│    │  browser settings.              │  │
│    │                                 │  │
│    │  On iOS:                        │  │
│    │  Settings > Safari > Camera     │  │
│    │                                 │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │        Open Settings            │  │
│    └─────────────────────────────────┘  │
│                                         │
│    ┌─────────────────────────────────┐  │
│    │        Try Again                │  │
│    └─────────────────────────────────┘  │
│                                         │
│    Error ID: err_abc123                 │
│                                         │
└─────────────────────────────────────────┘

ERROR DISPLAY:
- Icon: 48px emoji (⚠️, 🚫, ❌)
- Title: text-xl, font-semibold
- Message: text-base, text-secondary
- Help text: text-sm, text-secondary
- Error ID: text-xs, font-mono, text-secondary
```

### 12.3 Component specifications

#### 12.3.1 CaptureButton

```svelte
<!-- Specifications -->
Props:
  - state: "idle" | "ready" | "recording"
  - disabled: boolean
  - onStart: () => void
  - onStop: () => void

Variants:
  - Idle: Gray, disabled
  - Ready: Primary color, "RECORD" label, record icon
  - Recording: Red, pulsing, "STOP" label, stop icon

Sizes:
  - Default: 64px diameter
  - Large: 80px diameter (for main capture)

Accessibility:
  - aria-label based on state
  - Keyboard accessible (Enter/Space)
  - Focus ring visible
```

#### 12.3.2 NonceOverlay

```svelte
<!-- Specifications -->
Props:
  - nonce: string (e.g., "A7B3X9")
  - remainingSeconds: number
  - isRecording: boolean

Layout:
  - Position: absolute, top center
  - Background: rgba(0, 0, 0, 0.7)
  - Border radius: 12px
  - Min width: 200px

Typography:
  - Nonce: 48px, monospace, bold, white
  - Timer: 18px, regular, white/80
  - Recording indicator: 14px, red, pulsing

Animation:
  - Recording dot pulses (opacity 0.5 to 1)
  - Timer updates every second
  - Warning color (yellow) at 30s
  - Urgent color (red) at 10s
```

#### 12.3.3 UploadProgress

```svelte
<!-- Specifications -->
Props:
  - progress: UploadProgress object
  - onCancel: () => void

Display:
  - Circular progress indicator (optional)
  - Linear progress bar
  - Step list with status icons
  - Cancel button

States:
  - Encoding: "Encoding video..."
  - Hashing: "Generating proof..."
  - Uploading: "Uploading... X%"
  - Submitting: "Submitting..."
  - Complete: "Complete!"

Network info (optional):
  - Upload speed: "2.4 MB/s"
  - Time remaining: "~12s"
```

---

## 13. Testing strategy

### 13.1 Test pyramid

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲           10%
                 ╱──────╲
                ╱        ╲
               ╱Integration╲       20%
              ╱────────────╲
             ╱              ╲
            ╱     Unit       ╲     70%
           ╱──────────────────╲
```

### 13.2 Unit tests

#### 13.2.1 Test coverage requirements

| Module | Minimum Coverage | Critical Paths |
|--------|-----------------|----------------|
| capture/ | 80% | WebCodecsEncoder, MotionCapture |
| crypto/ | 90% | ProofGenerator, KeyStorage |
| upload/ | 80% | TusUploader |
| client/ | 85% | XLensWebClient state machine |
| utils/ | 75% | browser detection, permissions |

#### 13.2.2 Unit test cases

```typescript
// tests/unit/lib/crypto/ProofGenerator.test.ts

describe('ProofGenerator', () => {
  describe('generateVideoHash', () => {
    it('should generate SHA-256 hash of video data', async () => {
      const videoData = new Uint8Array([1, 2, 3, 4, 5]);
      const hash = await generateVideoHash(videoData);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce deterministic output', async () => {
      const data = new Uint8Array([1, 2, 3]);
      const hash1 = await generateVideoHash(data);
      const hash2 = await generateVideoHash(data);
      expect(hash1).toBe(hash2);
    });

    it('should handle empty data', async () => {
      const hash = await generateVideoHash(new Uint8Array(0));
      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  describe('signPayload', () => {
    it('should create valid ECDSA signature', async () => {
      const keyPair = await generateTestKeyPair();
      const payload = { test: 'data' };
      const signature = await signPayload(payload, keyPair.privateKey);

      expect(signature).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64

      const isValid = await verifySignature(
        payload,
        signature,
        keyPair.publicKey
      );
      expect(isValid).toBe(true);
    });

    it('should use canonical JSON encoding', async () => {
      const keyPair = await generateTestKeyPair();
      const payload1 = { b: 2, a: 1 };
      const payload2 = { a: 1, b: 2 };

      const sig1 = await signPayload(payload1, keyPair.privateKey);
      const sig2 = await signPayload(payload2, keyPair.privateKey);

      expect(sig1).toBe(sig2); // Same signature for equivalent objects
    });
  });
});
```

```typescript
// tests/unit/lib/capture/WebCodecsEncoder.test.ts

describe('WebCodecsEncoder', () => {
  // Mock WebCodecs API for testing
  beforeEach(() => {
    globalThis.VideoEncoder = MockVideoEncoder;
  });

  describe('initialize', () => {
    it('should configure encoder with correct parameters', async () => {
      const encoder = new WebCodecsEncoder({
        width: 1280,
        height: 720,
        bitrate: 4_000_000,
        framerate: 60
      });

      await encoder.initialize();

      expect(encoder.isReady).toBe(true);
      expect(encoder.config.codec).toBe('avc1.42E01E');
    });

    it('should throw if WebCodecs unavailable', async () => {
      globalThis.VideoEncoder = undefined;

      const encoder = new WebCodecsEncoder(defaultConfig);

      await expect(encoder.initialize()).rejects.toThrow('WebCodecs not supported');
    });
  });

  describe('encodeFrame', () => {
    it('should encode VideoFrame to EncodedVideoChunk', async () => {
      const encoder = new WebCodecsEncoder(defaultConfig);
      await encoder.initialize();

      const frame = createMockVideoFrame();
      const chunk = await encoder.encodeFrame(frame);

      expect(chunk.type).toBe('key'); // First frame is keyframe
      expect(chunk.data.byteLength).toBeGreaterThan(0);
    });

    it('should insert keyframes at configured interval', async () => {
      const encoder = new WebCodecsEncoder({
        ...defaultConfig,
        keyframeInterval: 60 // Every 60 frames
      });
      await encoder.initialize();

      const chunks = [];
      for (let i = 0; i < 120; i++) {
        chunks.push(await encoder.encodeFrame(createMockVideoFrame(i)));
      }

      expect(chunks[0].type).toBe('key');
      expect(chunks[60].type).toBe('key');
    });
  });
});
```

### 13.3 Integration tests

```typescript
// tests/integration/capture-flow.test.ts

describe('Capture Flow Integration', () => {
  let client: XLensWebClient;
  let mockConvex: MockConvexClient;

  beforeEach(() => {
    mockConvex = createMockConvexClient();
    client = new XLensWebClient({ convexClient: mockConvex });
  });

  describe('full capture flow', () => {
    it('should complete capture with valid proof', async () => {
      // Setup mocks
      mockConvex.mutation.mockResolvedValueOnce({
        sessionId: 'session_123',
        nonce: 'abc123',
        nonceDisplay: 'A7B3X9',
        expiresAt: Date.now() + 120000
      });

      // Start session
      await client.startSession('user_123');
      expect(client.state).toBe('session_ready');

      // Start capture (with mock camera)
      await client.startCapture();
      expect(client.state).toBe('capturing');

      // Wait for recording
      await sleep(3000);

      // Stop capture
      const result = await client.stopCapture();
      expect(client.state).toBe('processing');

      // Verify proof structure
      expect(result.hashes.videoSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(result.hashes.sensorSha256).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
```

### 13.4 E2E tests (Playwright)

```typescript
// tests/e2e/capture-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Capture Flow E2E', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant camera permission
    await context.grantPermissions(['camera']);

    // Mock camera with test video
    await page.addInitScript(() => {
      // Override getUserMedia with test stream
    });
  });

  test('complete capture journey', async ({ page }) => {
    // Navigate to capture page
    await page.goto('/capture');

    // Wait for permission gate
    await expect(page.getByText('Camera Access Required')).toBeVisible();

    // Click allow (permission already granted in beforeEach)
    await page.getByRole('button', { name: 'Allow Camera' }).click();

    // Wait for session ready
    await expect(page.getByTestId('nonce-display')).toBeVisible({ timeout: 5000 });
    const nonce = await page.getByTestId('nonce-display').textContent();
    expect(nonce).toMatch(/^[A-Z0-9]{6}$/);

    // Start recording
    await page.getByRole('button', { name: 'Record' }).click();
    await expect(page.getByText('REC')).toBeVisible();

    // Wait 3 seconds
    await page.waitForTimeout(3000);

    // Stop recording
    await page.getByRole('button', { name: 'Stop' }).click();

    // Wait for processing
    await expect(page.getByText('Processing')).toBeVisible();
    await expect(page.getByText('Uploading')).toBeVisible({ timeout: 10000 });

    // Wait for results
    await expect(page.getByText('Verified!')).toBeVisible({ timeout: 60000 });

    // Verify result displayed
    await expect(page.getByTestId('jump-height')).toBeVisible();
    await expect(page.getByTestId('tier-badge')).toBeVisible();
  });

  test('handles camera permission denied', async ({ page, context }) => {
    // Deny camera permission
    await context.clearPermissions();

    await page.goto('/capture');
    await page.getByRole('button', { name: 'Allow Camera' }).click();

    // Should show error
    await expect(page.getByText('Camera access was denied')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
  });

  test('handles session timeout', async ({ page }) => {
    await page.goto('/capture');

    // Fast-forward session timer
    await page.evaluate(() => {
      // Mock Date.now to expire session
    });

    await expect(page.getByText('Session Expired')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start New Session' })).toBeVisible();
  });
});
```

### 13.5 Device testing matrix

| Device | OS | Browser | Priority | Notes |
|--------|----|---------|---------:|-------|
| iPhone 14 Pro | iOS 17 | Safari | P0 | Primary iOS target |
| iPhone 12 | iOS 16 | Safari | P0 | Older iOS |
| Pixel 7 | Android 14 | Chrome | P0 | Primary Android |
| Samsung S23 | Android 13 | Chrome | P1 | Samsung flagship |
| Samsung A54 | Android 13 | Samsung Internet | P1 | Mid-range Samsung |
| Xiaomi 13 | Android 13 | Chrome | P0 | China market |
| Xiaomi 13 | Android 13 | WeChat Browser | P0 | China market |
| OnePlus 11 | Android 13 | Chrome | P2 | Budget flagship |

### 13.6 Performance testing

```typescript
// tests/performance/capture-performance.test.ts

describe('Capture Performance', () => {
  test('encoding maintains 60fps throughput', async () => {
    const encoder = new WebCodecsEncoder(defaultConfig);
    await encoder.initialize();

    const frameCount = 300; // 5 seconds at 60fps
    const startTime = performance.now();

    for (let i = 0; i < frameCount; i++) {
      await encoder.encodeFrame(createMockVideoFrame(i));
    }

    const elapsed = performance.now() - startTime;
    const actualFps = frameCount / (elapsed / 1000);

    expect(actualFps).toBeGreaterThanOrEqual(60);
  });

  test('hash generation under 1 second for 20MB', async () => {
    const data = new Uint8Array(20 * 1024 * 1024); // 20MB
    crypto.getRandomValues(data);

    const startTime = performance.now();
    await generateVideoHash(data);
    const elapsed = performance.now() - startTime;

    expect(elapsed).toBeLessThan(1000);
  });

  test('memory stays under 150MB during capture', async () => {
    // Note: Requires Chrome with performance.memory enabled
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    const client = new XLensWebClient(config);
    await client.startSession('user_123');
    await client.startCapture();
    await sleep(15000); // Full 15 second capture
    await client.stopCapture();

    const peakMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryUsed = (peakMemory - initialMemory) / (1024 * 1024);

    expect(memoryUsed).toBeLessThan(150);
  });
});
```

---

## 14. Implementation roadmap

### 14.1 Sprint overview

| Sprint | Duration | Focus | Story Points |
|--------|----------|-------|--------------|
| Sprint 1 | Week 1 | Project setup, core capture | 25 |
| Sprint 2 | Week 2 | Encoding, proofs, upload | 30 |
| Sprint 3 | Week 3 | Results, errors, polish | 25 |
| Sprint 4 | Week 4 | i18n, China, testing | 20 |
| Sprint 5 | Week 5 | Bug fixes, optimization | 15 |

### 14.2 Sprint 1: Foundation (Week 1)

#### Goals
- Project scaffolding complete
- Camera capture working
- Basic UI flow

#### Tasks

##### Task 1.1: Project setup
```
TASK-001: Initialize SvelteKit project
- [ ] Run: npm create svelte@latest xlens-web
- [ ] Select: Skeleton project, TypeScript, ESLint, Prettier
- [ ] Add: Tailwind CSS, svelte-i18n
- [ ] Configure: svelte.config.js for Cloudflare adapter
- [ ] Create: folder structure as per architecture

Assignee: Frontend Engineer
Duration: 4 hours
Dependencies: None
```

##### Task 1.2: Browser detection
```
TASK-002: Implement browser compatibility check
- [ ] Create: src/lib/utils/browser.ts
- [ ] Implement: detectWebCodecs()
- [ ] Implement: detectGetUserMedia()
- [ ] Implement: detectDeviceMotion()
- [ ] Implement: getBrowserInfo()
- [ ] Create: BrowserCompatibility component
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 4 hours
Dependencies: TASK-001
```

##### Task 1.3: Camera manager
```
TASK-003: Implement CameraManager
- [ ] Create: src/lib/capture/CameraManager.svelte.ts
- [ ] Implement: requestCameraAccess()
- [ ] Implement: startPreview()
- [ ] Implement: stopPreview()
- [ ] Implement: switchCamera() (front/back)
- [ ] Handle: permission errors
- [ ] Add: Svelte 5 runes for state
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-001
```

##### Task 1.4: Camera preview component
```
TASK-004: Create CameraPreview component
- [ ] Create: src/components/capture/CameraPreview.svelte
- [ ] Implement: video element with stream
- [ ] Implement: aspect ratio handling
- [ ] Implement: error state display
- [ ] Style: with Tailwind

Assignee: Frontend Engineer
Duration: 4 hours
Dependencies: TASK-003
```

##### Task 1.5: Permission gate
```
TASK-005: Implement PermissionGate
- [ ] Create: src/routes/capture/components/PermissionGate.svelte
- [ ] Implement: camera permission request
- [ ] Implement: motion permission request (iOS)
- [ ] Implement: skip option for motion
- [ ] Handle: all permission states
- [ ] Add: browser-specific help text

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-003
```

##### Task 1.6: Motion capture
```
TASK-006: Implement MotionCapture
- [ ] Create: src/lib/capture/MotionCapture.ts
- [ ] Implement: requestMotionPermission() (iOS)
- [ ] Implement: startCapturing()
- [ ] Implement: stopCapturing()
- [ ] Implement: getSamples()
- [ ] Format: IMUSample structure
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-001
```

##### Task 1.7: Basic UI shell
```
TASK-007: Create app layout and basic pages
- [ ] Create: src/routes/+layout.svelte (app shell)
- [ ] Create: src/routes/+page.svelte (landing)
- [ ] Create: src/routes/capture/+page.svelte (capture flow)
- [ ] Add: navigation between pages
- [ ] Style: consistent design system

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-001
```

### 14.3 Sprint 2: Core Capture (Week 2)

#### Goals
- WebCodecs encoding working
- Proof generation complete
- Upload pipeline functional

#### Tasks

##### Task 2.1: WebCodecs encoder
```
TASK-008: Implement WebCodecsEncoder
- [ ] Create: src/lib/capture/WebCodecsEncoder.ts
- [ ] Implement: initialize() with config
- [ ] Implement: encodeFrame()
- [ ] Implement: flush()
- [ ] Handle: encoder errors
- [ ] Add: keyframe insertion
- [ ] Add: unit tests
- [ ] Add: performance tests

Assignee: Frontend Engineer
Duration: 12 hours
Dependencies: TASK-003
```

##### Task 2.2: MediaRecorder fallback
```
TASK-009: Implement MediaRecorderFallback
- [ ] Create: src/lib/capture/MediaRecorderFallback.ts
- [ ] Implement: same interface as WebCodecsEncoder
- [ ] Implement: startRecording()
- [ ] Implement: stopRecording()
- [ ] Handle: browser differences
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-003
```

##### Task 2.3: MP4 muxer
```
TASK-010: Implement MP4 muxing
- [ ] Install: mp4-muxer library
- [ ] Create: src/lib/capture/Mp4Muxer.ts
- [ ] Implement: createMuxer()
- [ ] Implement: addVideoChunk()
- [ ] Implement: finalize()
- [ ] Verify: output plays in Safari/Chrome
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-008
```

##### Task 2.4: Key storage
```
TASK-011: Implement KeyStorage (IndexedDB)
- [ ] Create: src/lib/crypto/KeyStorage.ts
- [ ] Implement: initDatabase()
- [ ] Implement: storeKey()
- [ ] Implement: getKey()
- [ ] Implement: deleteKey()
- [ ] Add: encryption with device fingerprint
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-001
```

##### Task 2.5: Web crypto signer
```
TASK-012: Implement WebCryptoSigner
- [ ] Create: src/lib/crypto/WebCryptoSigner.ts
- [ ] Implement: generateKeyPair()
- [ ] Implement: exportPublicKey() (SPKI)
- [ ] Implement: signData()
- [ ] Implement: verifySignature()
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-011
```

##### Task 2.6: Proof generator
```
TASK-013: Implement ProofGenerator
- [ ] Create: src/lib/crypto/ProofGenerator.ts
- [ ] Implement: generateVideoHash()
- [ ] Implement: generateSensorHash()
- [ ] Implement: generateMetadataHash()
- [ ] Implement: createProofPayload()
- [ ] Implement: signProof()
- [ ] Ensure: canonical JSON encoding
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-012
```

##### Task 2.7: TUS uploader
```
TASK-014: Implement TusUploader
- [ ] Install: tus-js-client
- [ ] Create: src/lib/upload/TusUploader.ts
- [ ] Implement: createUpload()
- [ ] Implement: startUpload()
- [ ] Implement: pauseUpload()
- [ ] Implement: resumeUpload()
- [ ] Handle: progress events
- [ ] Handle: error/retry logic
- [ ] Add: unit tests

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-001
```

### 14.4 Sprint 3: Integration (Week 3)

#### Goals
- End-to-end flow working
- Results display complete
- Error handling robust

#### Tasks

##### Task 3.1: Convex client setup
```
TASK-015: Configure Convex client
- [ ] Install: convex
- [ ] Create: src/lib/convex/client.ts
- [ ] Configure: environment variables
- [ ] Generate: API types
- [ ] Test: connection to backend

Assignee: Backend Engineer
Duration: 4 hours
Dependencies: None
```

##### Task 3.2: Session API integration
```
TASK-016: Implement session management
- [ ] Create: src/lib/client/sessionApi.ts
- [ ] Implement: createSession()
- [ ] Implement: validateSession()
- [ ] Handle: session expiration
- [ ] Add: session store (Svelte 5 runes)

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-015
```

##### Task 3.3: Upload API integration
```
TASK-017: Implement upload flow
- [ ] Create: src/routes/api/upload-url/+server.ts
- [ ] Implement: GET upload URL from Convex
- [ ] Implement: video upload flow
- [ ] Implement: sensor upload flow
- [ ] Handle: upload confirmation

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-014, TASK-015
```

##### Task 3.4: Jump submission
```
TASK-018: Implement jump submission
- [ ] Create: src/lib/client/jumpApi.ts
- [ ] Implement: submitJump()
- [ ] Implement: getJumpResult()
- [ ] Implement: polling logic
- [ ] Handle: all response states

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-017
```

##### Task 3.5: XLensWebClient
```
TASK-019: Implement main client
- [ ] Create: src/lib/client/XLensWebClient.svelte.ts
- [ ] Implement: state machine (all states)
- [ ] Implement: startSession()
- [ ] Implement: startCapture()
- [ ] Implement: stopCapture()
- [ ] Implement: submitJump()
- [ ] Implement: reset()
- [ ] Add: Svelte 5 runes for reactivity
- [ ] Add: comprehensive unit tests

Assignee: Frontend Engineer
Duration: 12 hours
Dependencies: All capture, crypto, upload modules
```

##### Task 3.6: Results display
```
TASK-020: Implement results UI
- [ ] Create: src/routes/result/[jumpId]/+page.svelte
- [ ] Create: JumpResult component
- [ ] Create: TierBadge component
- [ ] Implement: polling for results
- [ ] Handle: processing state
- [ ] Handle: rejected state
- [ ] Style: per design specs

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-018
```

##### Task 3.7: Error handling
```
TASK-021: Implement error handling
- [ ] Create: src/lib/client/errors.ts (error types)
- [ ] Create: ErrorMessage component
- [ ] Implement: error recovery flows
- [ ] Add: browser-specific help text
- [ ] Add: error logging (console + future Sentry)

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-019
```

### 14.5 Sprint 4: Polish (Week 4)

#### Goals
- i18n complete
- China market ready
- Testing complete

#### Tasks

##### Task 4.1: i18n setup
```
TASK-022: Implement internationalization
- [ ] Configure: svelte-i18n
- [ ] Create: src/lib/i18n/en.json
- [ ] Extract: all user-facing strings
- [ ] Implement: language detection
- [ ] Implement: language switcher
- [ ] Add: localStorage persistence

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: None
```

##### Task 4.2: Chinese translation
```
TASK-023: Add Chinese language
- [ ] Create: src/lib/i18n/zh-CN.json
- [ ] Translate: all strings (professional)
- [ ] Review: translations with native speaker
- [ ] Test: UI with Chinese text

Assignee: Product/External
Duration: 8 hours
Dependencies: TASK-022
```

##### Task 4.3: WeChat browser testing
```
TASK-024: WeChat browser compatibility
- [ ] Test: all features in WeChat browser
- [ ] Fix: any compatibility issues
- [ ] Optimize: for WeChat JS bridge
- [ ] Document: WeChat-specific behaviors

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-019
```

##### Task 4.4: Share functionality
```
TASK-025: Implement sharing
- [ ] Create: ShareButton component
- [ ] Implement: result image generation (Canvas)
- [ ] Implement: Web Share API
- [ ] Implement: copy link fallback
- [ ] Add: WeChat share (if in WeChat)

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-020
```

##### Task 4.5: E2E tests
```
TASK-026: Write E2E tests
- [ ] Configure: Playwright
- [ ] Write: happy path test
- [ ] Write: permission denied test
- [ ] Write: session timeout test
- [ ] Write: network error test
- [ ] Set up: CI/CD integration

Assignee: QA Engineer
Duration: 12 hours
Dependencies: TASK-019
```

##### Task 4.6: Cloudflare deployment
```
TASK-027: Deploy to Cloudflare Pages
- [ ] Configure: Cloudflare adapter
- [ ] Set up: environment variables
- [ ] Configure: custom domain
- [ ] Set up: CI/CD with GitHub
- [ ] Test: production build

Assignee: DevOps/Backend
Duration: 6 hours
Dependencies: All
```

### 14.6 Sprint 5: Hardening (Week 5)

#### Goals
- Bug fixes
- Performance optimization
- Documentation

#### Tasks

##### Task 5.1: Performance optimization
```
TASK-028: Optimize performance
- [ ] Run: Lighthouse audits
- [ ] Optimize: bundle size
- [ ] Optimize: image loading
- [ ] Add: loading states
- [ ] Implement: code splitting

Assignee: Frontend Engineer
Duration: 8 hours
Dependencies: TASK-027
```

##### Task 5.2: Accessibility audit
```
TASK-029: Accessibility fixes
- [ ] Run: axe DevTools audit
- [ ] Fix: color contrast issues
- [ ] Add: missing aria labels
- [ ] Test: keyboard navigation
- [ ] Test: screen reader

Assignee: Frontend Engineer
Duration: 6 hours
Dependencies: TASK-027
```

##### Task 5.3: Documentation
```
TASK-030: Write documentation
- [ ] Update: README.md
- [ ] Write: API documentation
- [ ] Write: deployment guide
- [ ] Write: troubleshooting guide
- [ ] Create: architecture diagrams

Assignee: Tech Lead
Duration: 6 hours
Dependencies: All
```

##### Task 5.4: Bug fixes (buffer)
```
TASK-031: Bug fix buffer
- [ ] Address: bugs found in testing
- [ ] Address: edge cases
- [ ] Address: browser-specific issues

Assignee: Team
Duration: 16 hours
Dependencies: TASK-026
```

### 14.7 Implementation checklist

```markdown
## Sprint 1 Checklist
- [ ] TASK-001: Project setup
- [ ] TASK-002: Browser detection
- [ ] TASK-003: Camera manager
- [ ] TASK-004: Camera preview
- [ ] TASK-005: Permission gate
- [ ] TASK-006: Motion capture
- [ ] TASK-007: Basic UI shell

## Sprint 2 Checklist
- [ ] TASK-008: WebCodecs encoder
- [ ] TASK-009: MediaRecorder fallback
- [ ] TASK-010: MP4 muxer
- [ ] TASK-011: Key storage
- [ ] TASK-012: Web crypto signer
- [ ] TASK-013: Proof generator
- [ ] TASK-014: TUS uploader

## Sprint 3 Checklist
- [ ] TASK-015: Convex client setup
- [ ] TASK-016: Session API
- [ ] TASK-017: Upload API
- [ ] TASK-018: Jump submission
- [ ] TASK-019: XLensWebClient
- [ ] TASK-020: Results display
- [ ] TASK-021: Error handling

## Sprint 4 Checklist
- [ ] TASK-022: i18n setup
- [ ] TASK-023: Chinese translation
- [ ] TASK-024: WeChat testing
- [ ] TASK-025: Share functionality
- [ ] TASK-026: E2E tests
- [ ] TASK-027: Cloudflare deployment

## Sprint 5 Checklist
- [ ] TASK-028: Performance optimization
- [ ] TASK-029: Accessibility audit
- [ ] TASK-030: Documentation
- [ ] TASK-031: Bug fixes
```

---

## 15. Success metrics

### 15.1 Key performance indicators (KPIs)

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Capture completion rate | >85% | (Completed / Started) × 100 | Daily |
| Average capture time | <45s | Mean time from start to submit | Daily |
| Upload success rate | >95% | (Successful / Attempted) × 100 | Daily |
| Error rate | <5% | (Errors / Total sessions) × 100 | Daily |
| Page load time (3G) | <3s | Lighthouse / RUM | Weekly |
| User satisfaction | >4.2/5 | In-app survey | Monthly |

### 15.2 Technical metrics

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | <1.5s | Lighthouse |
| Time to Interactive | <3.0s | Lighthouse |
| Bundle size (JS, gzip) | <50KB | Build output |
| Lighthouse Performance | >90 | Lighthouse |
| Lighthouse Accessibility | >90 | Lighthouse |
| Test coverage (unit) | >80% | Vitest |
| Test coverage (critical paths) | >90% | Vitest |

### 15.3 Business metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Daily active users (web) | 10,000+ | Month 3 |
| China user percentage | >20% | Month 6 |
| Conversion (visit to capture) | >40% | Month 2 |
| Return users | >30% | Month 3 |

---

## 16. Risks & mitigations

### 16.1 Technical risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebCodecs not available on target browsers | Medium | High | MediaRecorder fallback, browser detection |
| High memory usage during capture | Medium | High | Streaming encoding, chunk processing |
| iOS DeviceMotion permission complexity | High | Medium | Clear UX, Bronze tier fallback |
| WeChat browser compatibility issues | High | High | Dedicated testing, polyfills |
| Upload failures on slow networks | High | Medium | TUS resumable uploads, retry logic |
| Video quality issues with WebCodecs | Low | Medium | Bitrate tuning, fallback to MediaRecorder |

### 16.2 Product risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Lower verification tier (Silver max) | Certain | Medium | Clear communication, tier explanation |
| User confusion with permissions | Medium | Medium | Step-by-step UX, clear explanations |
| China network latency | Medium | Medium | Cloudflare China, edge uploads |
| Competition releasing similar feature | Low | High | Speed to market, superior UX |

### 16.3 Operational risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cloudflare Stream outage | Low | High | Monitoring, fallback storage option |
| Convex backend issues | Low | High | Error handling, retry logic |
| High upload costs at scale | Medium | Medium | Compression, file size limits |

---

## 17. Appendices

### 17.1 Glossary

| Term | Definition |
|------|------------|
| WebCodecs | Browser API for low-level video/audio encoding |
| TUS | Resumable upload protocol (tus.io) |
| Nonce | One-time cryptographic code from server |
| IMU | Inertial Measurement Unit (accelerometer + gyroscope) |
| ECDSA | Elliptic Curve Digital Signature Algorithm |
| ES256 | ECDSA using P-256 and SHA-256 |
| Runes | Svelte 5's reactive primitives ($state, $derived) |
| PWA | Progressive Web App |
| Convex | Backend-as-a-Service database |

### 17.2 References

- [WebCodecs API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload.html)
- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

### 17.3 Revision history

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-22 | Product Team | Initial draft |
| 2.0.0 | 2026-01-22 | Product Team | Comprehensive expansion |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Engineering Lead | | | |
| QA Lead | | | |
| Design Lead | | | |

---

*End of PRD Document*
