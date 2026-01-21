// ═══════════════════════════════════════════════════════════════
// xLENS TYPES
// Core data structures for the xLENS verification protocol
// ═══════════════════════════════════════════════════════════════

import Foundation
import CoreMotion

// MARK: - Session Types

/// Server-issued session with nonce for challenge-response
struct XLENSSession: Codable {
    let sessionId: String
    let nonce: String
    let nonceDisplay: String
    let expiresAt: Date
    let expiresInMs: Int
}

// MARK: - Device Key Types

/// Hardware-backed device signing key
struct DeviceKey: Codable {
    let keyId: String
    let publicKey: String // Base64 encoded
    let platform: String // "ios"
    let deviceModel: String
    let osVersion: String
    let hardwareLevel: HardwareLevel

    enum HardwareLevel: String, Codable {
        case strongbox // Secure Enclave backed
        case tee // Trusted execution
        case software // Software only
    }
}

// MARK: - Proof Pack Types

/// Complete proof payload sent to server
struct ProofPayload: Codable {
    let sessionId: String
    let nonce: String
    let capture: CaptureMetadata
    let hashes: HashBundle
    let signature: SignatureBundle
    let gps: GPSData?
}

/// Capture session metadata
struct CaptureMetadata: Codable {
    let testType: String // "VERT_JUMP"
    let startedAtMs: Int64
    let endedAtMs: Int64
    let fps: Double
    let device: DeviceInfo
}

/// Device information
struct DeviceInfo: Codable {
    let platform: String // "ios"
    let model: String
    let osVersion: String
    let appVersion: String
}

/// SHA-256 hashes of evidence files
struct HashBundle: Codable {
    let videoSha256: String
    let sensorSha256: String
    let metadataSha256: String
}

/// ES256 signature over proof
struct SignatureBundle: Codable {
    let alg: String // "ES256"
    let keyId: String
    let sig: String // Base64
}

/// GPS location data
struct GPSData: Codable {
    let lat: Double
    let lng: Double
    let accuracyM: Double
    let capturedAtMs: Int64
}

// MARK: - IMU Types

/// Single IMU sample at ~100Hz
struct IMUSample: Codable {
    let timestampMs: Int64
    let accelerometerX: Double
    let accelerometerY: Double
    let accelerometerZ: Double
    let gyroscopeX: Double
    let gyroscopeY: Double
    let gyroscopeZ: Double

    /// Magnitude of acceleration (in G)
    var accelerationMagnitude: Double {
        sqrt(accelerometerX * accelerometerX +
             accelerometerY * accelerometerY +
             accelerometerZ * accelerometerZ)
    }
}

/// Complete IMU recording session
struct IMURecording: Codable {
    let samples: [IMUSample]
    let startTimeMs: Int64
    let endTimeMs: Int64
    let sampleRateHz: Double
    let deviceModel: String

    /// Duration in milliseconds
    var durationMs: Int64 {
        endTimeMs - startTimeMs
    }

    /// Number of samples
    var sampleCount: Int {
        samples.count
    }
}

// MARK: - Verification Types

/// Verification tier from xLENS gates
enum VerificationTier: String, Codable {
    case measured // Phase A: Basic measurement
    case bronze   // Phase B: Basic verification
    case silver   // Phase B: Attested + correlated
    case gold     // Phase C: Full 4-gate
    case rejected // Failed verification
}

/// Gate scores from server
struct GateScores: Codable {
    let attestation: Double // 0-1
    let cryptoValid: Bool
    let liveness: Double // 0-1
    let physics: Double // 0-1 - THE MOAT
}

// MARK: - Jump Result Types

/// Complete jump result from server
struct JumpResult: Codable {
    let jumpId: String
    let heightInches: Double
    let heightCm: Double
    let flightTimeMs: Int
    let confidence: Double
    let verificationTier: VerificationTier
    let gateScores: GateScores?
}

// MARK: - VPC Types

/// Verified Performance Certificate
struct VPC: Codable {
    let vpcId: String
    let athleteId: String
    let testType: String
    let result: VPCResult
    let verification: VPCVerification
    let capture: VPCCapture
    let issuedAtUtc: String
    let verifyUrl: String
}

struct VPCResult: Codable {
    let heightInches: Double
    let heightCm: Double
    let flightTimeMs: Int
}

struct VPCVerification: Codable {
    let tier: String
    let confidence: Double
    let gatesPassed: [String]
    let phase: String
}

struct VPCCapture: Codable {
    let deviceModel: String
    let appVersion: String
    let capturedAtUtc: String
    let fps: Double
}

// MARK: - Error Types

/// xLENS-specific errors
enum XLENSError: Error, LocalizedError {
    case sessionExpired
    case sessionNotFound
    case nonceMismatch
    case deviceKeyNotFound
    case signatureFailed
    case imuRecordingFailed
    case videoCaptureFailed
    case uploadFailed
    case verificationFailed(String)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .sessionExpired:
            return "Session expired. Please start a new jump."
        case .sessionNotFound:
            return "Session not found. Please try again."
        case .nonceMismatch:
            return "Security verification failed. Please try again."
        case .deviceKeyNotFound:
            return "Device not registered. Please re-authenticate."
        case .signatureFailed:
            return "Failed to sign proof. Please try again."
        case .imuRecordingFailed:
            return "Failed to record motion data. Please check permissions."
        case .videoCaptureFailed:
            return "Failed to capture video. Please check camera permissions."
        case .uploadFailed:
            return "Failed to upload. Please check your connection."
        case .verificationFailed(let reason):
            return "Verification failed: \(reason)"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        }
    }
}
