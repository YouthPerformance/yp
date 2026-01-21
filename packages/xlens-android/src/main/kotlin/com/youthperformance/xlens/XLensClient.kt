// ═══════════════════════════════════════════════════════════════
// xLENS CLIENT
// Main entry point for xLENS SDK on Android
// Coordinates session management, capture, and proof generation
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Main xLENS SDK client for Android
 * Handles session management, video/sensor capture, and proof generation
 */
class XLensClient(
    private val context: Context,
    private val configuration: Configuration
) {
    // MARK: - State

    private val _state = MutableStateFlow<XLensState>(XLensState.Idle)
    val state: StateFlow<XLensState> = _state.asStateFlow()

    private val _currentSession = MutableStateFlow<Session?>(null)
    val currentSession: StateFlow<Session?> = _currentSession.asStateFlow()

    private val _lastJump = MutableStateFlow<Jump?>(null)
    val lastJump: StateFlow<Jump?> = _lastJump.asStateFlow()

    // MARK: - Components

    private val convexClient = ConvexClient(
        baseUrl = configuration.convexUrl,
        authToken = configuration.authToken
    )

    private val captureManager = CaptureManager(context)
    private val proofGenerator = ProofGenerator()
    private val deviceKeyManager = DeviceKeyManager(context, configuration.userId)

    // MARK: - Configuration

    data class Configuration(
        val convexUrl: String,
        val authToken: String? = null,
        val userId: String
    )

    // MARK: - Public API

    /**
     * Start a new capture session
     * Fetches a nonce from the server for liveness verification
     */
    suspend fun startSession(userId: String): Session {
        require(_state.value == XLensState.Idle) {
            "Cannot start session while in state: ${_state.value}"
        }

        _state.value = XLensState.PreparingSession

        return try {
            // Get device key (or create if first time)
            val deviceKey = deviceKeyManager.getOrCreateKey()

            // Request session from Convex
            val sessionResponse = convexClient.createSession(
                userId = userId,
                deviceKeyId = deviceKey.keyId
            )

            val session = Session(
                id = sessionResponse.sessionId,
                nonce = sessionResponse.nonce,
                nonceDisplay = sessionResponse.nonceDisplay,
                expiresAt = sessionResponse.expiresAt,
                deviceKeyId = deviceKey.keyId
            )

            _currentSession.value = session
            _state.value = XLensState.SessionReady

            session
        } catch (e: Exception) {
            _state.value = XLensState.Error(e)
            throw e
        }
    }

    /**
     * Begin video/sensor capture
     * Must have an active session first
     */
    suspend fun startCapture() {
        val session = _currentSession.value
            ?: throw XLensException.InvalidState("Must have active session before capturing")

        require(_state.value == XLensState.SessionReady) {
            "Invalid state for capture: ${_state.value}"
        }

        // Check session hasn't expired
        if (System.currentTimeMillis() >= session.expiresAt) {
            throw XLensException.SessionExpired
        }

        _state.value = XLensState.Capturing

        try {
            captureManager.startCapture(session.nonceDisplay)
        } catch (e: Exception) {
            _state.value = XLensState.Error(e)
            throw e
        }
    }

    /**
     * Stop capture and process the jump
     */
    suspend fun stopCapture(): CaptureResult {
        require(_state.value == XLensState.Capturing) {
            "Not currently capturing"
        }

        _state.value = XLensState.Processing

        return try {
            captureManager.stopCapture()
        } catch (e: Exception) {
            _state.value = XLensState.Error(e)
            throw e
        }
    }

    /**
     * Submit the captured jump to the server
     */
    suspend fun submitJump(
        userId: String,
        captureResult: CaptureResult,
        gps: GPSLocation? = null
    ): JumpSubmissionResult {
        val session = _currentSession.value
            ?: throw XLensException.InvalidState("No active session")

        _state.value = XLensState.Uploading

        return try {
            // Get device key for signing
            val deviceKey = deviceKeyManager.getOrCreateKey()

            // Generate proof payload
            val proof = proofGenerator.generateProof(
                session = session,
                captureResult = captureResult,
                deviceKey = deviceKey
            )

            // Upload video to Convex storage
            val videoStorageId = convexClient.uploadFile(
                data = captureResult.videoData,
                contentType = "video/mp4"
            )

            // Upload sensor data to Convex storage
            val sensorStorageId = convexClient.uploadFile(
                data = captureResult.sensorData,
                contentType = "application/json"
            )

            // Submit jump
            val result = convexClient.submitJump(
                userId = userId,
                sessionId = session.id,
                videoStorageId = videoStorageId,
                sensorStorageId = sensorStorageId,
                proofPayload = proof,
                gps = gps
            )

            // Mark as uploaded
            convexClient.markJumpUploaded(result.jumpId)

            val jump = Jump(
                id = result.jumpId,
                status = JumpStatus.PROCESSING,
                sessionId = session.id
            )

            _lastJump.value = jump
            _state.value = XLensState.Complete
            _currentSession.value = null

            JumpSubmissionResult(
                jumpId = result.jumpId,
                status = "processing"
            )
        } catch (e: Exception) {
            _state.value = XLensState.Error(e)
            throw e
        }
    }

    /**
     * Cancel current session/capture
     */
    fun cancel() {
        captureManager.cancelCapture()
        _currentSession.value = null
        _state.value = XLensState.Idle
    }

    /**
     * Reset to idle state
     */
    fun reset() {
        cancel()
        _lastJump.value = null
    }

    /**
     * Check daily jump cap for user
     */
    suspend fun checkDailyCap(userId: String): DailyCapStatus {
        return convexClient.checkDailyCap(userId)
    }

    /**
     * Get user's jump history
     */
    suspend fun getJumpHistory(userId: String, limit: Int = 50): List<Jump> {
        return convexClient.listJumps(userId, limit)
    }

    /**
     * Get user's best jump
     */
    suspend fun getBestJump(userId: String, minTier: VerificationTier? = null): Jump? {
        return convexClient.getBestJump(userId, minTier)
    }

    /**
     * Get the camera preview surface provider
     */
    fun getPreviewSurfaceProvider() = captureManager.getPreviewSurfaceProvider()
}

