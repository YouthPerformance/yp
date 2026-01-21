// ═══════════════════════════════════════════════════════════════
// xLENS EXCEPTIONS
// Exception types for the xLENS SDK
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens

sealed class XLensException(message: String, cause: Throwable? = null) : Exception(message, cause) {

    // Session exceptions
    class InvalidState(message: String) : XLensException("Invalid state: $message")
    data object SessionExpired : XLensException("Session has expired. Please start a new session.")
    data object SessionNotFound : XLensException("Session not found")
    data object NonceValidationFailed : XLensException("Nonce validation failed - potential replay attack detected")

    // Capture exceptions
    data object CameraUnavailable : XLensException("Camera is not available")
    data object MicrophoneUnavailable : XLensException("Microphone is not available")
    data object CaptureNotStarted : XLensException("Capture has not been started")
    class CaptureFailed(reason: String) : XLensException("Capture failed: $reason")
    class EncodingFailed(reason: String) : XLensException("Video encoding failed: $reason")

    // Sensor exceptions
    data object MotionUnavailable : XLensException("Motion sensors are not available on this device")
    data object SensorDataMissing : XLensException("Required sensor data is missing")

    // Crypto exceptions
    data object KeyGenerationFailed : XLensException("Failed to generate cryptographic key")
    data object SignatureFailed : XLensException("Failed to create signature")
    data object HashingFailed : XLensException("Failed to hash data")
    class AttestationFailed(reason: String) : XLensException("Device attestation failed: $reason")

    // Network exceptions
    class NetworkError(cause: Throwable) : XLensException("Network error: ${cause.message}", cause)
    class UploadFailed(reason: String) : XLensException("Upload failed: $reason")
    class ServerError(code: Int, message: String) : XLensException("Server error ($code): $message")
    class DecodingError(reason: String) : XLensException("Failed to decode response: $reason")

    // Storage exceptions
    class StorageError(reason: String) : XLensException("Storage error: $reason")
    class FileNotFound(path: String) : XLensException("File not found: $path")

    // Validation exceptions
    class InvalidConfiguration(reason: String) : XLensException("Invalid configuration: $reason")
    class InvalidInput(reason: String) : XLensException("Invalid input: $reason")
}
