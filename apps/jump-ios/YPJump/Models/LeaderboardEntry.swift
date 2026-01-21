import Foundation

// MARK: - Leaderboard Entry
struct LeaderboardEntry: Identifiable, Codable {
    let id: String
    let userId: String
    let displayName: String
    let bestHeightInches: Double
    let verificationTier: Jump.VerificationTier
    let ageGroup: String
    let gender: JumpUser.Gender
    let city: String
    let state: String?
    let country: String
    var rankGlobal: Int?
    var rankCountry: Int?
    var rankState: Int?
    var rankCity: Int?
    let updatedAt: Date
}

// MARK: - Mock Leaderboard Data
extension LeaderboardEntry {
    static let mockLeaderboard: [LeaderboardEntry] = [
        LeaderboardEntry(
            id: "lb_001",
            userId: "user_456",
            displayName: "SkyHighMike",
            bestHeightInches: 42.5,
            verificationTier: .silver,
            ageGroup: "17-18",
            gender: .male,
            city: "Los Angeles",
            state: "CA",
            country: "US",
            rankGlobal: 1,
            rankCountry: 1,
            rankState: 1,
            rankCity: 1,
            updatedAt: Date()
        ),
        LeaderboardEntry(
            id: "lb_002",
            userId: "user_789",
            displayName: "JumpMaster99",
            bestHeightInches: 41.2,
            verificationTier: .silver,
            ageGroup: "17-18",
            gender: .male,
            city: "Chicago",
            state: "IL",
            country: "US",
            rankGlobal: 2,
            rankCountry: 2,
            rankState: 1,
            rankCity: 1,
            updatedAt: Date()
        ),
        LeaderboardEntry(
            id: "lb_003",
            userId: "user_101",
            displayName: "AirTime_Alex",
            bestHeightInches: 40.8,
            verificationTier: .silver,
            ageGroup: "15-16",
            gender: .male,
            city: "Houston",
            state: "TX",
            country: "US",
            rankGlobal: 3,
            rankCountry: 3,
            rankState: 1,
            rankCity: 1,
            updatedAt: Date()
        ),
        LeaderboardEntry(
            id: "lb_004",
            userId: "user_123",
            displayName: "JumpKing23",
            bestHeightInches: 32.5,
            verificationTier: .silver,
            ageGroup: "15-16",
            gender: .male,
            city: "Houston",
            state: "TX",
            country: "US",
            rankGlobal: 127,
            rankCountry: 45,
            rankState: 12,
            rankCity: 5,
            updatedAt: Date()
        ),
        LeaderboardEntry(
            id: "lb_005",
            userId: "user_202",
            displayName: "FlightQueen",
            bestHeightInches: 38.5,
            verificationTier: .silver,
            ageGroup: "17-18",
            gender: .female,
            city: "Miami",
            state: "FL",
            country: "US",
            rankGlobal: 4,
            rankCountry: 4,
            rankState: 1,
            rankCity: 1,
            updatedAt: Date()
        )
    ]
}
