// ═══════════════════════════════════════════════════════════════
// PROOF GENERATOR
// Creates cryptographic proofs for jump verification
// Generates hashes and signatures for the proof payload
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens.crypto

import android.os.Build
import com.youthperformance.xlens.*
import com.youthperformance.xlens.network.ProofPayload
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.security.MessageDigest
import android.util.Base64

/**
 * Generates cryptographic proofs for captured jump data
 */
internal class ProofGenerator {

    private val json = Json {
        encodeDefaults = true
        prettyPrint = false
    }

    /**
     * Generate a complete proof payload for submission
     */
    fun generateProof(
        session: Session,
        captureResult: CaptureResult,
        deviceKey: DeviceKey
    ): ProofPayload {
        // Hash video data
        val videoHash = sha256Hash(captureResult.videoData)

        // Hash sensor data
        val sensorHash = sha256Hash(captureResult.sensorData)

        // Create metadata for hashing
        val metadata = ProofMetadata(
            sessionId = session.id,
            nonce = session.nonce,
            startedAtMs = captureResult.startTimeMs,
            endedAtMs = captureResult.endTimeMs,
            fps = captureResult.fps
        )

        val metadataBytes = json.encodeToString(metadata).toByteArray()
        val metadataHash = sha256Hash(metadataBytes)

        // Get device info
        val deviceInfo = getDeviceInfo()

        // Create the capture info
        val captureInfo = ProofPayload.CaptureInfo(
            startedAtMs = captureResult.startTimeMs,
            endedAtMs = captureResult.endTimeMs,
            fps = captureResult.fps,
            device = deviceInfo
        )

        // Create hashes object
        val hashes = ProofPayload.Hashes(
            videoSha256 = videoHash,
            sensorSha256 = sensorHash,
            metadataSha256 = metadataHash
        )

        // Create signature payload (what we sign)
        val signaturePayload = SignaturePayload(
            sessionId = session.id,
            nonce = session.nonce,
            videoHash = videoHash,
            sensorHash = sensorHash,
            metadataHash = metadataHash,
            timestamp = System.currentTimeMillis()
        )

        // Sign the payload
        val signaturePayloadBytes = json.encodeToString(signaturePayload).toByteArray()
        val signature = deviceKey.sign(signaturePayloadBytes)
        val signatureBase64 = Base64.encodeToString(signature, Base64.NO_WRAP)

        return ProofPayload(
            sessionId = session.id,
            nonce = session.nonce,
            capture = captureInfo,
            hashes = hashes,
            signature = ProofPayload.Signature(
                keyId = deviceKey.keyId,
                sig = signatureBase64
            ),
            gps = null // GPS coordinates added separately
        )
    }

    private fun sha256Hash(data: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(data)
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

    private fun getDeviceInfo(): ProofPayload.DeviceInfo {
        val appVersion = try {
            // Would need context for real implementation
            "1.0.0"
        } catch (e: Exception) {
            "1.0.0"
        }

        return ProofPayload.DeviceInfo(
            model = Build.MODEL,
            osVersion = Build.VERSION.RELEASE,
            appVersion = appVersion
        )
    }

    @Serializable
    private data class ProofMetadata(
        val sessionId: String,
        val nonce: String,
        val startedAtMs: Long,
        val endedAtMs: Long,
        val fps: Int
    )

    @Serializable
    private data class SignaturePayload(
        val sessionId: String,
        val nonce: String,
        val videoHash: String,
        val sensorHash: String,
        val metadataHash: String,
        val timestamp: Long
    )
}
