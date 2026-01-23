// ═══════════════════════════════════════════════════════════════
// CONVEX CLIENT
// HTTP client for Convex backend communication
// Handles mutations, queries, and file uploads
//
// Swift 2026 Best Practices:
// - Actor isolation for thread safety
// - Sendable nested types
// - Pure async/await (no Combine)
// ═══════════════════════════════════════════════════════════════

import Foundation

/// HTTP client for Convex backend
/// Maps to the jump/*.ts Convex functions
actor ConvexClient {

    // MARK: - Properties

    private let baseURL: URL
    private let authToken: String?
    private let session: URLSession

    // Convex function endpoints
    private var queryURL: URL { baseURL.appendingPathComponent("query") }
    private var mutationURL: URL { baseURL.appendingPathComponent("mutation") }
    private var uploadURL: URL { baseURL.appendingPathComponent("upload") }

    // MARK: - Initialization

    init(baseURL: URL, authToken: String? = nil) {
        self.baseURL = baseURL
        self.authToken = authToken

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 300 // 5 minutes for uploads
        self.session = URLSession(configuration: config)
    }

    // MARK: - Session Management

    struct CreateSessionResponse: Codable, Sendable {
        let sessionId: String
        let nonce: String
        let nonceDisplay: String
        let expiresAt: Int64
        let expiresInMs: Int
    }

    func createSession(userId: String, deviceKeyId: String?) async throws -> CreateSessionResponse {
        var args: [String: Any] = ["userId": userId]
        if let deviceKeyId = deviceKeyId {
            args["deviceKeyId"] = deviceKeyId
        }

        return try await mutation(
            path: "jump/sessions:create",
            args: args
        )
    }

    struct SessionValidationResponse: Codable, Sendable {
        let valid: Bool
        let reason: String?
    }

    func validateSession(sessionId: String, nonce: String) async throws -> SessionValidationResponse {
        return try await query(
            path: "jump/sessions:validate",
            args: [
                "sessionId": sessionId,
                "nonce": nonce
            ]
        )
    }

    // MARK: - Jump Submission

    struct SubmitJumpResponse: Codable, Sendable {
        let jumpId: String
        let status: String
    }

    func submitJump(
        userId: String,
        sessionId: String,
        videoStorageId: String,
        sensorStorageId: String,
        proofPayload: ProofPayload,
        gps: GPSLocation?
    ) async throws -> SubmitJumpResponse {
        var args: [String: Any] = [
            "userId": userId,
            "sessionId": sessionId,
            "videoStorageId": videoStorageId,
            "sensorStorageId": sensorStorageId,
            "proofPayload": proofPayload.toDictionary()
        ]

        if let gps = gps {
            var gpsDict: [String: Any] = [
                "city": gps.city,
                "country": gps.country
            ]
            if let state = gps.state {
                gpsDict["state"] = state
            }
            args["gps"] = gpsDict
        }

        return try await mutation(
            path: "jump/jumps:submit",
            args: args
        )
    }

    struct MarkUploadedResponse: Codable, Sendable {
        let success: Bool
    }

    func markJumpUploaded(jumpId: String) async throws -> MarkUploadedResponse {
        return try await mutation(
            path: "jump/jumps:markUploaded",
            args: ["jumpId": jumpId]
        )
    }

    // MARK: - Jump Queries

    func listJumps(userId: String, limit: Int, excludePractice: Bool = false) async throws -> [Jump] {
        struct JumpResponse: Codable, Sendable {
            let _id: String
            let userId: String
            let sessionId: String
            let status: String
            let heightInches: Double?
            let heightCm: Double?
            let flightTimeMs: Int?
            let confidence: Double?
            let verificationTier: String?
            let isPractice: Bool
            let createdAt: Int64
        }

        let response: [JumpResponse] = try await query(
            path: "jump/jumps:listForUser",
            args: [
                "userId": userId,
                "limit": limit,
                "excludePractice": excludePractice
            ]
        )

        return response.map { j in
            Jump(
                id: j._id,
                status: JumpStatus(rawValue: j.status) ?? .processing,
                sessionId: j.sessionId,
                heightInches: j.heightInches,
                heightCm: j.heightCm,
                flightTimeMs: j.flightTimeMs,
                verificationTier: j.verificationTier.flatMap { VerificationTier(rawValue: $0) },
                confidence: j.confidence
            )
        }
    }

    func getBestJump(userId: String, minTier: VerificationTier?) async throws -> Jump? {
        struct JumpResponse: Codable, Sendable {
            let _id: String
            let userId: String
            let sessionId: String
            let status: String
            let heightInches: Double?
            let heightCm: Double?
            let flightTimeMs: Int?
            let confidence: Double?
            let verificationTier: String?
        }

        var args: [String: Any] = ["userId": userId]
        if let minTier = minTier {
            args["minTier"] = minTier.rawValue
        }

        let response: JumpResponse? = try await query(
            path: "jump/jumps:getBestForUser",
            args: args
        )

        guard let j = response else { return nil }

        return Jump(
            id: j._id,
            status: JumpStatus(rawValue: j.status) ?? .processing,
            sessionId: j.sessionId,
            heightInches: j.heightInches,
            heightCm: j.heightCm,
            flightTimeMs: j.flightTimeMs,
            verificationTier: j.verificationTier.flatMap { VerificationTier(rawValue: $0) },
            confidence: j.confidence
        )
    }

    // MARK: - Daily Cap

    func checkDailyCap(userId: String) async throws -> DailyCapStatus {
        struct CapResponse: Codable, Sendable {
            let jumpsUsed: Int
            let remaining: Int
            let cap: Int
            let isOverCap: Bool
            let needsReset: Bool
        }

        let response: CapResponse = try await query(
            path: "jump/jumpUsers:checkDailyCap",
            args: ["userId": userId]
        )

        return DailyCapStatus(
            jumpsUsed: response.jumpsUsed,
            remaining: response.remaining,
            cap: response.cap,
            isOverCap: response.isOverCap
        )
    }

    // MARK: - File Upload

    func uploadFile(data: Data, contentType: String) async throws -> String {
        var request = URLRequest(url: uploadURL)
        request.httpMethod = "POST"
        request.setValue(contentType, forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (responseData, response) = try await session.upload(for: request, from: data)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw XLensError.networkError("Invalid response type")
        }

        guard httpResponse.statusCode == 200 else {
            let message = String(data: responseData, encoding: .utf8) ?? "Unknown error"
            throw XLensError.uploadFailed("Status \(httpResponse.statusCode): \(message)")
        }

        struct UploadResponse: Codable, Sendable {
            let storageId: String
        }

        let uploadResponse = try JSONDecoder().decode(UploadResponse.self, from: responseData)
        return uploadResponse.storageId
    }

    // MARK: - Generic Query/Mutation

    private func query<T: Decodable>(path: String, args: [String: Any]) async throws -> T {
        return try await request(url: queryURL, path: path, args: args)
    }

    private func mutation<T: Decodable>(path: String, args: [String: Any]) async throws -> T {
        return try await request(url: mutationURL, path: path, args: args)
    }

    private func request<T: Decodable>(url: URL, path: String, args: [String: Any]) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let body: [String: Any] = [
            "path": path,
            "args": args,
            "format": "json"
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw XLensError.networkError("Invalid response type")
        }

        guard httpResponse.statusCode == 200 else {
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw XLensError.serverError(httpResponse.statusCode, message)
        }

        // Convex wraps response in { "value": ... }
        struct ConvexResponse<V: Decodable>: Decodable {
            let value: V
        }

        do {
            let convexResponse = try JSONDecoder().decode(ConvexResponse<T>.self, from: data)
            return convexResponse.value
        } catch {
            throw XLensError.decodingError(error.localizedDescription)
        }
    }
}

