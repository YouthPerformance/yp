# YP Jump - Android

Native Android app for verified vertical jump measurement.

## Requirements

- Android Studio Koala (2024.1.1) or newer
- JDK 17+
- Android SDK 34
- Kotlin 2.0.0

## Getting Started

1. Open project in Android Studio
2. Copy `local.properties.example` to `local.properties`
3. Set your `sdk.dir` path
4. Sync Gradle
5. Build and run on device (camera required)

## Project Structure

```
app/src/main/
├── java/com/youthperformance/jump/
│   ├── MainActivity.kt           # Entry point
│   ├── data/
│   │   └── Models.kt             # All data models
│   ├── navigation/
│   │   └── NavGraph.kt           # Bottom navigation
│   └── ui/
│       ├── theme/
│       │   └── Theme.kt          # YP brand colors
│       └── screens/
│           ├── HomeScreen.kt     # Dashboard
│           ├── CaptureScreen.kt  # Camera capture
│           ├── ResultScreen.kt   # Jump result display
│           ├── LeaderboardScreen.kt
│           ├── ProfileScreen.kt
│           ├── AuthScreen.kt     # Login/signup
│           └── OnboardingScreen.kt
└── res/
    ├── values/
    │   ├── strings.xml
    │   ├── colors.xml
    │   └── themes.xml
    └── xml/
        ├── backup_rules.xml
        └── data_extraction_rules.xml
```

## Current State

**Phase 0 Complete:** UI shell with mock data

- All screens scaffolded with Jetpack Compose
- Mock data models for development
- Navigation structure in place
- Material 3 theming with YP brand colors

**Next Steps (Phase 1):**
- [ ] Integrate CameraX for 120fps capture
- [ ] Connect to Convex backend
- [ ] Implement BetterAuth
- [ ] Add Gemini 3 Flash integration
- [ ] China market: Add JPush SDK

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | Jetpack Compose |
| Camera | CameraX (120fps) |
| Attestation | Play Integrity |
| Push | FCM (global) / JPush (China) |
| Backend | Convex |
| Auth | BetterAuth |
| AI | Gemini 3 Flash |

## Testing on Device

Camera features require a physical device. Emulator can be used for:
- UI development
- Navigation testing
- Mock data visualization

## Build Commands

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Run tests
./gradlew test

# Connected device tests
./gradlew connectedAndroidTest

# Lint check
./gradlew lint
```

## China Market Strategy

For China distribution (no Google Play Services):

1. **Push Notifications**: JPush SDK instead of FCM
2. **App Stores**:
   - Huawei AppGallery
   - Xiaomi GetApps
   - Tencent MyApp
   - Oppo App Market
   - Vivo App Store
3. **Device Attestation**: Device ID + server-side checks (no Play Integrity)
4. **Payments**: WeChat Pay, Alipay integration

## Environment Variables

Add to `local.properties` (not committed):
```properties
CONVEX_URL=your_convex_deployment_url
GEMINI_API_KEY=your_api_key
JPUSH_APP_KEY=your_jpush_key  # China only
```

## Dependencies

Key dependencies (see `gradle/libs.versions.toml`):
- Jetpack Compose BOM 2024.06.00
- CameraX 1.3.4
- Navigation Compose 2.7.7
- Material 3
