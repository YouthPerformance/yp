# xLENS Android SDK

> Verified Performance Capture for YP Jump
> "Proof of Physical Work" - The missing standard

## Overview

xLENS is a cryptographically verified athletic performance capture system. It provides:

- **Video Capture**: High quality recording using CameraX optimized for jump detection
- **Sensor Capture**: IMU data (accelerometer + gyroscope) at 100Hz for physics verification
- **Cryptographic Proofs**: Hardware-backed signatures using Android Keystore/StrongBox
- **Nonce Verification**: Server-issued challenges prevent replay attacks

## Requirements

- Android SDK 26+ (Android 8.0 Oreo)
- CameraX 1.3+
- Kotlin 1.9+
- Camera, Microphone, and Motion sensor permissions

## Installation

### Gradle

Add to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation(project(":packages:xlens-android"))
}
```

## Quick Start

```kotlin
import com.youthperformance.xlens.*

// 1. Create client
val client = XLensClient(
    context = applicationContext,
    configuration = XLensClient.Configuration(
        convexUrl = "https://your-app.convex.cloud",
        userId = "user_123"
    )
)

// 2. Initialize camera (in Activity/Fragment)
client.captureManager.initializeCamera(
    lifecycleOwner = this,
    previewView = binding.previewView
)

// 3. Start a session (gets nonce from server)
val session = client.startSession(userId = "user_123")

// 4. Display nonce overlay and start capture
binding.nonceText.text = session.nonceDisplay
client.startCapture()

// 5. User performs jump...

// 6. Stop capture
val result = client.stopCapture()

// 7. Submit for verification
val submission = client.submitJump(
    userId = "user_123",
    captureResult = result
)
```

## Permissions

Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />

<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.sensor.accelerometer" android:required="true" />
<uses-feature android:name="android.hardware.sensor.gyroscope" android:required="true" />
```

Request runtime permissions before using the SDK.

## Verification Tiers

| Tier | Requirements | Trust Level |
|------|--------------|-------------|
| **Measured** | Basic capture | Low |
| **Bronze** | Valid crypto + nonce | Medium |
| **Silver** | + Hardware attestation (TEE) | High |
| **Gold** | + StrongBox + IMU physics | Verified |

## Architecture

```
┌─────────────────────────────────────────────┐
│                 XLensClient                  │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Capture   │  │    ProofGenerator   │  │
│  │   Manager   │  │                     │  │
│  │  (CameraX)  │  │  (Hash + Sign)      │  │
│  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Convex    │  │   DeviceKey         │  │
│  │   Client    │  │   Manager           │  │
│  │   (OkHttp)  │  │   (Keystore)        │  │
│  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │    Convex     │
              │    Backend    │
              └───────────────┘
```

## StateFlow Observables

```kotlin
// Observe state changes
lifecycleScope.launch {
    client.state.collect { state ->
        when (state) {
            is XLensState.Idle -> showReady()
            is XLensState.Capturing -> showRecording()
            is XLensState.Processing -> showProcessing()
            is XLensState.Complete -> showSuccess()
            is XLensState.Error -> showError(state.exception)
        }
    }
}
```

## API Reference

### XLensClient

Main entry point for the SDK.

#### Properties

- `state: StateFlow<XLensState>` - Current client state
- `currentSession: StateFlow<Session?>` - Active session if any
- `lastJump: StateFlow<Jump?>` - Most recent jump submission

#### Methods

- `startSession(userId)` - Create a new capture session
- `startCapture()` - Begin video/sensor recording
- `stopCapture()` - Stop recording and return results
- `submitJump(userId, captureResult, gps?)` - Submit to server
- `cancel()` - Cancel current operation
- `reset()` - Reset to idle state
- `checkDailyCap(userId)` - Check remaining daily jumps
- `getJumpHistory(userId, limit)` - Get user's jump history
- `getBestJump(userId, minTier?)` - Get user's best verified jump

### CaptureResult

Contains captured data:

- `videoData: ByteArray` - H.264 encoded video
- `sensorData: ByteArray` - JSON-encoded IMU samples
- `fps: Int` - Estimated capture frame rate
- `imuSamples: List<IMUSample>` - Raw sensor readings

### Session

Server-issued session:

- `id: String` - Unique session ID
- `nonce: String` - Cryptographic nonce
- `nonceDisplay: String` - Human-readable code (e.g., "A7B3X9")
- `expiresAt: Long` - Session expiration timestamp (120 seconds)

## Hardware Security Levels

| Level | Hardware | Max Tier | Devices |
|-------|----------|----------|---------|
| **StrongBox** | Dedicated HSM | Gold | Pixel 3+, Samsung S10+ |
| **TEE** | ARM TrustZone | Silver | Most modern Android |
| **Software** | None | Bronze | Older devices |

## Security

- Keys stored in Android Keystore (StrongBox when available)
- ES256 (ECDSA P-256 + SHA-256) signatures
- SHA-256 hashes of all captured data
- Time-limited sessions (120 seconds)
- Play Integrity API support (Phase B+)

## ProGuard Rules

Add to `proguard-rules.pro`:

```proguard
-keep class com.youthperformance.xlens.** { *; }
-keepclassmembers class com.youthperformance.xlens.** { *; }
```

## License

Proprietary - YouthPerformance
