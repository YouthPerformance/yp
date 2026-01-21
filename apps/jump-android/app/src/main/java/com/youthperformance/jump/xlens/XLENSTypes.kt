// ═══════════════════════════════════════════════════════════════
// xLENS TYPES
// Core data structures for the xLENS verification protocol
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import kotlinx.serialization.Serializable
import java.util.Date

// MARK: - Session Types

/**
 * Server-issued session with nonce for challenge-response
 */
@Serializable
data class XLENSSession(
    val sessionId: String,
    val nonce: String,
    val nonceDisplay: String,
    val expiresAt: Long, // Unix timestamp ms
    val expiresInMs: Int
) {
    val isExpired: Boolean
        get() = System.currentTimeMillis() > expiresAt

    val secondsRemaining: Int
        get() = maxOf(0, ((expiresAt - System.currentTimeMillis()) / 1000).toInt())
}

// MARK: - Device Key Types

/**
 * Hardware-backed device signing key
 */
@Serializable
data class DeviceKey(
    val keyId: String,
    val publicKey: String, // Base64 encoded
    val platform: String, // "android"
    val deviceModel: String,
    val osVersion: String,
    val hardwareLevel: HardwareLevel
) {
    @Serializable
    enum class HardwareLevel {
        STRONGBOX, // StrongBox backed (Gold eligible)
        TEE,       // Trusted Execution Environment (Silver max)
        SOFTWARE   // Software only (Bronze max)
    }
}

// MARK: - Proof Pack Types

/**
 * Complete proof payload sent to server
 */
@Serializable
data class ProofPayload(
    val sessionId: String,
    val nonce: String,
    val capture: CaptureMetadata,
    val hashes: HashBundle,
    val signature: SignatureBundle,
    val gps: GPSData? = null
)

/**
 * Capture session metadata
 */
@Serializable
data class CaptureMetadata(
    val testType: String, // "VERT_JUMP"
    val startedAtMs: Long,
    val endedAtMs: Long,
    val fps: Double,
    val device: DeviceInfo
)

/**
 * Device information
 */
@Serializable
data class DeviceInfo(
    val platform: String, // "android"
    val model: String,
    val osVersion: String,
    val appVersion: String
)

/**
 * SHA-256 hashes of evidence files
 */
@Serializable
data class HashBundle(
    val videoSha256: String,
    val sensorSha256: String,
    val metadataSha256: String
)

/**
 * ES256 signature over proof
 */
@Serializable
data class SignatureBundle(
    val alg: String, // "ES256"
    val keyId: String,
    val sig: String // Base64
)

/**
 * GPS location data
 */
@Serializable
data class GPSData(
    val lat: Double,
    val lng: Double,
    val accuracyM: Double,
    val capturedAtMs: Long
)

// MARK: - IMU Types

/**
 * Single IMU sample at ~100Hz
 */
@Serializable
data class IMUSample(
    val timestampMs: Long,
    val accelerometerX: Double,
    val accelerometerY: Double,
    val accelerometerZ: Double,
    val gyroscopeX: Double,
    val gyroscopeY: Double,
    val gyroscopeZ: Double
) {
    /** Magnitude of acceleration (in G) */
    val accelerationMagnitude: Double
        get() = kotlin.math.sqrt(
            accelerometerX * accelerometerX +
            accelerometerY * accelerometerY +
            accelerometerZ * accelerometerZ
        )
}

/**
 * Complete IMU recording session
 */
@Serializable
data class IMURecording(
    val samples: List<IMUSample>,
    val startTimeMs: Long,
    val endTimeMs: Long,
    val sampleRateHz: Double,
    val deviceModel: String
) {
    /** Duration in milliseconds */
    val durationMs: Long
        get() = endTimeMs - startTimeMs

    /** Number of samples */
    val sampleCount: Int
        get() = samples.size
}

// MARK: - Verification Types

/**
 * Verification tier from xLENS gates
 */
@Serializable
enum class VerificationTier {
    MEASURED, // Phase A: Basic measurement
    BRONZE,   // Phase B: Basic verification
    SILVER,   // Phase B: Attested + correlated
    GOLD,     // Phase C: Full 4-gate
    REJECTED  // Failed verification
}

/**
 * Gate scores from server
 */
@Serializable
data class GateScores(
    val attestation: Double, // 0-1
    val cryptoValid: Boolean,
    val liveness: Double, // 0-1
    val physics: Double // 0-1 - THE MOAT
)

// MARK: - Jump Result Types

/**
 * Complete jump result from server
 */
@Serializable
data class JumpResult(
    val jumpId: String,
    val heightInches: Double,
    val heightCm: Double,
    val flightTimeMs: Int,
    val confidence: Double,
    val verificationTier: VerificationTier,
    val gateScores: GateScores? = null
)

// MARK: - VPC Types

/**
 * Verified Performance Certificate
 */
@Serializable
data class VPC(
    val vpcId: String,
    val athleteId: String,
    val testType: String,
    val result: VPCResult,
    val verification: VPCVerification,
    val capture: VPCCapture,
    val issuedAtUtc: String,
    val verifyUrl: String
)

@Serializable
data class VPCResult(
    val heightInches: Double,
    val heightCm: Double,
    val flightTimeMs: Int
)

@Serializable
data class VPCVerification(
    val tier: String,
    val confidence: Double,
    val gatesPassed: List<String>,
    val phase: String
)

@Serializable
data class VPCCapture(
    val deviceModel: String,
    val appVersion: String,
    val capturedAtUtc: String,
    val fps: Double
)

// MARK: - Error Types

/**
 * xLENS-specific errors
 */
sealed class XLENSError : Exception() {
    object SessionExpired : XLENSError()
    object SessionNotFound : XLENSError()
    object NonceMismatch : XLENSError()
    object DeviceKeyNotFound : XLENSError()
    object SignatureFailed : XLENSError()
    object IMURecordingFailed : XLENSError()
    object VideoCaptureFailed : XLENSError()
    object UploadFailed : XLENSError()
    data class VerificationFailed(val reason: String) : XLENSError()
    data class NetworkError(val cause: Throwable) : XLENSError()

    override val message: String
        get() = when (this) {
            is SessionExpired -> "Session expired. Please start a new jump."
            is SessionNotFound -> "Session not found. Please try again."
            is NonceMismatch -> "Security verification failed. Please try again."
            is DeviceKeyNotFound -> "Device not registered. Please re-authenticate."
            is SignatureFailed -> "Failed to sign proof. Please try again."
            is IMURecordingFailed -> "Failed to record motion data. Please check permissions."
            is VideoCaptureFailed -> "Failed to capture video. Please check camera permissions."
            is UploadFailed -> "Failed to upload. Please check your connection."
            is VerificationFailed -> "Verification failed: $reason"
            is NetworkError -> "Network error: ${cause.message}"
        }
}
