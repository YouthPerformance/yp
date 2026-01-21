// ═══════════════════════════════════════════════════════════════
// PROOF PACK BUILDER
// Assembles complete proof payload for xLENS verification
// Bundles: video hash + IMU hash + metadata hash + signature
// ═══════════════════════════════════════════════════════════════

import Foundation
import CryptoKit
import CoreLocation

/// Builds and signs the complete proof payload for jump verification
@MainActor
final class ProofPackBuilder: ObservableObject {

    // MARK: - Dependencies

    private let deviceKeyManager: DeviceKeyManager
    private let sessionManager: SessionManager

    // MARK: - Published State

    @Published private(set) var isBuilding = false
    @Published private(set) var progress: Double = 0

    // MARK: - Initialization

    init(deviceKeyManager: DeviceKeyManager, sessionManager: SessionManager) {
        self.deviceKeyManager = deviceKeyManager
        self.sessionManager = sessionManager
    }

    // MARK: - Build Proof Pack

    /// Build complete proof payload from capture session
    /// - Parameters:
    ///   - videoData: Raw video file data
    ///   - imuRecording: IMU sensor recording
    ///   - startTime: Capture start timestamp (ms)
    ///   - endTime: Capture end timestamp (ms)
    ///   - fps: Video frame rate
    ///   - location: Optional GPS location
    /// - Returns: Complete proof payload ready for upload
    func buildProofPack(
        videoData: Data,
        imuRecording: IMURecording,
        startTime: Int64,
        endTime: Int64,
        fps: Double,
        location: CLLocation?
    ) async throws -> ProofPayload {
        isBuilding = true
        progress = 0

        defer {
            isBuilding = false
            progress = 1.0
        }

        // Validate session
        guard let session = sessionManager.currentSession else {
            throw XLENSError.sessionNotFound
        }

        guard session.expiresAt > Date() else {
            throw XLENSError.sessionExpired
        }

        progress = 0.1

        // Validate device key
        guard let deviceKey = deviceKeyManager.deviceKey else {
            throw XLENSError.deviceKeyNotFound
        }

        progress = 0.2

        // Hash video data
        let videoHash = hashData(videoData)
        print("📦 ProofPack: Video hash: \(videoHash.prefix(16))...")
        progress = 0.4

        // Serialize and hash IMU data
        guard let imuData = serializeIMU(imuRecording) else {
            throw XLENSError.imuRecordingFailed
        }
        let sensorHash = hashData(imuData)
        print("📦 ProofPack: Sensor hash: \(sensorHash.prefix(16))...")
        progress = 0.6

        // Build metadata
        let deviceInfo = DeviceInfo(
            platform: "ios",
            model: deviceKey.deviceModel,
            osVersion: deviceKey.osVersion,
            appVersion: appVersion
        )

        let capture = CaptureMetadata(
            testType: "VERT_JUMP",
            startedAtMs: startTime,
            endedAtMs: endTime,
            fps: fps,
            device: deviceInfo
        )

        // Hash metadata
        let metadataHash = hashMetadata(capture)
        print("📦 ProofPack: Metadata hash: \(metadataHash.prefix(16))...")
        progress = 0.7

        // Build hash bundle
        let hashes = HashBundle(
            videoSha256: videoHash,
            sensorSha256: sensorHash,
            metadataSha256: metadataHash
        )

        // Build GPS data if available
        var gpsData: GPSData? = nil
        if let location = location {
            gpsData = GPSData(
                lat: location.coordinate.latitude,
                lng: location.coordinate.longitude,
                accuracyM: location.horizontalAccuracy,
                capturedAtMs: Int64(location.timestamp.timeIntervalSince1970 * 1000)
            )
        }

        progress = 0.8

        // Create signable payload
        let signablePayload = buildSignablePayload(
            sessionId: session.sessionId,
            nonce: session.nonce,
            hashes: hashes
        )

        // Sign with device key
        let signature = try await deviceKeyManager.sign(data: signablePayload)
        print("📦 ProofPack: Signature created")
        progress = 0.9

        // Build complete proof payload
        let proofPayload = ProofPayload(
            sessionId: session.sessionId,
            nonce: session.nonce,
            capture: capture,
            hashes: hashes,
            signature: SignatureBundle(
                alg: "ES256",
                keyId: deviceKey.keyId,
                sig: signature
            ),
            gps: gpsData
        )

        print("✅ ProofPack: Build complete")
        return proofPayload
    }

    // MARK: - Hashing

    /// SHA-256 hash of data, returned as hex string
    private func hashData(_ data: Data) -> String {
        let digest = SHA256.hash(data: data)
        return digest.map { String(format: "%02x", $0) }.joined()
    }

    /// Hash metadata deterministically
    private func hashMetadata(_ metadata: CaptureMetadata) -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys
        guard let data = try? encoder.encode(metadata) else {
            return ""
        }
        return hashData(data)
    }

    /// Serialize IMU recording to JSON
    private func serializeIMU(_ recording: IMURecording) -> Data? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys
        return try? encoder.encode(recording)
    }

    // MARK: - Signing

    /// Build deterministic payload for signing
    private func buildSignablePayload(
        sessionId: String,
        nonce: String,
        hashes: HashBundle
    ) -> Data {
        // Canonical format: sessionId|nonce|videoHash|sensorHash|metadataHash
        let payload = [
            sessionId,
            nonce,
            hashes.videoSha256,
            hashes.sensorSha256,
            hashes.metadataSha256
        ].joined(separator: "|")

        return payload.data(using: .utf8)!
    }

    // MARK: - Helpers

    private var appVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
    }
}

// MARK: - Serialization

extension ProofPackBuilder {
    /// Serialize proof payload to JSON data for upload
    func serializeProofPayload(_ payload: ProofPayload) -> Data? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys
        return try? encoder.encode(payload)
    }
}
