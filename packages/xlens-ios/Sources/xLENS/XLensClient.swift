// ═══════════════════════════════════════════════════════════════
// xLENS CLIENT
// Main entry point for xLENS SDK
// Coordinates session management, capture, and proof generation
//
// Swift 2026 Best Practices Applied:
// - @Observable macro (not ObservableObject)
// - @MainActor for UI state isolation
// - Sendable conformance for concurrency safety
// - Environment-based dependency injection
// - No Combine - pure async/await
// ═══════════════════════════════════════════════════════════════

import Foundation
import Observation
import SwiftUI
import AVFoundation

/// Main xLENS SDK client for iOS
/// Handles session management, video/sensor capture, and proof generation
@MainActor
@Observable
public final class XLensClient {

    // MARK: - Observable State

    public private(set) var state: XLensState = .idle
    public private(set) var currentSession: Session?
    public private(set) var lastJump: Jump?

    // MARK: - Private Properties

    private let convexClient: ConvexClient
    private let captureManager: CaptureManager
    private let proofGenerator: ProofGenerator
    private let deviceKeyManager: DeviceKeyManager

    // MARK: - Configuration

    public struct Configuration: Sendable {
        public let convexUrl: URL
        public let authToken: String?
        public let userId: String

        public init(convexUrl: URL, authToken: String? = nil, userId: String) {
            self.convexUrl = convexUrl
            self.authToken = authToken
            self.userId = userId
        }
    }

    // MARK: - Initialization

    public init(configuration: Configuration) {
        self.convexClient = ConvexClient(
            baseURL: configuration.convexUrl,
            authToken: configuration.authToken
        )
        self.captureManager = CaptureManager()
        self.proofGenerator = ProofGenerator()
        self.deviceKeyManager = DeviceKeyManager(userId: configuration.userId)
    }

    // MARK: - Public API

    /// Start a new capture session
    /// Fetches a nonce from the server for liveness verification
    public func startSession(userId: String) async throws -> Session {
        guard state == .idle else {
            throw XLensError.invalidState("Cannot start session while in state: \(state)")
        }

        state = .preparingSession

        do {
            // Get device key (or create if first time)
            let deviceKey = try await deviceKeyManager.getOrCreateKey()

            // Request session from Convex
            let sessionResponse = try await convexClient.createSession(
                userId: userId,
                deviceKeyId: deviceKey.keyId
            )

            let session = Session(
                id: sessionResponse.sessionId,
                nonce: sessionResponse.nonce,
                nonceDisplay: sessionResponse.nonceDisplay,
                expiresAt: Date(timeIntervalSince1970: Double(sessionResponse.expiresAt) / 1000),
                deviceKeyId: deviceKey.keyId
            )

            currentSession = session
            state = .sessionReady

            return session
        } catch {
            state = .error(error)
            throw error
        }
    }

    /// Begin video/sensor capture
    /// Must have an active session first
    public func startCapture() async throws {
        guard state == .sessionReady, let session = currentSession else {
            throw XLensError.invalidState("Must have active session before capturing")
        }

        // Check session hasn't expired
        guard Date() < session.expiresAt else {
            throw XLensError.sessionExpired
        }

        state = .capturing

        do {
            try await captureManager.startCapture(
                nonceDisplay: session.nonceDisplay
            )
        } catch {
            state = .error(error)
            throw error
        }
    }

    /// Stop capture and process the jump
    public func stopCapture() async throws -> CaptureResult {
        guard state == .capturing else {
            throw XLensError.invalidState("Not currently capturing")
        }

        state = .processing

        do {
            let captureResult = try await captureManager.stopCapture()
            return captureResult
        } catch {
            state = .error(error)
            throw error
        }
    }

    /// Submit the captured jump to the server
    public func submitJump(
        userId: String,
        captureResult: CaptureResult,
        gps: GPSLocation? = nil
    ) async throws -> JumpSubmissionResult {
        guard let session = currentSession else {
            throw XLensError.invalidState("No active session")
        }

        state = .uploading

        do {
            // Get device key for signing
            let deviceKey = try await deviceKeyManager.getOrCreateKey()

            // Generate proof payload
            let proof = try await proofGenerator.generateProof(
                session: session,
                captureResult: captureResult,
                deviceKey: deviceKey
            )

            // Upload video to Convex storage
            let videoStorageId = try await convexClient.uploadFile(
                data: captureResult.videoData,
                contentType: "video/mp4"
            )

            // Upload sensor data to Convex storage
            let sensorStorageId = try await convexClient.uploadFile(
                data: captureResult.sensorData,
                contentType: "application/json"
            )

            // Submit jump
            let result = try await convexClient.submitJump(
                userId: userId,
                sessionId: session.id,
                videoStorageId: videoStorageId,
                sensorStorageId: sensorStorageId,
                proofPayload: proof,
                gps: gps
            )

            // Mark as uploaded
            try await convexClient.markJumpUploaded(jumpId: result.jumpId)

            let jump = Jump(
                id: result.jumpId,
                status: .processing,
                sessionId: session.id
            )

            lastJump = jump
            state = .complete
            currentSession = nil

            return JumpSubmissionResult(
                jumpId: result.jumpId,
                status: "processing"
            )
        } catch {
            state = .error(error)
            throw error
        }
    }

