// ═══════════════════════════════════════════════════════════════
// xLENS ERRORS
// Error types for the xLENS SDK
//
// Swift 2026 Best Practices:
// - Sendable conformance for concurrency safety
// - LocalizedError for user-facing messages
// ═══════════════════════════════════════════════════════════════

import Foundation

public enum XLensError: LocalizedError, Sendable {
    // Session errors
    case invalidState(String)
    case sessionExpired
    case sessionNotFound
    case nonceValidationFailed

    // Capture errors
    case cameraUnavailable
    case microphoneUnavailable
    case captureNotStarted
    case captureFailed(String)
    case encodingFailed(String)

    // Sensor errors
    case motionUnavailable
    case sensorDataMissing

    // Crypto errors
    case keyGenerationFailed
    case signatureFailed
    case hashingFailed
    case attestationFailed(String)

    // Network errors
    case networkError(String) // Changed from Error to String for Sendable
    case uploadFailed(String)
    case serverError(Int, String)
    case decodingError(String)

    // Storage errors
    case storageError(String)
    case fileNotFound(String)

    // Validation errors
    case invalidConfiguration(String)
    case invalidInput(String)

    public var errorDescription: String? {
        switch self {
        case .invalidState(let message):
            return "Invalid state: \(message)"
        case .sessionExpired:
            return "Session has expired. Please start a new session."
        case .sessionNotFound:
            return "Session not found"
        case .nonceValidationFailed:
            return "Nonce validation failed - potential replay attack detected"

        case .cameraUnavailable:
            return "Camera is not available"
        case .microphoneUnavailable:
            return "Microphone is not available"
        case .captureNotStarted:
            return "Capture has not been started"
        case .captureFailed(let reason):
            return "Capture failed: \(reason)"
        case .encodingFailed(let reason):
            return "Video encoding failed: \(reason)"

        case .motionUnavailable:
            return "Motion sensors are not available on this device"
        case .sensorDataMissing:
            return "Required sensor data is missing"

        case .keyGenerationFailed:
            return "Failed to generate cryptographic key"
        case .signatureFailed:
            return "Failed to create signature"
        case .hashingFailed:
            return "Failed to hash data"
        case .attestationFailed(let reason):
            return "Device attestation failed: \(reason)"

        case .networkError(let message):
            return "Network error: \(message)"
        case .uploadFailed(let reason):
            return "Upload failed: \(reason)"
        case .serverError(let code, let message):
            return "Server error (\(code)): \(message)"
        case .decodingError(let reason):
            return "Failed to decode response: \(reason)"

        case .storageError(let reason):
            return "Storage error: \(reason)"
        case .fileNotFound(let path):
            return "File not found: \(path)"

        case .invalidConfiguration(let reason):
            return "Invalid configuration: \(reason)"
        case .invalidInput(let reason):
            return "Invalid input: \(reason)"
        }
    }
}
