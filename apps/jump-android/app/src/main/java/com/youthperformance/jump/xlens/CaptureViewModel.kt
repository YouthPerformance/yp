// ═══════════════════════════════════════════════════════════════
// CAPTURE VIEW MODEL
// Orchestrates the complete xLENS capture flow for Android
// Coordinates: Session → Video → IMU → ProofPack → Upload
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import android.content.Context
import android.location.Location
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

/**
 * ViewModel for the xLENS capture flow
 */
class CaptureViewModel(context: Context) : ViewModel() {

    companion object {
        private const val TAG = "CaptureViewModel"
    }

    // Dependencies
    val sessionManager = SessionManager()
    val imuRecorder = IMURecorder(context)
    val deviceKeyManager = DeviceKeyManager()
    val proofPackBuilder = ProofPackBuilder(deviceKeyManager, sessionManager)

    // State
    private val _captureState = MutableStateFlow<CaptureState>(CaptureState.Idle)
    val captureState: StateFlow<CaptureState> = _captureState.asStateFlow()

    private val _error = MutableStateFlow<XLENSError?>(null)
    val error: StateFlow<XLENSError?> = _error.asStateFlow()

    private val _lastResult = MutableStateFlow<JumpResult?>(null)
    val lastResult: StateFlow<JumpResult?> = _lastResult.asStateFlow()

    // Progress tracking
    private val _uploadProgress = MutableStateFlow(0.0)
    val uploadProgress: StateFlow<Double> = _uploadProgress.asStateFlow()

    private val _processingProgress = MutableStateFlow(0.0)
    val processingProgress: StateFlow<Double> = _processingProgress.asStateFlow()

    // Capture data
    private var captureStartTime: Long = 0
    private var captureEndTime: Long = 0
    private var videoData: ByteArray? = null
    private var imuRecording: IMURecording? = null
    private var currentLocation: Location? = null

    /**
     * Capture states
     */
    sealed class CaptureState {
        object Idle : CaptureState()
        object PreparingSession : CaptureState()
        object SessionReady : CaptureState()
        data class Countdown(val count: Int) : CaptureState()
        object Recording : CaptureState()
        object BuildingProof : CaptureState()
        object Uploading : CaptureState()
        object Processing : CaptureState()
        data class Complete(val result: JumpResult) : CaptureState()
        data class Failed(val message: String) : CaptureState()
    }

    // Computed properties
    val isRecording: Boolean
        get() = _captureState.value is CaptureState.Recording

    val isProcessing: Boolean
        get() = _captureState.value is CaptureState.BuildingProof ||
                _captureState.value is CaptureState.Uploading ||
                _captureState.value is CaptureState.Processing

    val canStartCapture: Boolean
        get() = _captureState.value is CaptureState.SessionReady

    val stateDescription: String
        get() = when (val state = _captureState.value) {
            is CaptureState.Idle -> "Ready"
            is CaptureState.PreparingSession -> "Preparing..."
            is CaptureState.SessionReady -> "Tap to start"
            is CaptureState.Countdown -> "${state.count}"
            is CaptureState.Recording -> "Recording..."
            is CaptureState.BuildingProof -> "Building proof..."
            is CaptureState.Uploading -> "Uploading..."
            is CaptureState.Processing -> "Processing..."
            is CaptureState.Complete -> "Complete!"
            is CaptureState.Failed -> "Error: ${state.message}"
        }

    /**
     * Prepare for a new capture by fetching a session
     */
    fun prepareCapture(userId: String) {
        viewModelScope.launch {
            _captureState.value = CaptureState.PreparingSession
            _error.value = null

            // Ensure device key is registered
            if (!deviceKeyManager.checkRegistration()) {
                try {
                    deviceKeyManager.generateDeviceKey()
                    // TODO: Register with server via Convex
                } catch (e: Exception) {
                    _error.value = XLENSError.DeviceKeyNotFound
                    _captureState.value = CaptureState.Failed("Device registration failed")
                    return@launch
                }
            }

            // Fetch new session
            sessionManager.fetchSession(userId)

            if (sessionManager.currentSession.value != null) {
                _captureState.value = CaptureState.SessionReady
            } else {
                _captureState.value = CaptureState.Failed("Failed to create session")
            }
        }
    }

