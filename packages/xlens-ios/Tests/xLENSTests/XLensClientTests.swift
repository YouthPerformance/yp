// ═══════════════════════════════════════════════════════════════
// xLENS CLIENT TESTS
// Unit tests for XLensClient
//
// Swift 2026 Best Practices:
// - Async test methods
// - @MainActor for client access
// ═══════════════════════════════════════════════════════════════

import XCTest
@testable import xLENS

final class XLensClientTests: XCTestCase {

    @MainActor
    func testClientInitialization() async {
        let client = XLens.createClient(
            convexUrl: URL(string: "https://test.convex.cloud")!,
            userId: "test_user"
        )

        XCTAssertEqual(client.state, .idle)
        XCTAssertNil(client.currentSession)
    }

    func testSessionExpiration() {
        let session = Session(
            id: "test_session",
            nonce: "abc123",
            nonceDisplay: "A7B3X9",
            expiresAt: Date().addingTimeInterval(-10), // Expired 10 seconds ago
            deviceKeyId: "key_123"
        )

        XCTAssertTrue(session.isExpired)
        XCTAssertEqual(session.remainingTime, 0)
    }

    func testSessionNotExpired() {
        let session = Session(
            id: "test_session",
            nonce: "abc123",
            nonceDisplay: "A7B3X9",
            expiresAt: Date().addingTimeInterval(60), // Expires in 60 seconds
            deviceKeyId: "key_123"
        )

        XCTAssertFalse(session.isExpired)
        XCTAssertGreaterThan(session.remainingTime, 50)
    }

    func testJumpStatusValues() {
        XCTAssertEqual(JumpStatus.uploading.rawValue, "uploading")
        XCTAssertEqual(JumpStatus.processing.rawValue, "processing")
        XCTAssertEqual(JumpStatus.complete.rawValue, "complete")
        XCTAssertEqual(JumpStatus.flagged.rawValue, "flagged")
        XCTAssertEqual(JumpStatus.challenged.rawValue, "challenged")
    }

    func testVerificationTierValues() {
        XCTAssertEqual(VerificationTier.measured.rawValue, "measured")
        XCTAssertEqual(VerificationTier.bronze.rawValue, "bronze")
        XCTAssertEqual(VerificationTier.silver.rawValue, "silver")
        XCTAssertEqual(VerificationTier.gold.rawValue, "gold")
        XCTAssertEqual(VerificationTier.rejected.rawValue, "rejected")
    }

    func testGPSLocationEncoding() throws {
        let location = GPSLocation(
            city: "Austin",
            state: "TX",
            country: "US"
        )

        let encoder = JSONEncoder()
        let data = try encoder.encode(location)
        let json = String(data: data, encoding: .utf8)!

        XCTAssertTrue(json.contains("Austin"))
        XCTAssertTrue(json.contains("TX"))
        XCTAssertTrue(json.contains("US"))
    }

    func testXLensStateEquality() {
        XCTAssertEqual(XLensState.idle, XLensState.idle)
        XCTAssertEqual(XLensState.capturing, XLensState.capturing)
        XCTAssertNotEqual(XLensState.idle, XLensState.capturing)
    }

    func testIMUSampleCoding() throws {
        let sample = IMUSample(
            timestamp: 1234567890.123,
            accelerationX: 0.1,
            accelerationY: 0.2,
            accelerationZ: 9.8,
            rotationX: 0.01,
            rotationY: 0.02,
            rotationZ: 0.03
        )

        let encoder = JSONEncoder()
        let data = try encoder.encode(sample)

        let decoder = JSONDecoder()
        let decoded = try decoder.decode(IMUSample.self, from: data)

        XCTAssertEqual(decoded.timestamp, sample.timestamp)
        XCTAssertEqual(decoded.accelerationX, sample.accelerationX)
        XCTAssertEqual(decoded.accelerationY, sample.accelerationY)
        XCTAssertEqual(decoded.accelerationZ, sample.accelerationZ)
    }

    func testDailyCapStatus() {
        let status = DailyCapStatus(
            jumpsUsed: 3,
            remaining: 2,
            cap: 5,
            isOverCap: false
        )

        XCTAssertEqual(status.jumpsUsed, 3)
        XCTAssertEqual(status.remaining, 2)
        XCTAssertEqual(status.cap, 5)
        XCTAssertFalse(status.isOverCap)
    }

    @MainActor
    func testClientStateTransitions() async {
        let client = XLens.createClient(
            convexUrl: URL(string: "https://test.convex.cloud")!,
            userId: "test_user"
        )

        // Initial state
        XCTAssertEqual(client.state, .idle)

        // Reset should maintain idle
        client.reset()
        XCTAssertEqual(client.state, .idle)
        XCTAssertNil(client.lastJump)
    }
}
