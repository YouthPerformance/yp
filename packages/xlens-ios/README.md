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

- iOS 15.0+
- Xcode 15.0+
- Swift 5.9+
- Camera and Motion permissions

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
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Capture   │  │    ProofGenerator   │  │
│  │   Manager   │  │                     │  │
│  │ (AV+Motion) │  │  (Hash + Sign)      │  │
│  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Convex    │  │   DeviceKey         │  │
│  │   Client    │  │   Manager           │  │
│  │   (HTTP)    │  │   (Secure Enclave)  │  │
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

Main entry point for the SDK.

#### Properties

- `state: XLensState` - Current client state (idle, capturing, etc.)
- `currentSession: Session?` - Active session if any
- `lastJump: Jump?` - Most recent jump submission

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

## License

Proprietary - YouthPerformance