    /**
     * Start the countdown before recording
     */
    fun startCountdown() {
        if (_captureState.value !is CaptureState.SessionReady) return

        viewModelScope.launch {
            for (i in 3 downTo 1) {
                _captureState.value = CaptureState.Countdown(i)
                delay(1000)
            }
            startRecording()
        }
    }

    /**
     * Start recording video and IMU data
     */
    private fun startRecording() {
        _captureState.value = CaptureState.Recording
        captureStartTime = System.currentTimeMillis()

        // Start IMU recording
        imuRecorder.startRecording()

        // TODO: Start video recording via CameraX

        Log.i(TAG, "🎬 Recording started")
    }

    /**
     * Stop recording and process the capture
     */
    fun stopRecording() {
        if (_captureState.value !is CaptureState.Recording) return

        captureEndTime = System.currentTimeMillis()

        // Stop IMU recording
        imuRecording = imuRecorder.stopRecording()

        // TODO: Stop video recording and get data
        // For now, use mock video data
        videoData = mockVideoData()

        Log.i(TAG, "🎬 Recording stopped")
        Log.i(TAG, "   Duration: ${captureEndTime - captureStartTime}ms")
        Log.i(TAG, "   IMU samples: ${imuRecording?.sampleCount ?: 0}")

        // Build proof pack
        buildAndUploadProof()
    }

    /**
     * Cancel current capture
     */
    fun cancelCapture() {
        if (imuRecorder.isRecording.value) {
            imuRecorder.stopRecording()
        }

        _captureState.value = CaptureState.Idle
        videoData = null
        imuRecording = null
        _error.value = null
    }

    /**
     * Build and upload the proof pack
     */
    private fun buildAndUploadProof() {
        viewModelScope.launch {
            _captureState.value = CaptureState.BuildingProof

            val video = videoData
            val imu = imuRecording

            if (video == null || imu == null) {
                _captureState.value = CaptureState.Failed("Missing capture data")
                return@launch
            }

            try {
                // Build proof pack
                val proofPayload = proofPackBuilder.buildProofPack(
                    videoData = video,
                    imuRecording = imu,
                    startTime = captureStartTime,
                    endTime = captureEndTime,
                    fps = 240.0, // TODO: Get from actual capture
                    location = currentLocation
                )

                Log.i(TAG, "✅ Proof pack built")

                // Upload to server
                _captureState.value = CaptureState.Uploading
                val jumpId = uploadCapture(video, imu, proofPayload)

                Log.i(TAG, "✅ Upload complete, jumpId: $jumpId")

                // Wait for processing
                _captureState.value = CaptureState.Processing
                val result = waitForProcessing(jumpId)

                _lastResult.value = result
                _captureState.value = CaptureState.Complete(result)

            } catch (e: XLENSError) {
                _error.value = e
                _captureState.value = CaptureState.Failed(e.message ?: "Unknown error")
            } catch (e: Exception) {
                _error.value = XLENSError.NetworkError(e)
                _captureState.value = CaptureState.Failed(e.message ?: "Unknown error")
            }
        }
    }

    // Server communication (mock)
    private suspend fun uploadCapture(
        videoData: ByteArray,
        imuRecording: IMURecording,
        proofPayload: ProofPayload
    ): String {
        // TODO: Implement actual Convex upload

        // Simulate upload progress
        for (i in 0..10) {
            delay(100)
            _uploadProgress.value = i / 10.0
        }

        return "jump_${UUID.randomUUID().toString().take(8)}"
    }

    private suspend fun waitForProcessing(jumpId: String): JumpResult {
        // TODO: Poll Convex for jump status

        // Simulate processing
        for (i in 0..10) {
            delay(200)
            _processingProgress.value = i / 10.0
        }

        // Return mock result
        return JumpResult(
            jumpId = jumpId,
            heightInches = 28 + Math.random() * 8,
            heightCm = 71 + Math.random() * 20,
            flightTimeMs = (400..600).random(),
            confidence = 0.85 + Math.random() * 0.1,
            verificationTier = VerificationTier.MEASURED,
            gateScores = GateScores(
                attestation = 0.8,
                cryptoValid = true,
                liveness = 0.9,
                physics = 0.85
            )
        )
    }

    private fun mockVideoData(): ByteArray {
        // Return placeholder data
        return ByteArray(1024 * 1024) // 1MB
    }

    /**
     * Set current location
     */
    fun setLocation(location: Location) {
        currentLocation = location
    }
}
