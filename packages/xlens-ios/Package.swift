// swift-tools-version:5.9
// xLENS iOS SDK
// Verified Performance Capture for YP Jump

import PackageDescription

let package = Package(
    name: "xLENS",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "xLENS",
            targets: ["xLENS"]
        ),
    ],
    dependencies: [
        // Convex Swift client (when available, for now we use HTTP)
        // CryptoKit is built-in for iOS 13+
    ],
    targets: [
        .target(
            name: "xLENS",
            dependencies: [],
            path: "Sources"
        ),
        .testTarget(
            name: "xLENSTests",
            dependencies: ["xLENS"],
            path: "Tests"
        ),
    ]
)