// MARK: - Proof Payload

struct ProofPayload: Sendable {
    let sessionId: String
    let nonce: String
    let capture: CaptureInfo
    let hashes: Hashes
    let signature: Signature
    let gps: GPSCoordinates?

    struct CaptureInfo: Sendable {
        let testType: String = "VERT_JUMP"
        let startedAtMs: Int64
        let endedAtMs: Int64
        let fps: Int
        let device: DeviceInfo
    }

    struct DeviceInfo: Sendable {
        let platform: String = "ios"
        let model: String
        let osVersion: String
        let appVersion: String
    }

    struct Hashes: Sendable {
        let videoSha256: String
        let sensorSha256: String
        let metadataSha256: String
    }

    struct Signature: Sendable {
        let alg: String = "ES256"
        let keyId: String
        let sig: String
    }

    struct GPSCoordinates: Sendable {
        let lat: Double
        let lng: Double
        let accuracyM: Double
        let capturedAtMs: Int64
    }

    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = [
            "sessionId": sessionId,
            "nonce": nonce,
            "capture": [
                "testType": capture.testType,
                "startedAtMs": capture.startedAtMs,
                "endedAtMs": capture.endedAtMs,
                "fps": capture.fps,
                "device": [
                    "platform": capture.device.platform,
                    "model": capture.device.model,
                    "osVersion": capture.device.osVersion,
                    "appVersion": capture.device.appVersion
                ]
            ],
            "hashes": [
                "videoSha256": hashes.videoSha256,
                "sensorSha256": hashes.sensorSha256,
                "metadataSha256": hashes.metadataSha256
            ],
            "signature": [
                "alg": signature.alg,
                "keyId": signature.keyId,
                "sig": signature.sig
            ]
        ]

        if let gps = gps {
            dict["gps"] = [
                "lat": gps.lat,
                "lng": gps.lng,
                "accuracyM": gps.accuracyM,
                "capturedAtMs": gps.capturedAtMs
            ]
        }

        return dict
    }
}