    /// Cancel current session/capture
    public func cancel() {
        captureManager.cancelCapture()
        currentSession = nil
        state = .idle
    }

    /// Reset to idle state
    public func reset() {
        cancel()
        lastJump = nil
    }

    /// Check daily jump cap for user
    public func checkDailyCap(userId: String) async throws -> DailyCapStatus {
        return try await convexClient.checkDailyCap(userId: userId)
    }

    /// Get user's jump history
    public func getJumpHistory(userId: String, limit: Int = 50) async throws -> [Jump] {
        return try await convexClient.listJumps(userId: userId, limit: limit)
    }

    /// Get user's best jump
    public func getBestJump(userId: String, minTier: VerificationTier? = nil) async throws -> Jump? {
        return try await convexClient.getBestJump(userId: userId, minTier: minTier)
    }

    /// Get the camera preview layer for UI display
    public var previewLayer: AVCaptureVideoPreviewLayer? {
        captureManager.preview
    }
}

// MARK: - Supporting Types

public enum XLensState: Equatable, Sendable {
    case idle
    case preparingSession
    case sessionReady
    case capturing
    case processing
    case uploading
    case complete
    case error(Error)

    public static func == (lhs: XLensState, rhs: XLensState) -> Bool {
        switch (lhs, rhs) {
        case (.idle, .idle),
             (.preparingSession, .preparingSession),
             (.sessionReady, .sessionReady),
             (.capturing, .capturing),
             (.processing, .processing),
             (.uploading, .uploading),
             (.complete, .complete):
            return true
        case (.error, .error):
            return true // Simplified comparison
        default:
            return false
        }
    }
}

public struct Session: Sendable {
    public let id: String
    public let nonce: String
    public let nonceDisplay: String
    public let expiresAt: Date
    public let deviceKeyId: String

    public var isExpired: Bool {
        Date() >= expiresAt
    }

    public var remainingTime: TimeInterval {
        max(0, expiresAt.timeIntervalSinceNow)
    }
}

public struct Jump: Identifiable, Sendable {
    public let id: String
    public var status: JumpStatus
    public let sessionId: String
    public var heightInches: Double?
    public var heightCm: Double?
    public var flightTimeMs: Int?
    public var verificationTier: VerificationTier?
    public var confidence: Double?
}

public enum JumpStatus: String, Codable, Sendable {
    case uploading
    case processing
    case complete
    case flagged
    case challenged
}

public enum VerificationTier: String, Codable, Sendable {
    case measured
    case bronze
    case silver
    case gold
    case rejected
}

public struct GPSLocation: Codable, Sendable {
    public let city: String
    public let state: String?
    public let country: String

    public init(city: String, state: String? = nil, country: String) {
        self.city = city
        self.state = state
        self.country = country
    }
}

public struct DailyCapStatus: Sendable {
    public let jumpsUsed: Int
    public let remaining: Int
    public let cap: Int
    public let isOverCap: Bool
}

public struct JumpSubmissionResult: Sendable {
    public let jumpId: String
    public let status: String
}

public struct CaptureResult: Sendable {
    public let videoData: Data
    public let videoURL: URL
    public let sensorData: Data
    public let startTime: Date
    public let endTime: Date
    public let fps: Int
    public let imuSamples: [IMUSample]
}

public struct IMUSample: Codable, Sendable {
    public let timestamp: TimeInterval
    public let accelerationX: Double
    public let accelerationY: Double
    public let accelerationZ: Double
    public let rotationX: Double
    public let rotationY: Double
    public let rotationZ: Double
}

// MARK: - Environment Key for Dependency Injection

public struct XLensClientKey: EnvironmentKey {
    public static let defaultValue: XLensClient? = nil
}

public extension EnvironmentValues {
    var xlensClient: XLensClient? {
        get { self[XLensClientKey.self] }
        set { self[XLensClientKey.self] = newValue }
    }
}

public extension View {
    /// Inject xLENS client into the environment
    func xlensClient(_ client: XLensClient) -> some View {
        environment(\.xlensClient, client)
    }
}
