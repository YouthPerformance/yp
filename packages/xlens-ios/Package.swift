// swift-tools-version:5.9
// xLENS iOS SDK
// Verified Performance Capture for YP Jump
//
// Swift 2026 Best Practices:
// - Requires iOS 17+ for @Observable macro
// - Pure async/await, no Combine
// - Sendable conformance throughout

import PackageDescription

let package = Package(
    name: "xLENS",
    platforms: [
        .iOS(.v17) // Required for @Observable macro
    ],
    products: [
        .library(
            name: "xLENS",
            targets: ["xLENS"]
        ),
    ],
    dependencies: [
        // No external dependencies
        // - CryptoKit is built-in for iOS 13+
        // - Observation framework is built-in for iOS 17+
    ],
    targets: [
        .target(
            name: "xLENS",
            dependencies: [],
            path: "Sources",
            swiftSettings: [
                .enableExperimentalFeature("StrictConcurrency")
            ]
        ),
        .testTarget(
            name: "xLENSTests",
            dependencies: ["xLENS"],
            path: "Tests"
        ),
    ]
)
