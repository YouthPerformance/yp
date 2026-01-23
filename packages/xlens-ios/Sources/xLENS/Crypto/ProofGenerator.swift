// ═══════════════════════════════════════════════════════════════
// PROOF GENERATOR
// Creates cryptographic proofs for jump verification
// Generates hashes and signatures for the proof payload
//
// Swift 2026 Best Practices:
// - Sendable conformance for concurrency safety
// - Pure async/await
// - @MainActor for UI-related operations
// ═══════════════════════════════════════════════════════════════

import Foundation
import CryptoKit
import UIKit

/// Generates cryptographic proofs for captured jump data
final class ProofGenerator: Sendable {

    // MARK: - Initialization

    init() {}

    // MARK: - Public Interface

    /// Generate a complete proof payload for submission
    @MainActor
    func generateProof(
        session: Session,
        captureResult: CaptureResult,
        deviceKey: DeviceKey
    ) async throws -> ProofPayload {
        // Hash video data
        let videoHash = sha256Hash(data: captureResult.videoData)

        // Hash sensor data
        let sensorHash = sha256Hash(data: captureResult.sensorData)

        // Create metadata for hashing
        let metadata = ProofMetadata(
            sessionId: session.id,
            nonce: session.nonce,
            startedAtMs: Int64(captureResult.startTime.timeIntervalSince1970 * 1000),
            endedAtMs: Int64(captureResult.endTime.timeIntervalSince1970 * 1000),
            fps: captureResult.fps
        )

        let metadataData = try JSONEncoder().encode(metadata)
        let metadataHash = sha256Hash(data: metadataData)

        // Get device info (requires MainActor for UIDevice access)
        let deviceInfo = getDeviceInfo()

        // Create the capture info
        let captureInfo = ProofPayload.CaptureInfo(
            startedAtMs: Int64(captureResult.startTime.timeIntervalSince1970 * 1000),
            endedAtMs: Int64(captureResult.endTime.timeIntervalSince1970 * 1000),
            fps: captureResult.fps,
            device: deviceInfo
        )

        // Create hashes object
        let hashes = ProofPayload.Hashes(
            videoSha256: videoHash,
            sensorSha256: sensorHash,
            metadataSha256: metadataHash
        )

        // Create signature payload (what we sign)
        let signaturePayload = SignaturePayload(
            sessionId: session.id,
            nonce: session.nonce,
            videoHash: videoHash,
            sensorHash: sensorHash,
            metadataHash: metadataHash,
            timestamp: Int64(Date().timeIntervalSince1970 * 1000)
        )

        // Sign the payload
        let signature = try sign(payload: signaturePayload, with: deviceKey)

        return ProofPayload(
            sessionId: session.id,
            nonce: session.nonce,
            capture: captureInfo,
            hashes: hashes,
            signature: ProofPayload.Signature(
                keyId: deviceKey.keyId,
                sig: signature
            ),
            gps: nil // GPS coordinates added separately
        )
    }

    // MARK: - Private Methods

    private func sha256Hash(data: Data) -> String {
        let digest = SHA256.hash(data: data)
        return digest.map { String(format: "%02x", $0) }.joined()
    }

    @MainActor
    private func getDeviceInfo() -> ProofPayload.DeviceInfo {
        let device = UIDevice.current
        let model = getDeviceModel()
        let osVersion = device.systemVersion
        let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"

        return ProofPayload.DeviceInfo(
            model: model,
            osVersion: osVersion,
            appVersion: appVersion
        )
    }

    private func getDeviceModel() -> String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let modelCode = withUnsafePointer(to: &systemInfo.machine) {
            $0.withMemoryRebound(to: CChar.self, capacity: 1) {
                String(cString: $0)
            }
        }
        return modelCode
    }

    private func sign(payload: SignaturePayload, with deviceKey: DeviceKey) throws -> String {
        // Encode payload to JSON
        let encoder = JSONEncoder()
        encoder.outputFormatting = .sortedKeys
        let payloadData = try encoder.encode(payload)

        // Sign with device key
        let signature = try deviceKey.sign(data: payloadData)

        // Return base64-encoded signature
        return signature.base64EncodedString()
    }
}

// MARK: - Supporting Types

private struct ProofMetadata: Codable, Sendable {
    let sessionId: String
    let nonce: String
    let startedAtMs: Int64
    let endedAtMs: Int64
    let fps: Int
}

private struct SignaturePayload: Codable, Sendable {
    let sessionId: String
    let nonce: String
    let videoHash: String
    let sensorHash: String
    let metadataHash: String
    let timestamp: Int64
}
