// ═══════════════════════════════════════════════════════════════
// CAPTURE COORDINATOR
// Orchestrates the complete xLENS capture flow
// Coordinates: Session → Video → IMU → ProofPack → Upload
// ═══════════════════════════════════════════════════════════════

import Foundation
import AVFoundation
import CoreLocation
import Combine

/// Main coordinator for the xLENS capture pipeline
/// Manages the complete flow from session creation to jump submission
@MainActor
final class CaptureCoordinator: ObservableObject {

    // MARK: - Dependencies

    let sessionManager: SessionManager
    let imuRecorder: IMURecorder
    let deviceKeyManager: DeviceKeyManager
    let proofPackBuilder: ProofPackBuilder

    // MARK: - Published State

    @Published var captureState: CaptureState = .idle
    @Published var error: XLENSError?
    @Published var lastResult: JumpResult?

    // Progress tracking
    @Published var uploadProgress: Double = 0
    @Published var processingProgress: Double = 0

    // MARK: - Private Properties

    private var captureStartTime: Int64 = 0
    private var captureEndTime: Int64 = 0
    private var videoData: Data?
    private var imuRecording: IMURecording?
    private var currentLocation: CLLocation?

    private let locationManager = CLLocationManager()
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Capture State

    enum CaptureState: Equatable {
        case idle
        case preparingSession
        case sessionReady
        case countdown(Int)
        case recording
        case buildingProof
        case uploading
        case processing
        case complete(JumpResult)
        case failed(String)
    }

    // MARK: - Initialization

    init() {
        self.sessionManager = SessionManager()
        self.imuRecorder = IMURecorder()
        self.deviceKeyManager = DeviceKeyManager()
        self.proofPackBuilder = ProofPackBuilder(
            deviceKeyManager: deviceKeyManager,
            sessionManager: sessionManager
        )

        setupLocationManager()
    }

    private func setupLocationManager() {
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
    }

    // MARK: - Capture Flow

    /// Prepare for a new capture by fetching a session
    func prepareCapture(userId: String) async {
        captureState = .preparingSession
        error = nil

        // Ensure device key is registered
        if !deviceKeyManager.checkRegistration() {
            do {
                _ = try await deviceKeyManager.generateDeviceKey()
                // TODO: Register with server via Convex
            } catch {
                self.error = .deviceKeyNotFound
                captureState = .failed("Device registration failed")
                return
            }
        }

        // Fetch new session
        await sessionManager.fetchSession(userId: userId)

        if sessionManager.currentSession != nil {
            captureState = .sessionReady

            // Request location
            locationManager.requestLocation()
        } else {
            captureState = .failed("Failed to create session")
        }
    }

