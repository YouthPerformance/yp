// ═══════════════════════════════════════════════════════════════
// PROOF PACK BUILDER
// Assembles complete proof payload for xLENS verification
// Bundles: video hash + IMU hash + metadata hash + signature
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import android.location.Location
import android.os.Build
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.security.MessageDigest

/**
 * Builds and signs the complete proof payload for jump verification
 */
class ProofPackBuilder(
    private val deviceKeyManager: DeviceKeyManager,
    private val sessionManager: SessionManager
) {
    companion object {
        private const val TAG = "ProofPackBuilder"
    }

    // State
    private val _isBuilding = MutableStateFlow(false)
    val isBuilding: StateFlow<Boolean> = _isBuilding.asStateFlow()

    private val _progress = MutableStateFlow(0.0)
    val progress: StateFlow<Double> = _progress.asStateFlow()

    // JSON serializer
    private val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    /**
     * Build complete proof payload from capture session
     */
    suspend fun buildProofPack(
        videoData: ByteArray,
        imuRecording: IMURecording,
        startTime: Long,
        endTime: Long,
        fps: Double,
        location: Location?
    ): ProofPayload {
        _isBuilding.value = true
        _progress.value = 0.0

        try {
            // Validate session
            val session = sessionManager.currentSession.value
                ?: throw XLENSError.SessionNotFound

            if (session.isExpired) {
                throw XLENSError.SessionExpired
            }

            _progress.value = 0.1

            // Validate device key
            val deviceKey = deviceKeyManager.deviceKey.value
                ?: throw XLENSError.DeviceKeyNotFound

            _progress.value = 0.2

            // Hash video data
            val videoHash = hashData(videoData)
            Log.i(TAG, "📦 Video hash: ${videoHash.take(16)}...")
            _progress.value = 0.4

            // Serialize and hash IMU data
            val imuJson = json.encodeToString(imuRecording)
            val imuData = imuJson.toByteArray(Charsets.UTF_8)
            val sensorHash = hashData(imuData)
            Log.i(TAG, "📦 Sensor hash: ${sensorHash.take(16)}...")
            _progress.value = 0.6

            // Build metadata
            val deviceInfo = DeviceInfo(
                platform = "android",
                model = "${Build.MANUFACTURER}_${Build.MODEL}",
                osVersion = Build.VERSION.RELEASE,
                appVersion = getAppVersion()
            )

            val capture = CaptureMetadata(
                testType = "VERT_JUMP",
                startedAtMs = startTime,
                endedAtMs = endTime,
                fps = fps,
                device = deviceInfo
            )

            // Hash metadata
            val metadataJson = json.encodeToString(capture)
            val metadataHash = hashData(metadataJson.toByteArray(Charsets.UTF_8))
            Log.i(TAG, "📦 Metadata hash: ${metadataHash.take(16)}...")
            _progress.value = 0.7

            // Build hash bundle
            val hashes = HashBundle(
                videoSha256 = videoHash,
                sensorSha256 = sensorHash,
                metadataSha256 = metadataHash
            )

            // Build GPS data if available
            val gpsData = location?.let {
                GPSData(
                    lat = it.latitude,
                    lng = it.longitude,
                    accuracyM = it.accuracy.toDouble(),
                    capturedAtMs = it.time
                )
            }

            _progress.value = 0.8

            // Create signable payload
            val signablePayload = buildSignablePayload(
                sessionId = session.sessionId,
                nonce = session.nonce,
                hashes = hashes
            )

            // Sign with device key
            val signature = deviceKeyManager.sign(signablePayload.toByteArray(Charsets.UTF_8))
            Log.i(TAG, "📦 Signature created")
            _progress.value = 0.9

            // Build complete proof payload
            val proofPayload = ProofPayload(
                sessionId = session.sessionId,
                nonce = session.nonce,
                capture = capture,
                hashes = hashes,
                signature = SignatureBundle(
                    alg = "ES256",
                    keyId = deviceKey.keyId,
                    sig = signature
                ),
                gps = gpsData
            )

            _progress.value = 1.0
            Log.i(TAG, "✅ Proof pack build complete")

            return proofPayload

        } finally {
            _isBuilding.value = false
        }
    }

    /**
     * SHA-256 hash of data, returned as hex string
     */
    private fun hashData(data: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(data)
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

    /**
     * Build deterministic payload for signing
     */
    private fun buildSignablePayload(
        sessionId: String,
        nonce: String,
        hashes: HashBundle
    ): String {
        // Canonical format: sessionId|nonce|videoHash|sensorHash|metadataHash
        return listOf(
            sessionId,
            nonce,
            hashes.videoSha256,
            hashes.sensorSha256,
            hashes.metadataSha256
        ).joinToString("|")
    }

    /**
     * Serialize proof payload to JSON
     */
    fun serializeProofPayload(payload: ProofPayload): String {
        return json.encodeToString(payload)
    }

    private fun getAppVersion(): String {
        // In production, get from BuildConfig
        return "1.0.0"
    }
}
