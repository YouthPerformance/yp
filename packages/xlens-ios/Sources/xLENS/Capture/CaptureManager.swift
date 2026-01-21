// ═══════════════════════════════════════════════════════════════
// CAPTURE MANAGER
// Coordinates video and sensor capture for jump verification
// Uses AVCaptureSession for video and CoreMotion for IMU
// ═══════════════════════════════════════════════════════════════

import AVFoundation
import CoreMotion
import UIKit

/// Manages synchronized video and sensor capture
@MainActor
public final class CaptureManager: NSObject {

    // MARK: - Properties

    private var captureSession: AVCaptureSession?
    private var videoOutput: AVCaptureMovieFileOutput?
    private var previewLayer: AVCaptureVideoPreviewLayer?

    private let motionManager = CMMotionManager()
    private var imuSamples: [IMUSample] = []
    private var imuTimer: Timer?

    private var isCapturing = false
    private var captureStartTime: Date?
    private var currentNonceDisplay: String?

    private var videoURL: URL?
    private var continuation: CheckedContinuation<CaptureResult, Error>?

    // Configuration
    private let targetFPS: Int32 = 120 // High frame rate for accurate jump detection
    private let imuSampleRate: TimeInterval = 1.0 / 100.0 // 100 Hz

    // MARK: - Public Interface

    /// Configure and prepare the capture session
    public func prepareSession() async throws -> AVCaptureVideoPreviewLayer {
        // Request camera permission
        let cameraStatus = AVCaptureDevice.authorizationStatus(for: .video)
        if cameraStatus == .notDetermined {
            let granted = await AVCaptureDevice.requestAccess(for: .video)
            guard granted else {
                throw XLensError.cameraUnavailable
            }
        } else if cameraStatus != .authorized {
            throw XLensError.cameraUnavailable
        }

        // Request microphone permission (for audio chirp detection in Phase C)
        let micStatus = AVCaptureDevice.authorizationStatus(for: .audio)
        if micStatus == .notDetermined {
            _ = await AVCaptureDevice.requestAccess(for: .audio)
        }

        // Check motion availability
        guard motionManager.isDeviceMotionAvailable else {
            throw XLensError.motionUnavailable
        }

        // Setup capture session
        let session = AVCaptureSession()
        session.sessionPreset = .hd1280x720

        // Configure video input
        guard let videoDevice = selectBestCamera() else {
            throw XLensError.cameraUnavailable
        }

        let videoInput = try AVCaptureDeviceInput(device: videoDevice)
        guard session.canAddInput(videoInput) else {
            throw XLensError.cameraUnavailable
        }
        session.addInput(videoInput)

        // Configure for high frame rate if available
        try configureHighFrameRate(device: videoDevice)

        // Configure video output
        let movieOutput = AVCaptureMovieFileOutput()
        guard session.canAddOutput(movieOutput) else {
            throw XLensError.captureFailed("Cannot add movie output")
        }
        session.addOutput(movieOutput)
        self.videoOutput = movieOutput

        // Configure audio input (optional)
        if let audioDevice = AVCaptureDevice.default(for: .audio),
           let audioInput = try? AVCaptureDeviceInput(device: audioDevice),
           session.canAddInput(audioInput) {
            session.addInput(audioInput)
        }

        // Create preview layer
        let preview = AVCaptureVideoPreviewLayer(session: session)
        preview.videoGravity = .resizeAspectFill
        self.previewLayer = preview

        self.captureSession = session

        // Start session on background thread
        Task.detached { [session] in
            session.startRunning()
        }

        return preview
    }

    /// Start capturing video and sensor data
    /// - Parameter nonceDisplay: The nonce to overlay on video
    public func startCapture(nonceDisplay: String) async throws {
        guard let session = captureSession, session.isRunning else {
            throw XLensError.captureNotStarted
        }

        guard let output = videoOutput else {
            throw XLensError.captureFailed("Video output not configured")
        }

        isCapturing = true
        currentNonceDisplay = nonceDisplay
        captureStartTime = Date()
        imuSamples = []

        // Start IMU capture
        startIMUCapture()

        // Create temp file for video
        let tempDir = FileManager.default.temporaryDirectory
        let fileName = "xlens_\(UUID().uuidString).mp4"
        let fileURL = tempDir.appendingPathComponent(fileName)
        self.videoURL = fileURL

        // Start recording
        output.startRecording(to: fileURL, recordingDelegate: self)
    }

