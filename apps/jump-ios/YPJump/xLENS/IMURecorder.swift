// ═══════════════════════════════════════════════════════════════
// IMU RECORDER
// High-frequency motion data capture for xLENS verification
// THE MOAT: AI can fake pixels, not synchronized G-forces
// ═══════════════════════════════════════════════════════════════

import Foundation
import CoreMotion
import Combine

/// Records accelerometer and gyroscope data at ~100Hz
/// This is the unfakeable signal that closes the "Analog Hole"
@MainActor
final class IMURecorder: ObservableObject {

    // MARK: - Published State

    @Published private(set) var isRecording = false
    @Published private(set) var sampleCount = 0
    @Published private(set) var currentAcceleration: Double = 1.0 // In G

    // MARK: - Private Properties

    private let motionManager = CMMotionManager()
    private var samples: [IMUSample] = []
    private var startTime: Int64 = 0
    private var recordingQueue = DispatchQueue(label: "com.ypjump.imu", qos: .userInteractive)

    // Target 100Hz sampling
    private let targetSampleRateHz: Double = 100.0
    private var sampleInterval: TimeInterval { 1.0 / targetSampleRateHz }

    // MARK: - Initialization

    init() {
        // Check device capabilities
        if !motionManager.isAccelerometerAvailable {
            print("⚠️ IMURecorder: Accelerometer not available")
        }
        if !motionManager.isGyroAvailable {
            print("⚠️ IMURecorder: Gyroscope not available")
        }
    }

    // MARK: - Recording Control

    /// Start recording IMU data
    func startRecording() {
        guard !isRecording else { return }
        guard motionManager.isAccelerometerAvailable && motionManager.isGyroAvailable else {
            print("❌ IMURecorder: Motion sensors not available")
            return
        }

        // Reset state
        samples.removeAll()
        sampleCount = 0
        startTime = Int64(Date().timeIntervalSince1970 * 1000)
        isRecording = true

        // Configure sample rates
        motionManager.accelerometerUpdateInterval = sampleInterval
        motionManager.gyroUpdateInterval = sampleInterval

        // Start device motion (combines accelerometer + gyroscope)
        motionManager.deviceMotionUpdateInterval = sampleInterval
        motionManager.startDeviceMotionUpdates(to: .main) { [weak self] motion, error in
            guard let self = self, let motion = motion else { return }

            let now = Int64(Date().timeIntervalSince1970 * 1000)

            // User acceleration (without gravity)
            let userAccel = motion.userAcceleration
            // Gravity vector
            let gravity = motion.gravity
            // Total acceleration = user + gravity
            let totalAccelX = userAccel.x + gravity.x
            let totalAccelY = userAccel.y + gravity.y
            let totalAccelZ = userAccel.z + gravity.z

            // Rotation rate
            let rotation = motion.rotationRate

            let sample = IMUSample(
                timestampMs: now,
                accelerometerX: totalAccelX,
                accelerometerY: totalAccelY,
                accelerometerZ: totalAccelZ,
                gyroscopeX: rotation.x,
                gyroscopeY: rotation.y,
                gyroscopeZ: rotation.z
            )

            Task { @MainActor in
                self.samples.append(sample)
                self.sampleCount = self.samples.count
                self.currentAcceleration = sample.accelerationMagnitude
            }
        }

        print("✅ IMURecorder: Started recording at \(targetSampleRateHz)Hz")
    }

    /// Stop recording and return the complete IMU recording
    func stopRecording() -> IMURecording {
        motionManager.stopDeviceMotionUpdates()
        isRecording = false

        let endTime = Int64(Date().timeIntervalSince1970 * 1000)

        let recording = IMURecording(
            samples: samples,
            startTimeMs: startTime,
            endTimeMs: endTime,
            sampleRateHz: targetSampleRateHz,
            deviceModel: deviceModel
        )

        print("✅ IMURecorder: Stopped. Captured \(samples.count) samples over \(recording.durationMs)ms")

        // Analyze the recording
        analyzeRecording(recording)

        return recording
    }