    /// Start the countdown before recording
    func startCountdown() {
        guard captureState == .sessionReady else { return }

        captureState = .countdown(3)

        // Countdown timer
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            Task { @MainActor in
                guard let self = self else {
                    timer.invalidate()
                    return
                }

                if case .countdown(let count) = self.captureState {
                    if count > 1 {
                        self.captureState = .countdown(count - 1)
                    } else {
                        timer.invalidate()
                        self.startRecording()
                    }
                } else {
                    timer.invalidate()
                }
            }
        }
    }

    /// Start recording video and IMU data
    func startRecording() {
        captureState = .recording
        captureStartTime = Int64(Date().timeIntervalSince1970 * 1000)

        // Start IMU recording
        imuRecorder.startRecording()

        // TODO: Start video recording via AVCaptureSession
        // For now, we'll simulate with a timer

        print("🎬 CaptureCoordinator: Recording started")
    }

    /// Stop recording and process the capture
    func stopRecording() async {
        guard captureState == .recording else { return }

        captureEndTime = Int64(Date().timeIntervalSince1970 * 1000)

        // Stop IMU recording
        imuRecording = imuRecorder.stopRecording()

        // TODO: Stop video recording and get data
        // For now, we'll use mock video data
        videoData = mockVideoData()

        print("🎬 CaptureCoordinator: Recording stopped")
        print("   Duration: \(captureEndTime - captureStartTime)ms")
        print("   IMU samples: \(imuRecording?.sampleCount ?? 0)")

        // Build proof pack
        await buildAndUploadProof()
    }

    /// Cancel current capture
    func cancelCapture() {
        if imuRecorder.isRecording {
            _ = imuRecorder.stopRecording()
        }

        captureState = .idle
        videoData = nil
        imuRecording = nil
        error = nil
    }

    // MARK: - Proof Building & Upload

    private func buildAndUploadProof() async {
        captureState = .buildingProof

        guard let videoData = videoData,
              let imuRecording = imuRecording else {
            captureState = .failed("Missing capture data")
            return
        }

        do {
            // Build proof pack
            let proofPayload = try await proofPackBuilder.buildProofPack(
                videoData: videoData,
                imuRecording: imuRecording,
                startTime: captureStartTime,
                endTime: captureEndTime,
                fps: 240, // TODO: Get from actual capture
                location: currentLocation
            )

            print("✅ CaptureCoordinator: Proof pack built")

            // Upload to server
            captureState = .uploading
            let jumpId = try await uploadCapture(
                videoData: videoData,
                imuData: serializeIMU(imuRecording)!,
                proofPayload: proofPayload
            )

            print("✅ CaptureCoordinator: Upload complete, jumpId: \(jumpId)")

            // Wait for processing
            captureState = .processing
            let result = try await waitForProcessing(jumpId: jumpId)

            lastResult = result
            captureState = .complete(result)

        } catch let error as XLENSError {
            self.error = error
            captureState = .failed(error.localizedDescription)
        } catch {
            self.error = .networkError(error)
            captureState = .failed(error.localizedDescription)
        }
    }

    // MARK: - Server Communication (Mock)

    private func uploadCapture(
        videoData: Data,
        imuData: Data,
        proofPayload: ProofPayload
    ) async throws -> String {
        // TODO: Implement actual Convex upload
        // 1. Upload video to storage
        // 2. Upload IMU data to storage
        // 3. Submit jump with proof payload

        // Simulate upload progress
        for i in 0...10 {
            try await Task.sleep(nanoseconds: 100_000_000)
            uploadProgress = Double(i) / 10.0
        }

        return "jump_\(UUID().uuidString.prefix(8))"
    }

    private func waitForProcessing(jumpId: String) async throws -> JumpResult {
        // TODO: Poll Convex for jump status

        // Simulate processing
        for i in 0...10 {
            try await Task.sleep(nanoseconds: 200_000_000)
            processingProgress = Double(i) / 10.0
        }

        // Return mock result
        return JumpResult(
            jumpId: jumpId,
            heightInches: 28 + Double.random(in: 0...8),
            heightCm: 71 + Double.random(in: 0...20),
            flightTimeMs: Int.random(in: 400...600),
            confidence: 0.85 + Double.random(in: 0...0.1),
            verificationTier: .measured,
            gateScores: GateScores(
                attestation: 0.8,
                cryptoValid: true,
                liveness: 0.9,
                physics: 0.85
            )
        )
    }

    // MARK: - Helpers

    private func serializeIMU(_ recording: IMURecording) -> Data? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys
        return try? encoder.encode(recording)
    }

    private func mockVideoData() -> Data {
        // Return some placeholder data (in production, this would be actual video)
        Data(repeating: 0, count: 1024 * 1024) // 1MB placeholder
    }
}

// MARK: - CLLocationManagerDelegate

extension CaptureCoordinator: CLLocationManagerDelegate {
    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        Task { @MainActor in
            currentLocation = locations.last
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("⚠️ CaptureCoordinator: Location error - \(error)")
    }
}

// MARK: - State Helpers

extension CaptureCoordinator {
    var isRecording: Bool {
        if case .recording = captureState { return true }
        return false
    }

    var isProcessing: Bool {
        switch captureState {
        case .buildingProof, .uploading, .processing:
            return true
        default:
            return false
        }
    }

    var canStartCapture: Bool {
        captureState == .sessionReady
    }

    var stateDescription: String {
        switch captureState {
        case .idle: return "Ready"
        case .preparingSession: return "Preparing..."
        case .sessionReady: return "Tap to start"
        case .countdown(let n): return "\(n)"
        case .recording: return "Recording..."
        case .buildingProof: return "Building proof..."
        case .uploading: return "Uploading..."
        case .processing: return "Processing..."
        case .complete: return "Complete!"
        case .failed(let msg): return "Error: \(msg)"
        }
    }
}
