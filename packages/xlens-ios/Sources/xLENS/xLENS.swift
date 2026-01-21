// ═══════════════════════════════════════════════════════════════
// xLENS iOS SDK
// Verified Performance Capture for YP Jump
// "Proof of Physical Work" - The missing standard
// ═══════════════════════════════════════════════════════════════

// Re-export all public types
@_exported import Foundation
@_exported import AVFoundation
@_exported import CoreMotion

// Version info
public enum XLens {
    public static let version = "1.0.0"
    public static let apiVersion = "v1"

    /// Quick start: Create a configured client
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

// MARK: - Usage Example
/*

 // 1. Create client
 let client = XLens.createClient(
     convexUrl: URL(string: "https://your-app.convex.cloud")!,
     userId: "user_123"
 )

 // 2. Start a session (gets nonce from server)
 let session = try await client.startSession(userId: "user_123")

 // 3. Display nonce and start capture
 print("Show this code: \(session.nonceDisplay)")
 try await client.startCapture()

 // 4. User performs jump...

 // 5. Stop capture and get results
 let captureResult = try await client.stopCapture()

 // 6. Submit for verification
 let result = try await client.submitJump(
     userId: "user_123",
     captureResult: captureResult
 )

 print("Jump submitted: \(result.jumpId)")

*/
