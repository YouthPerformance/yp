import Foundation

// MARK: - Jump Model
struct Jump: Identifiable, Codable {
    let id: String
    let userId: String
    var heightInches: Double
    var heightCm: Double
    var confidence: Confidence
    var verificationTier: VerificationTier
    var videoStorageId: String?
    var verificationPayload: VerificationPayload?
    var isPractice: Bool
    var status: JumpStatus
    var gpsCity: String?
    var gpsState: String?
    var gpsCountry: String?
    let createdAt: Date

    enum Confidence: String, Codable {
        case high
        case medium
        case low
    }

    enum VerificationTier: String, Codable {
        case bronze
        case silver
        case gold
        case platinum
    }

    enum JumpStatus: String, Codable {
        case processing
        case complete
        case flagged
        case challenged
    }
}

// MARK: - Verification Payload
struct VerificationPayload: Codable {
    let videoHash: String
    let deviceModel: String
    let osVersion: String
    let appVersion: String
    let gpsLat: Double?
    let gpsLng: Double?
    let gpsAccuracy: Double?
    let captureTimestamp: Date
    let aiModelVersion: String
    let appAttestToken: String? // iOS App Attest
}

// MARK: - Mock Data
extension Jump {
    static let mockJumps: [Jump] = [
        Jump(
            id: "jump_001",
            userId: "user_123",
            heightInches: 32.5,
            heightCm: 82.55,
            confidence: .high,
            verificationTier: .silver,
            videoStorageId: "video_001",
            verificationPayload: nil,
            isPractice: false,
            status: .complete,
            gpsCity: "Houston",
            gpsState: "TX",
            gpsCountry: "US",
            createdAt: Date().addingTimeInterval(-3600)
        ),
        Jump(
            id: "jump_002",
            userId: "user_123",
            heightInches: 31.2,
            heightCm: 79.25,
            confidence: .high,
            verificationTier: .silver,
            videoStorageId: "video_002",
            verificationPayload: nil,
            isPractice: false,
            status: .complete,
            gpsCity: "Houston",
            gpsState: "TX",
            gpsCountry: "US",
            createdAt: Date().addingTimeInterval(-7200)
        ),
        Jump(
            id: "jump_003",
            userId: "user_123",
            heightInches: 30.8,
            heightCm: 78.23,
            confidence: .medium,
            verificationTier: .bronze,
            videoStorageId: "video_003",
            verificationPayload: nil,
            isPractice: false,
            status: .complete,
            gpsCity: nil,
            gpsState: nil,
            gpsCountry: nil,
            createdAt: Date().addingTimeInterval(-86400)
        ),
        Jump(
            id: "jump_004",
            userId: "user_123",
            heightInches: 28.5,
            heightCm: 72.39,
            confidence: .low,
            verificationTier: .bronze,
            videoStorageId: "video_004",
            verificationPayload: nil,
            isPractice: true,
            status: .complete,
            gpsCity: nil,
            gpsState: nil,
            gpsCountry: nil,
            createdAt: Date().addingTimeInterval(-172800)
        )
    ]

    // Best jump from mock data
    static var mockBest: Jump {
        mockJumps.max(by: { $0.heightInches < $1.heightInches })!
    }
}