    /// Stop capturing and return results
    public func stopCapture() async throws -> CaptureResult {
        guard isCapturing else {
            throw XLensError.captureNotStarted
        }

        return try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation

            // Stop IMU
            stopIMUCapture()

            // Stop video recording
            videoOutput?.stopRecording()
            // Delegate callback will complete the continuation
        }
    }

    /// Cancel capture without saving
    public func cancelCapture() {
        isCapturing = false
        stopIMUCapture()
        videoOutput?.stopRecording()

        // Clean up temp file
        if let url = videoURL {
            try? FileManager.default.removeItem(at: url)
        }
        videoURL = nil
        continuation = nil
    }

    /// Get the preview layer for UI display
    public var preview: AVCaptureVideoPreviewLayer? {
        return previewLayer
    }

    // MARK: - Private Methods

    private func selectBestCamera() -> AVCaptureDevice? {
        // Prefer back ultra-wide for full-body capture
        let discoverySession = AVCaptureDevice.DiscoverySession(
            deviceTypes: [
                .builtInUltraWideCamera,
                .builtInWideAngleCamera
            ],
            mediaType: .video,
            position: .back
        )

        // Prefer ultra-wide for wider field of view
        return discoverySession.devices.first { $0.deviceType == .builtInUltraWideCamera }
            ?? discoverySession.devices.first
    }

    private func configureHighFrameRate(device: AVCaptureDevice) throws {
        // Find format with highest frame rate
        var bestFormat: AVCaptureDevice.Format?
        var bestFrameRateRange: AVFrameRateRange?

        for format in device.formats {
            let dimensions = CMVideoFormatDescriptionGetDimensions(format.formatDescription)

            // Look for 720p or higher
            guard dimensions.width >= 1280, dimensions.height >= 720 else { continue }

            for range in format.videoSupportedFrameRateRanges {
                if range.maxFrameRate >= Double(targetFPS) {
                    if bestFrameRateRange == nil || range.maxFrameRate > bestFrameRateRange!.maxFrameRate {
                        bestFormat = format
                        bestFrameRateRange = range
                    }
                }
            }
        }

        // Apply best format
        if let format = bestFormat, let range = bestFrameRateRange {
            try device.lockForConfiguration()
            device.activeFormat = format
            device.activeVideoMinFrameDuration = CMTime(value: 1, timescale: CMTimeScale(min(range.maxFrameRate, Double(targetFPS))))
            device.activeVideoMaxFrameDuration = CMTime(value: 1, timescale: CMTimeScale(min(range.maxFrameRate, Double(targetFPS))))
            device.unlockForConfiguration()
        }
    }

    private func startIMUCapture() {
        motionManager.deviceMotionUpdateInterval = imuSampleRate
        motionManager.startDeviceMotionUpdates(using: .xArbitraryZVertical)

        // Sample at high frequency
        imuTimer = Timer.scheduledTimer(withTimeInterval: imuSampleRate, repeats: true) { [weak self] _ in
            guard let self = self, let motion = self.motionManager.deviceMotion else { return }

            let sample = IMUSample(
                timestamp: Date().timeIntervalSince1970,
                accelerationX: motion.userAcceleration.x,
                accelerationY: motion.userAcceleration.y,
                accelerationZ: motion.userAcceleration.z,
                rotationX: motion.rotationRate.x,
                rotationY: motion.rotationRate.y,
                rotationZ: motion.rotationRate.z
            )

            Task { @MainActor in
                self.imuSamples.append(sample)
            }
        }
    }

    private func stopIMUCapture() {
        imuTimer?.invalidate()
        imuTimer = nil
        motionManager.stopDeviceMotionUpdates()
    }

    private func finishCapture(error: Error?) {
        isCapturing = false

        if let error = error {
            continuation?.resume(throwing: error)
            continuation = nil
            return
        }

        guard let url = videoURL else {
            continuation?.resume(throwing: XLensError.captureFailed("Video file not found"))
            continuation = nil
            return
        }

        do {
            // Read video data
            let videoData = try Data(contentsOf: url)

            // Encode sensor data as JSON
            let encoder = JSONEncoder()
            encoder.outputFormatting = .sortedKeys // Deterministic for hashing
            let sensorData = try encoder.encode(imuSamples)

            // Determine actual FPS from video
            let asset = AVAsset(url: url)
            let fps = asset.tracks(withMediaType: .video).first?.nominalFrameRate ?? Float(targetFPS)

            let result = CaptureResult(
                videoData: videoData,
                videoURL: url,
                sensorData: sensorData,
                startTime: captureStartTime ?? Date(),
                endTime: Date(),
                fps: Int(fps),
                imuSamples: imuSamples
            )

            continuation?.resume(returning: result)
        } catch {
            continuation?.resume(throwing: XLensError.captureFailed(error.localizedDescription))
        }

        continuation = nil
    }
}

// MARK: - AVCaptureFileOutputRecordingDelegate

extension CaptureManager: AVCaptureFileOutputRecordingDelegate {
    public nonisolated func fileOutput(
        _ output: AVCaptureFileOutput,
        didFinishRecordingTo outputFileURL: URL,
        from connections: [AVCaptureConnection],
        error: Error?
    ) {
        Task { @MainActor in
            finishCapture(error: error)
        }
    }
}