// MARK: - Supporting Types

sealed class XLensState {
    data object Idle : XLensState()
    data object PreparingSession : XLensState()
    data object SessionReady : XLensState()
    data object Capturing : XLensState()
    data object Processing : XLensState()
    data object Uploading : XLensState()
    data object Complete : XLensState()
    data class Error(val exception: Throwable) : XLensState()
}

data class Session(
    val id: String,
    val nonce: String,
    val nonceDisplay: String,
    val expiresAt: Long,
    val deviceKeyId: String
) {
    val isExpired: Boolean
        get() = System.currentTimeMillis() >= expiresAt

    val remainingTimeMs: Long
        get() = maxOf(0L, expiresAt - System.currentTimeMillis())
}

data class Jump(
    val id: String,
    var status: JumpStatus,
    val sessionId: String,
    var heightInches: Double? = null,
    var heightCm: Double? = null,
    var flightTimeMs: Int? = null,
    var verificationTier: VerificationTier? = null,
    var confidence: Double? = null
)

enum class JumpStatus {
    UPLOADING,
    PROCESSING,
    COMPLETE,
    FLAGGED,
    CHALLENGED
}

enum class VerificationTier {
    MEASURED,
    BRONZE,
    SILVER,
    GOLD,
    REJECTED
}

data class GPSLocation(
    val city: String,
    val state: String? = null,
    val country: String
)

data class DailyCapStatus(
    val jumpsUsed: Int,
    val remaining: Int,
    val cap: Int,
    val isOverCap: Boolean
)

data class JumpSubmissionResult(
    val jumpId: String,
    val status: String
)

data class CaptureResult(
    val videoData: ByteArray,
    val videoUri: android.net.Uri,
    val sensorData: ByteArray,
    val startTimeMs: Long,
    val endTimeMs: Long,
    val fps: Int,
    val imuSamples: List<IMUSample>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as CaptureResult

        return videoUri == other.videoUri && startTimeMs == other.startTimeMs
    }

    override fun hashCode(): Int {
        var result = videoUri.hashCode()
        result = 31 * result + startTimeMs.hashCode()
        return result
    }
}

data class IMUSample(
    val timestamp: Long,
    val accelerationX: Float,
    val accelerationY: Float,
    val accelerationZ: Float,
    val rotationX: Float,
    val rotationY: Float,
    val rotationZ: Float
)
