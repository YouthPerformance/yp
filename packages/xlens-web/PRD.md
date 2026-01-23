# Product Requirements Document: xLENS Web SDK

> **Document Version:** 2.0.0
> **Status:** Ready for Implementation
> **Created:** 2026-01-22
> **Last Updated:** 2026-01-22
> **Document Owner:** YouthPerformance Product Team

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Problem statement](#2-problem-statement)
3. [User personas](#3-user-personas)
4. [User stories & requirements](#4-user-stories--requirements)
5. [Epics & feature breakdown](#5-epics--feature-breakdown)
6. [User flows](#6-user-flows)
7. [Functional requirements](#7-functional-requirements)
8. [Non-functional requirements](#8-non-functional-requirements)
9. [Technical architecture](#9-technical-architecture)
10. [API specifications](#10-api-specifications)
11. [Data models](#11-data-models)
12. [UI/UX specifications](#12-uiux-specifications)
13. [Testing strategy](#13-testing-strategy)
14. [Implementation roadmap](#14-implementation-roadmap)
15. [Success metrics](#15-success-metrics)
16. [Risks & mitigations](#16-risks--mitigations)
17. [Appendices](#17-appendices)

---

## 1. Executive summary

### 1.1 Project overview

**Project Name:** xLENS Web SDK
**Codename:** Project Jumpstart
**Product Type:** Progressive Web Application (PWA)

xLENS Web is a browser-based verified athletic performance capture system that enables users to record and verify vertical jump measurements without downloading a native mobile application. The system captures video and sensor data, generates cryptographic proofs, and submits results for AI-powered verification.

### 1.2 Purpose of this document

This PRD serves as the single source of truth for the xLENS Web SDK implementation. It provides:

- Complete specification for all features and functionality
- Detailed user stories with acceptance criteria
- Technical architecture and API contracts
- Step-by-step implementation roadmap for engineering execution
- Testing requirements and success metrics

### 1.3 Business objectives

| Objective | Target | Timeline |
|-----------|--------|----------|
| Expand global reach | +40% addressable market | Q1 2026 |
| Reduce onboarding friction | <10 second time-to-capture | Launch |
| Enable China market entry | 100M+ potential users | Q2 2026 |
| Increase capture volume | 3x current daily captures | Q2 2026 |

### 1.4 Success criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Capture completion rate | >85% | Analytics |
| Average capture time | <45 seconds | Analytics |
| Upload success rate | >95% | Server logs |
| User satisfaction | >4.2/5 stars | In-app survey |
| Page load time (3G) | <3 seconds | Lighthouse |

### 1.5 Scope

#### In scope (Phase 1)
- Camera capture with WebCodecs encoding
- Motion sensor data collection (DeviceMotion API)
- Cryptographic proof generation (Web Crypto API)
- Resumable video upload (TUS protocol)
- Nonce-based session verification
- Results display and sharing
- English and Chinese language support

#### Out of scope (Phase 1)
- Offline-first functionality
- PWA installation prompts
- Push notifications
- Social sharing integrations
- Leaderboard display
- Historical jump comparison

### 1.6 Key stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | TBD | Feature prioritization, acceptance |
| Tech Lead | TBD | Architecture decisions, code review |
| Frontend Engineer | TBD | SvelteKit implementation |
| Backend Engineer | TBD | Convex functions, Cloudflare Workers |
| QA Engineer | TBD | Test planning, execution |
| UX Designer | TBD | UI design, user testing |

---

## 2. Problem statement

### 2.1 Current situation

Today, xLENS verified jump capture is only available through native iOS and Android applications. This creates significant barriers:

1. **App Store friction**: Users must download a 50MB+ app before their first jump
2. **Geographic restrictions**: China users cannot access Google Play; App Store approval is slow
3. **Instant access impossible**: Coaches at camps cannot onboard athletes quickly
4. **Device storage concerns**: Users with limited storage skip the download

### 2.2 User pain points

| Pain Point | User Segment | Impact |
|------------|--------------|--------|
| "I don't want to download another app" | Casual users | 60% drop-off at app store |
| "App Store is blocked in my country" | China market | 0% conversion |
| "I need athletes to capture NOW" | Coaches | Lost opportunity |
| "My phone storage is full" | Budget device users | Cannot participate |

### 2.3 Market opportunity

| Market | Size | Current Access | Web Opportunity |
|--------|------|----------------|-----------------|
| US High School Athletes | 8M | Full | Instant onboarding |
| China Youth Athletes | 100M+ | None | First access |
| International Markets | 50M+ | Partial | Simplified access |
| Casual Fitness Users | 200M+ | Low | No-commitment trial |

### 2.4 Solution hypothesis

> **If** we provide a browser-based capture experience with near-native quality,
> **Then** we will increase total verified captures by 3x and unlock the China market,
> **Because** users can capture instantly without download friction.

### 2.5 Competitive analysis

| Competitor | Platform | Verification | Weakness |
|------------|----------|--------------|----------|
| MyVertical | iOS/Android only | Basic | No web, no crypto proof |
| JumpTest | iOS only | Video only | No sensors, no China |
| VertPro | Web + Native | None | No verification system |
| **xLENS Web** | **Web + Native** | **Full (Silver tier)** | **Our solution** |

---

## 3. User personas

### 3.1 Primary persona: Camp athlete (Alex)

```
┌─────────────────────────────────────────────────────────────────┐
│  PERSONA: Camp Athlete                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Name: Alex Chen                                                │
│  Age: 16                                                        │
│  Location: Austin, Texas                                        │
│  Device: iPhone 13 (Safari)                                     │
│  Tech Savviness: High                                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  BACKGROUND                                                     │
│  • High school basketball player                                │
│  • Attends summer training camps                                │
│  • Active on social media (TikTok, Instagram)                   │
│  • Competitive, wants to track progress                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GOALS                                                          │
│  • Get verified vertical jump measurement                       │
│  • Compare with teammates and pros                              │
│  • Share results on social media                                │
│  • Track improvement over time                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FRUSTRATIONS                                                   │
│  • "I don't want to download another app"                       │
│  • "The coach said scan this QR, but it wants me to download"   │
│  • "My phone storage is almost full"                            │
│  • "I just want to see my number quickly"                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCENARIO                                                       │
│  Alex is at a basketball camp. The coach announces a vertical   │
│  jump competition. Coach displays a QR code. Alex scans it,     │
│  the camera opens in Safari, Alex sees a code on screen,        │
│  jumps, and 30 seconds later sees "32.5 inches" on screen.      │
│  Alex screenshots and posts to Instagram Stories.               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SUCCESS CRITERIA                                               │
│  • Complete capture in <60 seconds                              │
│  • No app download required                                     │
│  • Shareable result image                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Secondary persona: China user (Wei)

```
┌─────────────────────────────────────────────────────────────────┐
│  PERSONA: China User                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Name: Wei Zhang                                                │
│  Age: 19                                                        │
│  Location: Shanghai, China                                      │
│  Device: Xiaomi 13 (WeChat Browser)                             │
│  Tech Savviness: Medium                                         │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  BACKGROUND                                                     │
│  • University volleyball player                                 │
│  • Uses WeChat for everything                                   │
│  • Cannot access Google Play Store                              │
│  • Follows international athletes on Weibo                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GOALS                                                          │
│  • Compare vertical with international standards                │
│  • Get verified measurement for team tryouts                    │
│  • Share on WeChat Moments                                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FRUSTRATIONS                                                   │
│  • "American apps don't work here"                              │
│  • "I can't verify my jump height officially"                   │
│  • "VPN is too slow for video upload"                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCENARIO                                                       │
│  Wei sees a friend share their verified jump on WeChat.         │
│  Wei taps the link, it opens in WeChat's built-in browser.      │
│  Wei records a jump, uploads over China network (no VPN),       │
│  and shares the result to WeChat Moments in Chinese.            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SUCCESS CRITERIA                                               │
│  • Works without VPN                                            │
│  • Chinese language interface                                   │
│  • Fast upload on China network                                 │
│  • WeChat-native sharing                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Tertiary persona: Coach/Recruiter (Marcus)

```
┌─────────────────────────────────────────────────────────────────┐
│  PERSONA: Coach/Recruiter                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Name: Marcus Johnson                                           │
│  Age: 42                                                        │
│  Location: Atlanta, Georgia                                     │
│  Device: iPad Pro (Safari)                                      │
│  Tech Savviness: Low-Medium                                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  BACKGROUND                                                     │
│  • AAU basketball coach for 15 years                            │
│  • Runs summer training camps                                   │
│  • Evaluates 100+ prospects per season                          │
│  • Limited time for tech setup                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GOALS                                                          │
│  • Get verified jump data for all camp athletes                 │
│  • Compare athletes objectively                                 │
│  • Send verified data to college recruiters                     │
│  • Minimize setup/training time                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FRUSTRATIONS                                                   │
│  • "Half the kids don't have the app installed"                 │
│  • "We waste 20 minutes on app downloads"                       │
│  • "Some kids have Android, some iPhone"                        │
│  • "I need results NOW, not after a download"                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCENARIO                                                       │
│  Marcus runs a camp with 50 athletes. He displays a QR code     │
│  on the gym screen. All 50 athletes scan simultaneously,        │
│  their cameras open instantly, and within 10 minutes all        │
│  jumps are captured. Marcus sees a dashboard with all results.  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SUCCESS CRITERIA                                               │
│  • 100% of athletes can participate (any device)                │
│  • <5 minute setup for entire group                             │
│  • Batch results visible in dashboard                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Persona comparison matrix

| Attribute | Alex (Camp) | Wei (China) | Marcus (Coach) |
|-----------|-------------|-------------|----------------|
| Primary device | iPhone | Android/Xiaomi | iPad |
| Browser | Safari | WeChat Browser | Safari |
| Network | Fast LTE/WiFi | Variable 4G | Gym WiFi |
| Language | English | Chinese | English |
| Tech comfort | High | Medium | Low |
| Time pressure | High | Medium | Very High |
| Success metric | Share result | Get verified | Batch capture |

---

## 4. User stories & requirements

### 4.1 Epic overview

| Epic ID | Epic Name | Priority | User Personas |
|---------|-----------|----------|---------------|
| EP-001 | Permission & Setup | P0 | All |
| EP-002 | Session Management | P0 | All |
| EP-003 | Video Capture | P0 | All |
| EP-004 | Sensor Capture | P0 | All |
| EP-005 | Proof Generation | P0 | All |
| EP-006 | Upload & Submit | P0 | All |
| EP-007 | Results Display | P0 | All |
| EP-008 | Error Handling | P0 | All |
| EP-009 | Internationalization | P1 | Wei |
| EP-010 | Sharing | P1 | Alex, Wei |

### 4.2 User stories by epic

#### EP-001: Permission & setup

##### US-001: Camera permission request
```
AS A user
I WANT TO grant camera access when prompted
SO THAT the app can record my jump

ACCEPTANCE CRITERIA:
- [ ] AC-001.1: Permission prompt appears on first camera access attempt
- [ ] AC-001.2: Clear explanation of why camera is needed is shown before prompt
- [ ] AC-001.3: "Allow" grants access and proceeds to camera preview
- [ ] AC-001.4: "Deny" shows friendly error with instructions to enable in settings
- [ ] AC-001.5: Previously granted permission is remembered (no re-prompt)
- [ ] AC-001.6: Works on iOS Safari, Chrome Android, WeChat Browser

TECHNICAL NOTES:
- Use navigator.mediaDevices.getUserMedia()
- Handle NotAllowedError, NotFoundError
- Persist permission state in localStorage

PRIORITY: P0
STORY POINTS: 3
```

##### US-002: Motion sensor permission (iOS)
```
AS A user on iOS
I WANT TO grant motion sensor access when prompted
SO THAT the app can verify my jump with sensor data

ACCEPTANCE CRITERIA:
- [ ] AC-002.1: Motion permission requested after camera permission (iOS only)
- [ ] AC-002.2: Request triggered by user gesture (tap button)
- [ ] AC-002.3: Explanation shown: "Motion sensors help verify you actually jumped"
- [ ] AC-002.4: If denied, user can still capture (Bronze tier warning shown)
- [ ] AC-002.5: Android does not require explicit permission (auto-granted)

TECHNICAL NOTES:
- iOS 13+ requires DeviceMotionEvent.requestPermission()
- Must be called from user gesture handler
- Check if permission API exists before calling

PRIORITY: P0
STORY POINTS: 2
```

##### US-003: Browser compatibility check
```
AS A user
I WANT TO know if my browser supports the capture features
SO THAT I don't waste time on an unsupported device

ACCEPTANCE CRITERIA:
- [ ] AC-003.1: Check runs automatically on page load
- [ ] AC-003.2: WebCodecs support detected (with MediaRecorder fallback noted)
- [ ] AC-003.3: getUserMedia support detected
- [ ] AC-003.4: Incompatible browser shows clear message with alternatives
- [ ] AC-003.5: "Continue anyway" option for borderline browsers

TECHNICAL NOTES:
- Feature detection, not user-agent sniffing
- Check: navigator.mediaDevices, VideoEncoder, DeviceMotionEvent
- Store compatibility result for analytics

PRIORITY: P0
STORY POINTS: 2
```

##### US-004: HTTPS requirement handling
```
AS A user accessing via HTTP
I WANT TO be redirected to HTTPS
SO THAT secure APIs are available

ACCEPTANCE CRITERIA:
- [ ] AC-004.1: HTTP requests automatically redirect to HTTPS
- [ ] AC-004.2: localhost allowed for development
- [ ] AC-004.3: Clear error if HTTPS unavailable and redirect fails

TECHNICAL NOTES:
- Handle at Cloudflare edge (Always Use HTTPS)
- Client-side check for secure context

PRIORITY: P0
STORY POINTS: 1
```

#### EP-002: Session management

##### US-005: Start capture session
```
AS A user
I WANT TO start a verified capture session
SO THAT my jump can be cryptographically verified

ACCEPTANCE CRITERIA:
- [ ] AC-005.1: "Start Session" button initiates session request
- [ ] AC-005.2: Loading state shown during session creation
- [ ] AC-005.3: Session nonce displayed prominently (e.g., "A7B3X9")
- [ ] AC-005.4: Session countdown timer visible (120 seconds)
- [ ] AC-005.5: Session expires after 120 seconds with clear message
- [ ] AC-005.6: User can start new session after expiration

TECHNICAL NOTES:
- Call Convex: jump/sessions:create
- Store session in Svelte state ($state)
- Timer updates every second

PRIORITY: P0
STORY POINTS: 3

INPUT:
- userId: string (from URL param or generated)
- platform: "web"

OUTPUT:
- sessionId: string
- nonce: string (cryptographic)
- nonceDisplay: string (human-readable, e.g., "A7B3X9")
- expiresAt: number (Unix timestamp ms)
```

##### US-006: Session timeout handling
```
AS A user whose session expired
I WANT TO be notified and easily restart
SO THAT I can complete my capture

ACCEPTANCE CRITERIA:
- [ ] AC-006.1: Warning shown at 30 seconds remaining
- [ ] AC-006.2: Warning shown at 10 seconds remaining (urgent)
- [ ] AC-006.3: Expired session shows "Session Expired" message
- [ ] AC-006.4: "Start New Session" button prominently displayed
- [ ] AC-006.5: Any in-progress recording is stopped and discarded

TECHNICAL NOTES:
- Use setInterval for countdown
- Clear interval on component unmount
- Discard partial capture data on expiry

PRIORITY: P0
STORY POINTS: 2
```

##### US-007: Session validation
```
AS THE SYSTEM
I WANT TO validate the session before accepting a submission
SO THAT replay attacks are prevented

ACCEPTANCE CRITERIA:
- [ ] AC-007.1: Session ID and nonce validated server-side
- [ ] AC-007.2: Expired sessions rejected with clear error
- [ ] AC-007.3: Already-used sessions rejected (one-time use)
- [ ] AC-007.4: Invalid nonce rejected with "tampering detected" error

TECHNICAL NOTES:
- Validation happens in Convex mutation
- Session marked as "used" atomically with jump creation
- Log validation failures for security monitoring

PRIORITY: P0
STORY POINTS: 2
```

#### EP-003: Video capture

##### US-008: Camera preview display
```
AS A user
I WANT TO see a live preview from my camera
SO THAT I can position myself correctly

ACCEPTANCE CRITERIA:
- [ ] AC-008.1: Camera preview fills capture area
- [ ] AC-008.2: Preview uses back camera by default
- [ ] AC-008.3: Mirror effect disabled (shows true orientation)
- [ ] AC-008.4: Preview maintains aspect ratio (no distortion)
- [ ] AC-008.5: Low latency (<100ms delay)

TECHNICAL NOTES:
- getUserMedia with facingMode: "environment"
- Attach stream to <video> element
- Set video.srcObject = stream

PRIORITY: P0
STORY POINTS: 2

INPUT:
- MediaStream from getUserMedia

OUTPUT:
- Live video preview in UI
```

##### US-009: Start video recording
```
AS A user
I WANT TO start recording when I tap the record button
SO THAT my jump is captured

ACCEPTANCE CRITERIA:
- [ ] AC-009.1: Red "Record" button clearly visible
- [ ] AC-009.2: Tap starts recording immediately
- [ ] AC-009.3: Visual indicator shows recording in progress (pulsing red dot)
- [ ] AC-009.4: Timer shows recording duration
- [ ] AC-009.5: Button changes to "Stop" during recording

TECHNICAL NOTES:
- WebCodecs: Create VideoEncoder, start encoding frames
- Fallback: Use MediaRecorder
- Store frames/chunks in memory buffer

PRIORITY: P0
STORY POINTS: 5

INPUT:
- MediaStream from camera
- Session nonce for overlay

OUTPUT:
- Recording state: active
- Frame buffer filling
```

##### US-010: Stop video recording
```
AS A user
I WANT TO stop recording when I tap the stop button
SO THAT my capture is complete

ACCEPTANCE CRITERIA:
- [ ] AC-010.1: "Stop" button ends recording
- [ ] AC-010.2: Auto-stop at 15 seconds maximum
- [ ] AC-010.3: Minimum 2 second recording enforced
- [ ] AC-010.4: "Processing" state shown immediately after stop
- [ ] AC-010.5: Camera preview continues (not frozen)

TECHNICAL NOTES:
- Flush VideoEncoder
- Mux frames into MP4 container
- Calculate actual FPS from timestamps

PRIORITY: P0
STORY POINTS: 3

INPUT:
- User tap or 15-second timeout

OUTPUT:
- Encoded video data (Uint8Array)
- Video metadata (duration, fps, resolution)
```

##### US-011: WebCodecs video encoding
```
AS THE SYSTEM
I WANT TO encode video using hardware acceleration
SO THAT encoding is fast and battery-efficient

ACCEPTANCE CRITERIA:
- [ ] AC-011.1: VideoEncoder used when available
- [ ] AC-011.2: H.264 codec (AVC) for universal playback
- [ ] AC-011.3: 4 Mbps target bitrate
- [ ] AC-011.4: Keyframe every 1 second
- [ ] AC-011.5: Encoding happens in real-time (no post-processing delay)

TECHNICAL NOTES:
- Use VideoEncoder API
- Configure: { codec: 'avc1.42E01E', width, height, bitrate, framerate }
- Handle EncodingError

PRIORITY: P0
STORY POINTS: 8

INPUT:
- VideoFrame objects from camera stream

OUTPUT:
- EncodedVideoChunk objects
```

##### US-012: MediaRecorder fallback
```
AS A user on an older browser
I WANT video capture to work even without WebCodecs
SO THAT I can still participate

ACCEPTANCE CRITERIA:
- [ ] AC-012.1: Fallback activates automatically when WebCodecs unavailable
- [ ] AC-012.2: Warning shown: "Using compatibility mode - quality may vary"
- [ ] AC-012.3: Recording still produces valid video
- [ ] AC-012.4: Maximum verification tier limited to Bronze

TECHNICAL NOTES:
- Feature-detect VideoEncoder before use
- MediaRecorder with mimeType: 'video/webm' or 'video/mp4'
- Convert to MP4 if needed using ffmpeg.wasm (optional)

PRIORITY: P1
STORY POINTS: 5
```

##### US-013: MP4 muxing
```
AS THE SYSTEM
I WANT TO package encoded video into MP4 container
SO THAT the video plays on all devices

ACCEPTANCE CRITERIA:
- [ ] AC-013.1: Valid MP4 file produced
- [ ] AC-013.2: Playable in Safari, Chrome, WeChat
- [ ] AC-013.3: Metadata includes duration, resolution, fps
- [ ] AC-013.4: File size reasonable (<20MB for 15s)

TECHNICAL NOTES:
- Use mp4-muxer library
- Add video track with AVC codec
- No audio track (simplify)

PRIORITY: P0
STORY POINTS: 5

INPUT:
- EncodedVideoChunk array
- Video metadata

OUTPUT:
- MP4 file as Uint8Array
```

#### EP-004: Sensor capture

##### US-014: Accelerometer data collection
```
AS THE SYSTEM
I WANT TO collect accelerometer data during capture
SO THAT jump physics can be verified

ACCEPTANCE CRITERIA:
- [ ] AC-014.1: Data collected at 60Hz (browser maximum)
- [ ] AC-014.2: X, Y, Z acceleration values captured
- [ ] AC-014.3: Timestamps synchronized with video
- [ ] AC-014.4: Collection starts with video recording
- [ ] AC-014.5: Collection stops with video recording

TECHNICAL NOTES:
- DeviceMotionEvent listener
- Use accelerationIncludingGravity (more reliable)
- Store in array buffer

PRIORITY: P0
STORY POINTS: 3

INPUT:
- DeviceMotionEvent stream

OUTPUT:
- Array of {timestamp, accelX, accelY, accelZ}
```

##### US-015: Gyroscope data collection
```
AS THE SYSTEM
I WANT TO collect gyroscope data during capture
SO THAT device rotation can be tracked

ACCEPTANCE CRITERIA:
- [ ] AC-015.1: Rotation rate (alpha, beta, gamma) captured
- [ ] AC-015.2: Same sampling rate as accelerometer
- [ ] AC-015.3: Combined with accelerometer in single data structure

TECHNICAL NOTES:
- DeviceMotionEvent.rotationRate
- Same listener as accelerometer

PRIORITY: P0
STORY POINTS: 2

INPUT:
- DeviceMotionEvent stream

OUTPUT:
- Array of {timestamp, rotationAlpha, rotationBeta, rotationGamma}
```

##### US-016: Sensor data without permission
```
AS A user who denied motion permission
I WANT capture to still work
SO THAT I can get at least a basic measurement

ACCEPTANCE CRITERIA:
- [ ] AC-016.1: Capture continues without sensor data
- [ ] AC-016.2: Warning shown: "Motion sensors unavailable"
- [ ] AC-016.3: Maximum tier limited to Bronze
- [ ] AC-016.4: Empty sensor array submitted (not null)

TECHNICAL NOTES:
- Graceful degradation
- Submit sensorData: [] (empty array)
- Set flag: sensorsAvailable: false

PRIORITY: P0
STORY POINTS: 2
```

#### EP-005: Proof generation

##### US-017: Video hash generation
```
AS THE SYSTEM
I WANT TO hash the video data
SO THAT tampering can be detected

ACCEPTANCE CRITERIA:
- [ ] AC-017.1: SHA-256 hash of raw video bytes
- [ ] AC-017.2: Hash computed client-side
- [ ] AC-017.3: Hash included in proof payload
- [ ] AC-017.4: Hash computation <1 second for typical video

TECHNICAL NOTES:
- crypto.subtle.digest('SHA-256', videoData)
- Convert ArrayBuffer to hex string

PRIORITY: P0
STORY POINTS: 2

INPUT:
- Video data (Uint8Array)

OUTPUT:
- Hash string (64 hex characters)
```

##### US-018: Sensor hash generation
```
AS THE SYSTEM
I WANT TO hash the sensor data
SO THAT sensor tampering can be detected

ACCEPTANCE CRITERIA:
- [ ] AC-018.1: SHA-256 hash of JSON-encoded sensor array
- [ ] AC-018.2: JSON keys sorted for deterministic output
- [ ] AC-018.3: Hash included in proof payload

TECHNICAL NOTES:
- JSON.stringify with sorted keys
- crypto.subtle.digest('SHA-256', ...)

PRIORITY: P0
STORY POINTS: 2

INPUT:
- Sensor data array

OUTPUT:
- Hash string (64 hex characters)
```

##### US-019: Cryptographic key generation
```
AS A first-time user
I WANT a signing key generated for my device
SO THAT my submissions can be authenticated

ACCEPTANCE CRITERIA:
- [ ] AC-019.1: ECDSA P-256 key pair generated
- [ ] AC-019.2: Private key stored securely in IndexedDB
- [ ] AC-019.3: Public key registered with backend
- [ ] AC-019.4: Key persists across sessions
- [ ] AC-019.5: Key rotation possible (manual)

TECHNICAL NOTES:
- crypto.subtle.generateKey('ECDSA', P-256)
- Export private key as JWK
- Encrypt with device fingerprint before storage

PRIORITY: P0
STORY POINTS: 5

INPUT:
- User ID
- Device fingerprint

OUTPUT:
- Key ID (from backend)
- Private key (stored locally)
```

##### US-020: Proof payload signing
```
AS THE SYSTEM
I WANT TO sign the proof payload
SO THAT the submission is authenticated

ACCEPTANCE CRITERIA:
- [ ] AC-020.1: Sign with ECDSA P-256 (ES256)
- [ ] AC-020.2: Payload includes session, nonce, hashes, timestamp
- [ ] AC-020.3: Signature encoded as base64
- [ ] AC-020.4: Key ID included for verification

TECHNICAL NOTES:
- crypto.subtle.sign('ECDSA', privateKey, data)
- Canonical JSON encoding of payload

PRIORITY: P0
STORY POINTS: 3

INPUT:
- Proof payload object
- Private key

OUTPUT:
- Signature (base64 string)
```

#### EP-006: Upload & submit

##### US-021: Generate upload URL
```
AS THE SYSTEM
I WANT TO get a direct upload URL from Cloudflare
SO THAT video uploads don't go through our servers

ACCEPTANCE CRITERIA:
- [ ] AC-021.1: URL requested from Convex backend
- [ ] AC-021.2: URL valid for 30 minutes
- [ ] AC-021.3: URL tied to session ID for tracking
- [ ] AC-021.4: Supports TUS resumable protocol

TECHNICAL NOTES:
- Convex function calls Cloudflare Stream API
- Return one-time upload URL

PRIORITY: P0
STORY POINTS: 3

INPUT:
- Session ID
- User ID
- Content type

OUTPUT:
- Upload URL
- Storage ID (pre-generated)
```

##### US-022: Video upload with TUS
```
AS A user
I WANT my video to upload reliably
SO THAT my capture isn't lost due to network issues

ACCEPTANCE CRITERIA:
- [ ] AC-022.1: Upload uses TUS resumable protocol
- [ ] AC-022.2: Progress bar shows upload percentage
- [ ] AC-022.3: Upload resumes automatically after network interruption
- [ ] AC-022.4: Maximum 3 retry attempts
- [ ] AC-022.5: Clear error message on final failure

TECHNICAL NOTES:
- Use tus-js-client library
- Chunk size: 5MB
- Exponential backoff on retry

PRIORITY: P0
STORY POINTS: 5

INPUT:
- Video file (Blob)
- Upload URL

OUTPUT:
- Storage ID (confirmed)
- Upload complete event
```

##### US-023: Sensor data upload
```
AS THE SYSTEM
I WANT TO upload sensor data to storage
SO THAT it can be analyzed with the video

ACCEPTANCE CRITERIA:
- [ ] AC-023.1: Sensor data uploaded as JSON file
- [ ] AC-023.2: Separate storage ID from video
- [ ] AC-023.3: Gzip compression for efficiency

TECHNICAL NOTES:
- Use same Cloudflare upload mechanism
- Content-Type: application/json
- Compress with pako if >100KB

PRIORITY: P0
STORY POINTS: 2

INPUT:
- Sensor data array

OUTPUT:
- Sensor storage ID
```

##### US-024: Submit jump to backend
```
AS A user
I WANT TO submit my capture for verification
SO THAT I can get my jump measurement

ACCEPTANCE CRITERIA:
- [ ] AC-024.1: Submit called after upload complete
- [ ] AC-024.2: Includes video storage ID, sensor storage ID, proof payload
- [ ] AC-024.3: Returns jump ID for tracking
- [ ] AC-024.4: Status shows "processing"

TECHNICAL NOTES:
- Call Convex: jump/jumps:submit
- Include all proof data

PRIORITY: P0
STORY POINTS: 3

INPUT:
- User ID
- Session ID
- Video storage ID
- Sensor storage ID
- Proof payload
- GPS (optional)

OUTPUT:
- Jump ID
- Status: "processing"
```

##### US-025: Upload progress indication
```
AS A user
I WANT TO see upload progress
SO THAT I know the system is working

ACCEPTANCE CRITERIA:
- [ ] AC-025.1: Progress bar shows 0-100%
- [ ] AC-025.2: Current step shown (encoding, uploading, submitting)
- [ ] AC-025.3: Estimated time remaining (optional)
- [ ] AC-025.4: Cancel button available during upload

TECHNICAL NOTES:
- TUS provides progress events
- Aggregate encoding + upload progress

PRIORITY: P0
STORY POINTS: 2
```

#### EP-007: Results display

##### US-026: Poll for results
```
AS A user waiting for results
I WANT TO see my results as soon as they're ready
SO THAT I don't have to refresh manually

ACCEPTANCE CRITERIA:
- [ ] AC-026.1: Poll every 2 seconds while processing
- [ ] AC-026.2: Stop polling after 60 seconds (timeout)
- [ ] AC-026.3: Stop polling when result received
- [ ] AC-026.4: Show "Still processing" message during wait

TECHNICAL NOTES:
- Use Convex subscription or polling
- Convex: jump/jumps:get with jumpId

PRIORITY: P0
STORY POINTS: 2

INPUT:
- Jump ID

OUTPUT:
- Jump status
- Results (when complete)
```

##### US-027: Display jump results
```
AS A user
I WANT TO see my verified jump height
SO THAT I know how high I jumped

ACCEPTANCE CRITERIA:
- [ ] AC-027.1: Jump height displayed prominently (e.g., "32.5 inches")
- [ ] AC-027.2: Metric conversion shown (82.6 cm)
- [ ] AC-027.3: Verification tier badge shown (Bronze/Silver)
- [ ] AC-027.4: Confidence score shown (e.g., "94%")
- [ ] AC-027.5: Flight time shown (e.g., "523ms")

TECHNICAL NOTES:
- Format numbers with locale
- Tier badge with appropriate color

PRIORITY: P0
STORY POINTS: 3

INPUT:
- Jump result object

OUTPUT:
- Formatted results UI
```

##### US-028: Handle rejected jump
```
AS A user whose jump was rejected
I WANT TO understand why and retry
SO THAT I can get a valid measurement

ACCEPTANCE CRITERIA:
- [ ] AC-028.1: "Could not verify jump" message shown
- [ ] AC-028.2: Reason provided if available (e.g., "Jump not detected")
- [ ] AC-028.3: "Try Again" button prominent
- [ ] AC-028.4: Tips for better capture shown

TECHNICAL NOTES:
- Display rejection reason from backend
- Link to help/tips page

PRIORITY: P0
STORY POINTS: 2
```

##### US-029: Jump again flow
```
AS A user who completed a capture
I WANT TO easily do another jump
SO THAT I can improve my score

ACCEPTANCE CRITERIA:
- [ ] AC-029.1: "Jump Again" button on results screen
- [ ] AC-029.2: Previous session cleared
- [ ] AC-029.3: New session started automatically
- [ ] AC-029.4: Camera remains active (no re-permission)

TECHNICAL NOTES:
- Reset state machine to SESSION_READY
- Reuse camera stream

PRIORITY: P1
STORY POINTS: 2
```

#### EP-008: Error handling

##### US-030: Network error during upload
```
AS A user who loses network during upload
I WANT my upload to resume when connection returns
SO THAT I don't lose my capture

ACCEPTANCE CRITERIA:
- [ ] AC-030.1: TUS automatically resumes upload
- [ ] AC-030.2: "Connection lost - retrying" message shown
- [ ] AC-030.3: Retry countdown visible
- [ ] AC-030.4: "Cancel" option available
- [ ] AC-030.5: After 3 failures, offer "Save locally" option

TECHNICAL NOTES:
- TUS handles resume automatically
- Detect navigator.onLine for status

PRIORITY: P0
STORY POINTS: 3
```

##### US-031: Camera access error
```
AS A user whose camera access fails
I WANT clear guidance on how to fix it
SO THAT I can complete my capture

ACCEPTANCE CRITERIA:
- [ ] AC-031.1: Specific error message based on error type
- [ ] AC-031.2: NotAllowedError: "Camera blocked - tap to open settings"
- [ ] AC-031.3: NotFoundError: "No camera found"
- [ ] AC-031.4: Link to browser-specific settings instructions

TECHNICAL NOTES:
- Catch getUserMedia errors by name
- Platform-specific help text

PRIORITY: P0
STORY POINTS: 2
```

##### US-032: Server error handling
```
AS A user who encounters a server error
I WANT TO know what happened and what to do
SO THAT I'm not confused

ACCEPTANCE CRITERIA:
- [ ] AC-032.1: Generic "Something went wrong" for 500 errors
- [ ] AC-032.2: "Try again" button
- [ ] AC-032.3: Error ID shown for support reference
- [ ] AC-032.4: Specific message for known errors (session expired, etc.)

TECHNICAL NOTES:
- Log errors to Sentry/monitoring
- Generate client-side error ID

PRIORITY: P0
STORY POINTS: 2
```

#### EP-009: Internationalization

##### US-033: Language selection
```
AS A user
I WANT TO use the app in my preferred language
SO THAT I can understand the interface

ACCEPTANCE CRITERIA:
- [ ] AC-033.1: Auto-detect browser language
- [ ] AC-033.2: Support English (en) and Chinese (zh-CN)
- [ ] AC-033.3: Language switcher available
- [ ] AC-033.4: Selection persisted in localStorage

TECHNICAL NOTES:
- Use navigator.language
- i18n library (svelte-i18n or custom)

PRIORITY: P1
STORY POINTS: 3
```

##### US-034: Chinese translations
```
AS A Chinese user (Wei)
I WANT TO see the interface in Chinese
SO THAT I can use the app comfortably

ACCEPTANCE CRITERIA:
- [ ] AC-034.1: All UI text translated to Simplified Chinese
- [ ] AC-034.2: Error messages in Chinese
- [ ] AC-034.3: Results in Chinese
- [ ] AC-034.4: Help text in Chinese

TECHNICAL NOTES:
- Professional translation (not machine)
- JSON locale files

PRIORITY: P1
STORY POINTS: 5
```

#### EP-010: Sharing

##### US-035: Share results
```
AS A user (Alex)
I WANT TO share my results on social media
SO THAT my friends can see my jump

ACCEPTANCE CRITERIA:
- [ ] AC-035.1: "Share" button on results screen
- [ ] AC-035.2: Generates shareable image with result
- [ ] AC-035.3: Uses Web Share API where available
- [ ] AC-035.4: Fallback to copy link

TECHNICAL NOTES:
- Canvas-based image generation
- navigator.share() with fallback

PRIORITY: P1
STORY POINTS: 5
```

##### US-036: WeChat sharing (China)
```
AS A Chinese user (Wei)
I WANT TO share to WeChat Moments
SO THAT my friends on WeChat can see my jump

ACCEPTANCE CRITERIA:
- [ ] AC-036.1: WeChat share option in WeChat browser
- [ ] AC-036.2: Proper preview image and title
- [ ] AC-036.3: Link opens correctly in WeChat

TECHNICAL NOTES:
- WeChat JS-SDK integration
- wx.onMenuShareTimeline

PRIORITY: P2
STORY POINTS: 5
```

---

## 5. Epics & feature breakdown

### 5.1 Epic dependency graph

```
                    ┌─────────────────┐
                    │   EP-001        │
                    │   Permission    │
                    │   & Setup       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   EP-002        │
                    │   Session       │
                    │   Management    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │   EP-003    │  │   EP-004    │  │   EP-005    │
     │   Video     │  │   Sensor    │  │   Proof     │
     │   Capture   │  │   Capture   │  │   Generation│
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   EP-006        │
                    │   Upload        │
                    │   & Submit      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   EP-007        │
                    │   Results       │
                    │   Display       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │   EP-008    │  │   EP-009    │  │   EP-010    │
     │   Error     │  │   i18n      │  │   Sharing   │
     │   Handling  │  │             │  │             │
     └─────────────┘  └─────────────┘  └─────────────┘
```

### 5.2 Feature breakdown by epic

#### EP-001: Permission & setup (13 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Camera permission | US-001 | P0 | 3 |
| Motion permission | US-002 | P0 | 2 |
| Browser compatibility | US-003 | P0 | 2 |
| HTTPS handling | US-004 | P0 | 1 |

#### EP-002: Session management (7 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Session creation | US-005 | P0 | 3 |
| Session timeout | US-006 | P0 | 2 |
| Session validation | US-007 | P0 | 2 |

#### EP-003: Video capture (28 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Camera preview | US-008 | P0 | 2 |
| Start recording | US-009 | P0 | 5 |
| Stop recording | US-010 | P0 | 3 |
| WebCodecs encoding | US-011 | P0 | 8 |
| MediaRecorder fallback | US-012 | P1 | 5 |
| MP4 muxing | US-013 | P0 | 5 |

#### EP-004: Sensor capture (7 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Accelerometer | US-014 | P0 | 3 |
| Gyroscope | US-015 | P0 | 2 |
| Graceful degradation | US-016 | P0 | 2 |

#### EP-005: Proof generation (12 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Video hash | US-017 | P0 | 2 |
| Sensor hash | US-018 | P0 | 2 |
| Key generation | US-019 | P0 | 5 |
| Payload signing | US-020 | P0 | 3 |

#### EP-006: Upload & submit (15 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Upload URL | US-021 | P0 | 3 |
| TUS upload | US-022 | P0 | 5 |
| Sensor upload | US-023 | P0 | 2 |
| Jump submission | US-024 | P0 | 3 |
| Progress UI | US-025 | P0 | 2 |

#### EP-007: Results display (9 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Result polling | US-026 | P0 | 2 |
| Result display | US-027 | P0 | 3 |
| Rejection handling | US-028 | P0 | 2 |
| Jump again | US-029 | P1 | 2 |

#### EP-008: Error handling (7 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Network errors | US-030 | P0 | 3 |
| Camera errors | US-031 | P0 | 2 |
| Server errors | US-032 | P0 | 2 |

#### EP-009: Internationalization (8 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Language selection | US-033 | P1 | 3 |
| Chinese translation | US-034 | P1 | 5 |

#### EP-010: Sharing (10 story points)
| Feature | User Stories | Priority | Points |
|---------|-------------|----------|--------|
| Social sharing | US-035 | P1 | 5 |
| WeChat sharing | US-036 | P2 | 5 |

### 5.3 Total effort summary

| Priority | Story Points | Percentage |
|----------|-------------|------------|
| P0 (Must Have) | 85 | 74% |
| P1 (Should Have) | 20 | 17% |
| P2 (Nice to Have) | 10 | 9% |
| **Total** | **115** | 100% |

---

*Continued in PRD-PART2.md...*
