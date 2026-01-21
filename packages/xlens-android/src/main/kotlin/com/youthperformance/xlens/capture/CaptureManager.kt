// ═══════════════════════════════════════════════════════════════
// CAPTURE MANAGER
// Coordinates video and sensor capture for jump verification
// Uses CameraX for video and SensorManager for IMU
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens.capture

import android.content.ContentValues
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.*
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.youthperformance.xlens.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.util.concurrent.Executors
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Manages synchronized video and sensor capture
 */
internal class CaptureManager(private val context: Context) : SensorEventListener {

    // MARK: - Properties

    private var cameraProvider: ProcessCameraProvider? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var recording: Recording? = null
    private var preview: Preview? = null

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null

    private val imuSamples = mutableListOf<IMUSample>()
    private var isCapturing = false
    private var captureStartTimeMs: Long = 0
    private var currentNonceDisplay: String? = null

    private var videoUri: Uri? = null
    private var videoFile: File? = null

    private val executor = Executors.newSingleThreadExecutor()
    private val json = Json { encodeDefaults = true }

    // Configuration
    private val targetFps = 120 // High frame rate for accurate jump detection
    private val imuSampleRateUs = 10_000 // 100 Hz

    // MARK: - Public Interface

    /**
     * Get a PreviewView.SurfaceProvider for camera preview
     */
    fun getPreviewSurfaceProvider(): Preview.SurfaceProvider? {
        return null // Will be bound when preview is created
    }

