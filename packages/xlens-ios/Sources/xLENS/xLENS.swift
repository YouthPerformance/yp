// ═══════════════════════════════════════════════════════════════
// xLENS iOS SDK
// Verified Performance Capture for YP Jump
// "Proof of Physical Work" - The missing standard
//
// Swift 2026 Best Practices:
// - @Observable macro (iOS 17+)
// - @MainActor isolation
// - Sendable conformance
// - Environment-based DI
// ═══════════════════════════════════════════════════════════════

@_exported import Foundation
@_exported import AVFoundation
@_exported import CoreMotion
@_exported import SwiftUI

// MARK: - Version Info

public enum XLens {
    public static let version = "1.0.0"
    public static let apiVersion = "v1"
    public static let minIOSVersion = "17.0"

    /// Quick start: Create a configured client
    ///
    /// ```swift
    /// let client = XLens.createClient(
    ///     convexUrl: URL(string: "https://your-convex.cloud")!,
    ///     userId: "user_123"
    /// )
    /// ```
    @MainActor
    public static func createClient(
        convexUrl: URL,
        authToken: String? = nil,
        userId: String
    ) -> XLensClient {
        return XLensClient(configuration: .init(
            convexUrl: convexUrl,
            authToken: authToken,
            userId: userId
        ))
    }
}

// MARK: - SwiftUI Integration

/// Camera preview view for SwiftUI
public struct XLensCameraPreview: UIViewRepresentable {
    let previewLayer: AVCaptureVideoPreviewLayer?

    public init(previewLayer: AVCaptureVideoPreviewLayer?) {
        self.previewLayer = previewLayer
    }

    public func makeUIView(context: Context) -> UIView {
        let view = UIView()
        view.backgroundColor = .black

        if let layer = previewLayer {
            layer.frame = view.bounds
            layer.videoGravity = .resizeAspectFill
            view.layer.addSublayer(layer)
        }

        return view
    }

    public func updateUIView(_ uiView: UIView, context: Context) {
        previewLayer?.frame = uiView.bounds
    }
}

/// Nonce overlay view for displaying verification code
public struct XLensNonceOverlay: View {
    let nonceDisplay: String
    let remainingTime: TimeInterval

    public init(nonceDisplay: String, remainingTime: TimeInterval) {
        self.nonceDisplay = nonceDisplay
        self.remainingTime = remainingTime
    }

    public var body: some View {
        VStack {
            Text(nonceDisplay)
                .font(.system(size: 48, weight: .bold, design: .monospaced))
                .foregroundStyle(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(.black.opacity(0.7))
                .clipShape(RoundedRectangle(cornerRadius: 12))

            Text("\(Int(remainingTime))s")
                .font(.caption)
                .foregroundStyle(.white.opacity(0.8))
        }
    }
}

// MARK: - Usage Example
/*

 // 1. Create client (use Environment for production)
 let client = XLens.createClient(
     convexUrl: URL(string: "https://your-app.convex.cloud")!,
     userId: "user_123"
 )

 // 2. In your App, inject into environment
 @main
 struct MyApp: App {
     @State private var client = XLens.createClient(...)

     var body: some Scene {
         WindowGroup {
             ContentView()
                 .xlensClient(client)
         }
     }
 }

 // 3. In your View, access from environment
 struct JumpCaptureView: View {
     @Environment(\.xlensClient) var client

     var body: some View {
         // Use client.state, client.currentSession, etc.
     }
 }

 // 4. Capture flow
 let session = try await client.startSession(userId: "user_123")
 // Display session.nonceDisplay to user
 try await client.startCapture()
 // User jumps...
 let result = try await client.stopCapture()
 let submission = try await client.submitJump(userId: "user_123", captureResult: result)

*/
