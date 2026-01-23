# xLENS iOS SDK

> Verified Performance Capture for YP Jump
> "Proof of Physical Work" - The missing standard

## Overview

xLENS is a cryptographically verified athletic performance capture system. It provides:

- **Video Capture**: High frame rate recording (up to 120fps) optimized for jump detection
- **Sensor Capture**: IMU data (accelerometer + gyroscope) at 100Hz for physics verification
- **Cryptographic Proofs**: Hardware-backed signatures using Secure Enclave
- **Nonce Verification**: Server-issued challenges prevent replay attacks

## Requirements

- iOS 17.0+ (required for @Observable macro)
- Xcode 15.0+
- Swift 5.9+
- Camera and Motion permissions

## Swift 2026 Best Practices

This SDK follows modern Swift concurrency patterns:

- **@Observable macro** (not ObservableObject) for reactive state
- **@MainActor isolation** for UI state management
- **Sendable conformance** for all data types
- **Actor isolation** for thread-safe components
- **Environment-based DI** for SwiftUI integration
- **Pure async/await** - no Combine dependency

## Installation

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(path: "../packages/xlens-ios")
]
```

Or in Xcode: File → Add Package Dependencies → Add Local Package

## Quick Start

```swift
import xLENS

// 1. Create client
let client = XLens.createClient(
    convexUrl: URL(string: "https://your-app.convex.cloud")!,
    userId: "user_123"
)

// 2. Start a session (gets nonce from server)
let session = try await client.startSession(userId: "user_123")

// 3. Display nonce overlay and start capture
nonceLabel.text = session.nonceDisplay
try await client.startCapture()

// 4. User performs jump...

// 5. Stop capture
let result = try await client.stopCapture()

// 6. Submit for verification
let submission = try await client.submitJump(
    userId: "user_123",
    captureResult: result
)
```

## SwiftUI Integration

```swift
@main
struct MyApp: App {
    @State private var client = XLens.createClient(
        convexUrl: URL(string: "https://your-app.convex.cloud")!,
        userId: "user_123"
    )

    var body: some Scene {
        WindowGroup {
            ContentView()
                .xlensClient(client) // Inject via Environment
        }
    }
}

struct JumpCaptureView: View {
    @Environment(\.xlensClient) var client

    var body: some View {
        VStack {
            if let layer = client?.previewLayer {
                XLensCameraPreview(previewLayer: layer)
            }

            if let session = client?.currentSession {
                XLensNonceOverlay(
                    nonceDisplay: session.nonceDisplay,
                    remainingTime: session.remainingTime
                )
            }
        }
    }
}
```

## Verification Tiers

| Tier | Requirements | Trust Level |
|------|--------------|-------------|
| **Measured** | Basic capture | Low |
| **Bronze** | Valid crypto + nonce | Medium |
| **Silver** | + Hardware attestation | High |
| **Gold** | + IMU physics correlation | Verified |

## Architecture

```
┌─────────────────────────────────────────────┐
│                 XLensClient                  │
│              (@Observable)                   │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Capture   │  │    ProofGenerator   │  │
│  │   Manager   │  │     (Sendable)      │  │
│  │ (@MainActor)│  │  (Hash + Sign)      │  │
│  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Convex    │  │   DeviceKey         │  │
│  │   Client    │  │   Manager           │  │
│  │   (actor)   │  │   (actor)           │  │
│  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │    Convex     │
              │    Backend    │
              └───────────────┘
```

## API Reference

### XLensClient

Main entry point for the SDK. Uses `@Observable` macro for reactive updates.

#### Properties

- `state: XLensState` - Current client state (idle, capturing, etc.)
- `currentSession: Session?` - Active session if any
- `lastJump: Jump?` - Most recent jump submission
- `previewLayer: AVCaptureVideoPreviewLayer?` - Camera preview for UI

#### Methods

- `startSession(userId:)` - Create a new capture session
- `startCapture()` - Begin video/sensor recording
- `stopCapture()` - Stop recording and return results
- `submitJump(userId:captureResult:gps:)` - Submit to server
- `cancel()` - Cancel current operation
- `reset()` - Reset to idle state

### CaptureResult

Contains captured data:

- `videoData: Data` - H.264 encoded video
- `sensorData: Data` - JSON-encoded IMU samples
- `fps: Int` - Actual capture frame rate
- `imuSamples: [IMUSample]` - Raw sensor readings

### Session

Server-issued session:

- `id: String` - Unique session ID
- `nonce: String` - Cryptographic nonce
- `nonceDisplay: String` - Human-readable code (e.g., "A7B3X9")
- `expiresAt: Date` - Session expiration (120 seconds)

## Security

- Keys stored in Secure Enclave (when available)
- ES256 (ECDSA P-256 + SHA-256) signatures
- SHA-256 hashes of all captured data
- Time-limited sessions (120 seconds)
- Actor isolation for thread-safe key management

## Testing

To run tests:

```bash
swift test
```

Or in Xcode: Product → Test (⌘U)

## License

Proprietary - YouthPerformance
