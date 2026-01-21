# YP Jump - iOS

Native iOS app for verified vertical jump measurement.

## Requirements

- Xcode 15.4+
- iOS 17.0+
- Swift 5.9+

## Getting Started

1. Open `YPJump.xcodeproj` in Xcode
2. Select your development team in Signing & Capabilities
3. Build and run on device (camera required)

## Project Structure

```
YPJump/
├── YPJumpApp.swift       # App entry point
├── ContentView.swift     # Root view with auth flow
├── Navigation/
│   └── MainTabView.swift # Tab bar navigation
├── Models/
│   ├── JumpUser.swift    # User model
│   ├── Jump.swift        # Jump measurement model
│   └── LeaderboardEntry.swift
├── Views/
│   ├── HomeView.swift    # Dashboard
│   ├── CaptureView.swift # Camera capture
│   ├── ResultView.swift  # Jump result display
│   ├── LeaderboardView.swift
│   ├── ProfileView.swift
│   ├── AuthView.swift    # Login/signup
│   └── OnboardingView.swift
└── Assets.xcassets/
```

## Current State

**Phase 0 Complete:** UI shell with mock data

- All screens scaffolded with SwiftUI
- Mock data models for development
- Navigation structure in place

**Next Steps (Phase 1):**
- [ ] Integrate AVFoundation for 240fps capture
- [ ] Connect to Convex backend
- [ ] Implement BetterAuth
- [ ] Add Gemini 3 Flash integration

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | SwiftUI |
| Camera | AVFoundation (240fps) |
| Attestation | App Attest |
| Push | APNs |
| Backend | Convex |
| Auth | BetterAuth |
| AI | Gemini 3 Flash |

## Testing on Device

Camera features require a physical device. Simulator can be used for:
- UI development
- Navigation testing
- Mock data visualization

## Build Commands

```bash
# Build from command line
xcodebuild -project YPJump.xcodeproj -scheme YPJump -configuration Debug build

# Run tests
xcodebuild -project YPJump.xcodeproj -scheme YPJump test

# Archive for distribution
xcodebuild -project YPJump.xcodeproj -scheme YPJump -configuration Release archive
```

## Environment Variables

Set these in your scheme or Info.plist:
- `CONVEX_URL` - Convex deployment URL
- `GEMINI_API_KEY` - Gemini 3 Flash API key (server-side only)