    /**
     * Initialize camera with lifecycle owner
     */
    suspend fun initializeCamera(
        lifecycleOwner: LifecycleOwner,
        previewView: PreviewView
    ) = withContext(Dispatchers.Main) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)

        suspendCancellableCoroutine { continuation ->
            cameraProviderFuture.addListener({
                try {
                    val provider = cameraProviderFuture.get()
                    cameraProvider = provider

                    // Build preview use case
                    preview = Preview.Builder()
                        .build()
                        .also {
                            it.surfaceProvider = previewView.surfaceProvider
                        }

                    // Build video capture use case
                    val recorder = Recorder.Builder()
                        .setQualitySelector(
                            QualitySelector.from(
                                Quality.HD,
                                FallbackStrategy.higherQualityOrLowerThan(Quality.HD)
                            )
                        )
                        .build()

                    videoCapture = VideoCapture.withOutput(recorder)

                    // Select back camera
                    val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

                    // Unbind all and rebind
                    provider.unbindAll()

                    provider.bindToLifecycle(
                        lifecycleOwner,
                        cameraSelector,
                        preview,
                        videoCapture
                    )

                    continuation.resume(Unit)
                } catch (e: Exception) {
                    continuation.resumeWithException(
                        XLensException.CameraUnavailable
                    )
                }
            }, ContextCompat.getMainExecutor(context))
        }
    }

    /**
     * Start capturing video and sensor data
     * @param nonceDisplay The nonce to overlay on video
     */
    suspend fun startCapture(nonceDisplay: String) = withContext(Dispatchers.Main) {
        val capture = videoCapture
            ?: throw XLensException.CaptureNotStarted

        isCapturing = true
        currentNonceDisplay = nonceDisplay
        captureStartTimeMs = System.currentTimeMillis()
        imuSamples.clear()

        // Start IMU capture
        startIMUCapture()

        // Create video file
        val name = "xlens_${System.currentTimeMillis()}.mp4"
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, "video/mp4")
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
                put(MediaStore.Video.Media.RELATIVE_PATH, "Movies/xLENS")
            }
        }

        val mediaStoreOutputOptions = MediaStoreOutputOptions.Builder(
            context.contentResolver,
            MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        )
            .setContentValues(contentValues)
            .build()

        // Start recording
        recording = capture.output
            .prepareRecording(context, mediaStoreOutputOptions)
            .apply {
                // Enable audio for chirp detection (Phase C)
                if (ContextCompat.checkSelfPermission(
                        context,
                        android.Manifest.permission.RECORD_AUDIO
                    ) == android.content.pm.PackageManager.PERMISSION_GRANTED
                ) {
                    withAudioEnabled()
                }
            }
            .start(executor) { event ->
                when (event) {
                    is VideoRecordEvent.Start -> {
                        // Recording started
                    }
                    is VideoRecordEvent.Finalize -> {
                        if (event.hasError()) {
                            // Handle error
                        } else {
                            videoUri = event.outputResults.outputUri
                        }
                    }
                }
            }
    }

    /**
     * Stop capture and return results
     */
    suspend fun stopCapture(): CaptureResult = withContext(Dispatchers.IO) {
        if (!isCapturing) {
            throw XLensException.CaptureNotStarted
        }

        // Stop IMU
        stopIMUCapture()

        // Stop recording and wait for finalization
        recording?.stop()
        recording = null

        // Small delay to ensure video is finalized
        kotlinx.coroutines.delay(500)

        val uri = videoUri
            ?: throw XLensException.CaptureFailed("Video file not created")

        isCapturing = false

        // Read video data
        val videoData = context.contentResolver.openInputStream(uri)?.use {
            it.readBytes()
        } ?: throw XLensException.CaptureFailed("Failed to read video file")

        // Encode sensor data as JSON
        val sensorData = json.encodeToString(imuSamples.toList()).toByteArray()

        // Estimate FPS (CameraX doesn't expose actual FPS easily)
        val durationMs = System.currentTimeMillis() - captureStartTimeMs
        val estimatedFps = if (durationMs > 0) {
            (imuSamples.size * 1000L / durationMs).toInt().coerceIn(30, targetFps)
        } else {
            60
        }

        CaptureResult(
            videoData = videoData,
            videoUri = uri,
            sensorData = sensorData,
            startTimeMs = captureStartTimeMs,
            endTimeMs = System.currentTimeMillis(),
            fps = estimatedFps,
            imuSamples = imuSamples.toList()
        )
    }

    /**
     * Cancel capture without saving
     */
    fun cancelCapture() {
        isCapturing = false
        stopIMUCapture()
        recording?.stop()
        recording = null

        // Clean up video file
        videoUri?.let {
            try {
                context.contentResolver.delete(it, null, null)
            } catch (e: Exception) {
                // Ignore cleanup errors
            }
        }
        videoUri = null
    }

    /**
     * Release camera resources
     */
    fun release() {
        cancelCapture()
        cameraProvider?.unbindAll()
        cameraProvider = null
        executor.shutdown()
    }

    // MARK: - Private Methods

    private fun startIMUCapture() {
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)

        if (accelerometer == null || gyroscope == null) {
            throw XLensException.MotionUnavailable
        }

        sensorManager.registerListener(
            this,
            accelerometer,
            imuSampleRateUs
        )

        sensorManager.registerListener(
            this,
            gyroscope,
            imuSampleRateUs
        )
    }

    private fun stopIMUCapture() {
        sensorManager.unregisterListener(this)
    }

    // MARK: - SensorEventListener

    private var lastAcceleration: FloatArray? = null
    private var lastGyroscope: FloatArray? = null

    override fun onSensorChanged(event: SensorEvent) {
        if (!isCapturing) return

        when (event.sensor.type) {
            Sensor.TYPE_LINEAR_ACCELERATION -> {
                lastAcceleration = event.values.clone()
            }
            Sensor.TYPE_GYROSCOPE -> {
                lastGyroscope = event.values.clone()
            }
        }

        // Create sample when we have both
        val accel = lastAcceleration
        val gyro = lastGyroscope

        if (accel != null && gyro != null) {
            val sample = IMUSample(
                timestamp = System.currentTimeMillis(),
                accelerationX = accel[0],
                accelerationY = accel[1],
                accelerationZ = accel[2],
                rotationX = gyro[0],
                rotationY = gyro[1],
                rotationZ = gyro[2]
            )

            synchronized(imuSamples) {
                imuSamples.add(sample)
            }

            // Clear to avoid double-counting
            lastAcceleration = null
            lastGyroscope = null
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not used
    }
}
