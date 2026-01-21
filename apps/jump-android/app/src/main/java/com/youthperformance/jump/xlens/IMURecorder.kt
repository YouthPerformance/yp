// ═══════════════════════════════════════════════════════════════
// IMU RECORDER
// High-frequency motion data capture for xLENS verification
// THE MOAT: AI can fake pixels, not synchronized G-forces
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Records accelerometer and gyroscope data at ~100Hz
 * This is the unfakeable signal that closes the "Analog Hole"
 */
class IMURecorder(context: Context) : SensorEventListener {

    companion object {
        private const val TAG = "IMURecorder"
        private const val TARGET_SAMPLE_RATE_HZ = 100.0
        private const val SAMPLE_DELAY_US = (1_000_000 / TARGET_SAMPLE_RATE_HZ).toInt()
    }

    // Sensor manager
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    private val gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)

    // State
    private val _isRecording = MutableStateFlow(false)
    val isRecording: StateFlow<Boolean> = _isRecording.asStateFlow()

    private val _sampleCount = MutableStateFlow(0)
    val sampleCount: StateFlow<Int> = _sampleCount.asStateFlow()

    private val _currentAcceleration = MutableStateFlow(1.0)
    val currentAcceleration: StateFlow<Double> = _currentAcceleration.asStateFlow()

    // Recording data
    private var samples = mutableListOf<IMUSample>()
    private var startTimeMs: Long = 0

    // Latest sensor values
    private var lastAccelX = 0.0
    private var lastAccelY = 0.0
    private var lastAccelZ = 0.0
    private var lastGyroX = 0.0
    private var lastGyroY = 0.0
    private var lastGyroZ = 0.0
    private var hasAccelData = false
    private var hasGyroData = false

    // Device model
    private val deviceModel: String = "${Build.MANUFACTURER}_${Build.MODEL}"

    /**
     * Start recording IMU data
     */
    fun startRecording() {
        if (_isRecording.value) return

        if (accelerometer == null || gyroscope == null) {
            Log.e(TAG, "Motion sensors not available")
            return
        }

        // Reset state
        samples.clear()
        _sampleCount.value = 0
        startTimeMs = System.currentTimeMillis()
        _isRecording.value = true
        hasAccelData = false
        hasGyroData = false

        // Register listeners with high frequency
        sensorManager.registerListener(
            this,
            accelerometer,
            SAMPLE_DELAY_US
        )
        sensorManager.registerListener(
            this,
            gyroscope,
            SAMPLE_DELAY_US
        )

        Log.i(TAG, "Started recording at ${TARGET_SAMPLE_RATE_HZ}Hz")
    }

    /**
     * Stop recording and return the complete IMU recording
     */
    fun stopRecording(): IMURecording {
        sensorManager.unregisterListener(this)
        _isRecording.value = false

        val endTimeMs = System.currentTimeMillis()

        val recording = IMURecording(
            samples = samples.toList(),
            startTimeMs = startTimeMs,
            endTimeMs = endTimeMs,
            sampleRateHz = TARGET_SAMPLE_RATE_HZ,
            deviceModel = deviceModel
        )

        Log.i(TAG, "Stopped. Captured ${samples.size} samples over ${recording.durationMs}ms")
        analyzeRecording(recording)

        return recording
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                // Convert from m/s² to G (divide by 9.81)
                lastAccelX = event.values[0].toDouble() / SensorManager.GRAVITY_EARTH
                lastAccelY = event.values[1].toDouble() / SensorManager.GRAVITY_EARTH
                lastAccelZ = event.values[2].toDouble() / SensorManager.GRAVITY_EARTH
                hasAccelData = true
            }
            Sensor.TYPE_GYROSCOPE -> {
                lastGyroX = event.values[0].toDouble()
                lastGyroY = event.values[1].toDouble()
                lastGyroZ = event.values[2].toDouble()
                hasGyroData = true
            }
        }

        // Only add sample when we have both accel and gyro data
        if (hasAccelData && hasGyroData && _isRecording.value) {
            val sample = IMUSample(
                timestampMs = System.currentTimeMillis(),
                accelerometerX = lastAccelX,
                accelerometerY = lastAccelY,
                accelerometerZ = lastAccelZ,
                gyroscopeX = lastGyroX,
                gyroscopeY = lastGyroY,
                gyroscopeZ = lastGyroZ
            )

            samples.add(sample)
            _sampleCount.value = samples.size
            _currentAcceleration.value = sample.accelerationMagnitude

            hasAccelData = false
            hasGyroData = false
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not used but required by interface
    }

    /**
     * Analyze recording for jump detection (local preview)
     */
    private fun analyzeRecording(recording: IMURecording) {
        if (recording.samples.isEmpty()) return

        val accelerations = recording.samples.map { it.accelerationMagnitude }

        val maxAccel = accelerations.maxOrNull() ?: 0.0
        val minAccel = accelerations.minOrNull() ?: 0.0
        val avgAccel = accelerations.average()

        Log.i(TAG, "📊 IMU Analysis:")
        Log.i(TAG, "   Samples: ${recording.sampleCount}")
        Log.i(TAG, "   Duration: ${recording.durationMs}ms")
        Log.i(TAG, "   Max G: ${"%.2f".format(maxAccel)}")
        Log.i(TAG, "   Min G: ${"%.2f".format(minAccel)}")
        Log.i(TAG, "   Avg G: ${"%.2f".format(avgAccel)}")

        // Detect jump phases
        val takeoffIndex = accelerations.indexOfFirst { it > 1.5 }
        if (takeoffIndex >= 0) {
            val takeoffTime = recording.samples[takeoffIndex].timestampMs - recording.startTimeMs
            Log.i(TAG, "   Takeoff detected at: ${takeoffTime}ms")
        }

        val freefallIndex = accelerations.indexOfFirst { it < 0.3 }
        if (freefallIndex >= 0) {
            val freefallTime = recording.samples[freefallIndex].timestampMs - recording.startTimeMs
            Log.i(TAG, "   Freefall detected at: ${freefallTime}ms")
        }

        val landingIndex = accelerations.indexOfLast { it > 2.0 }
        if (landingIndex >= 0) {
            val landingTime = recording.samples[landingIndex].timestampMs - recording.startTimeMs
            Log.i(TAG, "   Landing detected at: ${landingTime}ms")
        }
    }

    /**
     * Serialize IMU recording to JSON
     */
    fun serializeRecording(recording: IMURecording): String {
        return Json.encodeToString(recording)
    }

    /**
     * Create a mock recording for testing
     */
    fun mockRecording(): IMURecording {
        val mockSamples = mutableListOf<IMUSample>()
        val startTime = System.currentTimeMillis()

        // Generate 300 samples (3 seconds at 100Hz)
        for (i in 0 until 300) {
            val t = i / 100.0 // Time in seconds
            val timestampMs = startTime + (i * 10)

            // Simulate jump phases
            val accelMagnitude = when {
                t < 0.5 -> 1.0 + (Math.random() - 0.5) * 0.2 // Standing
                t < 0.7 -> 1.8 + (Math.random() - 0.5) * 0.4 // Takeoff
                t < 1.3 -> 0.1 + (Math.random() - 0.5) * 0.1 // Freefall
                t < 1.5 -> 2.5 + (Math.random() - 0.5) * 0.6 // Landing
                else -> 1.0 + (Math.random() - 0.5) * 0.2 // Recovery
            }

            mockSamples.add(
                IMUSample(
                    timestampMs = timestampMs,
                    accelerometerX = 0.0,
                    accelerometerY = -accelMagnitude,
                    accelerometerZ = 0.0,
                    gyroscopeX = (Math.random() - 0.5) * 0.2,
                    gyroscopeY = (Math.random() - 0.5) * 0.2,
                    gyroscopeZ = (Math.random() - 0.5) * 0.2
                )
            )
        }

        return IMURecording(
            samples = mockSamples,
            startTimeMs = startTime,
            endTimeMs = startTime + 3000,
            sampleRateHz = 100.0,
            deviceModel = deviceModel
        )
    }
}