    // MARK: - Analysis

    /// Analyze recording for jump detection (local preview, server does authoritative analysis)
    private func analyzeRecording(_ recording: IMURecording) {
        guard !recording.samples.isEmpty else { return }

        let accelerations = recording.samples.map { $0.accelerationMagnitude }

        // Find key events
        let maxAccel = accelerations.max() ?? 0
        let minAccel = accelerations.min() ?? 0
        let avgAccel = accelerations.reduce(0, +) / Double(accelerations.count)

        print("📊 IMU Analysis:")
        print("   Samples: \(recording.sampleCount)")
        print("   Duration: \(recording.durationMs)ms")
        print("   Max G: \(String(format: "%.2f", maxAccel))")
        print("   Min G: \(String(format: "%.2f", minAccel))")
        print("   Avg G: \(String(format: "%.2f", avgAccel))")

        // Detect jump phases
        // 1. Takeoff spike (typically >1.5g)
        // 2. Freefall period (~0g)
        // 3. Landing spike (typically >2g)

        if let takeoffIndex = accelerations.firstIndex(where: { $0 > 1.5 }) {
            let takeoffTime = recording.samples[takeoffIndex].timestampMs - recording.startTimeMs
            print("   Takeoff detected at: \(takeoffTime)ms")
        }

        if let freefallIndex = accelerations.firstIndex(where: { $0 < 0.3 }) {
            let freefallTime = recording.samples[freefallIndex].timestampMs - recording.startTimeMs
            print("   Freefall detected at: \(freefallTime)ms")
        }

        if let landingIndex = accelerations.lastIndex(where: { $0 > 2.0 }) {
            let landingTime = recording.samples[landingIndex].timestampMs - recording.startTimeMs
            print("   Landing detected at: \(landingTime)ms")
        }
    }

    // MARK: - Serialization

    /// Serialize IMU recording to JSON data
    func serializeRecording(_ recording: IMURecording) -> Data? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys // Deterministic output for hashing
        return try? encoder.encode(recording)
    }

    // MARK: - Device Info

    private var deviceModel: String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8, value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value)))
        }
        return identifier
    }
}

// MARK: - Preview Helpers

extension IMURecorder {
    /// Create a mock recording for previews
    static func mockRecording() -> IMURecording {
        var samples: [IMUSample] = []
        let startTime = Int64(Date().timeIntervalSince1970 * 1000)

        // Generate 300 samples (3 seconds at 100Hz)
        for i in 0..<300 {
            let t = Double(i) / 100.0 // Time in seconds
            let timestampMs = startTime + Int64(i * 10)

            // Simulate jump: normal -> takeoff spike -> freefall -> landing spike -> normal
            var accelMagnitude: Double
            if t < 0.5 {
                accelMagnitude = 1.0 + Double.random(in: -0.1...0.1) // Standing
            } else if t < 0.7 {
                accelMagnitude = 1.8 + Double.random(in: -0.2...0.2) // Takeoff
            } else if t < 1.3 {
                accelMagnitude = 0.1 + Double.random(in: -0.05...0.05) // Freefall
            } else if t < 1.5 {
                accelMagnitude = 2.5 + Double.random(in: -0.3...0.3) // Landing
            } else {
                accelMagnitude = 1.0 + Double.random(in: -0.1...0.1) // Recovery
            }

            samples.append(IMUSample(
                timestampMs: timestampMs,
                accelerometerX: 0,
                accelerometerY: -accelMagnitude, // Gravity is down
                accelerometerZ: 0,
                gyroscopeX: Double.random(in: -0.1...0.1),
                gyroscopeY: Double.random(in: -0.1...0.1),
                gyroscopeZ: Double.random(in: -0.1...0.1)
            ))
        }

        return IMURecording(
            samples: samples,
            startTimeMs: startTime,
            endTimeMs: startTime + 3000,
            sampleRateHz: 100,
            deviceModel: "iPhone15,2"
        )
    }
}
