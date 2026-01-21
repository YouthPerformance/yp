// ═══════════════════════════════════════════════════════════════
// xLENS CLIENT TESTS
// Unit tests for XLensClient
// ═══════════════════════════════════════════════════════════════

import XCTest
@testable import xLENS

final class XLensClientTests: XCTestCase {

    func testClientInitialization() async {
        let client = await XLens.createClient(
            convexUrl: URL(string: "https://test.convex.cloud")!,
            userId: "test_user"
        )

        let state = await client.state
        XCTAssertEqual(state, .idle)

        let session = await client.currentSession
        XCTAssertNil(session)
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
}
