import Foundation

// MARK: - User Model
struct JumpUser: Identifiable, Codable {
    let id: String
    var displayName: String
    var birthYear: Int
    var gender: Gender
    var city: String
    var state: String?
    var country: String
    var profileVisibility: ProfileVisibility
    var showOnLeaderboards: Bool
    var dailyJumpsUsed: Int
    var lastJumpResetAt: Date
    let createdAt: Date
    var updatedAt: Date

    enum Gender: String, Codable, CaseIterable {
        case male
        case female
        case other
    }

    enum ProfileVisibility: String, Codable, CaseIterable {
        case `public`
        case regional
        case `private`
    }

    // Computed property for age range (never show exact age)
    var ageRange: String {
        let currentYear = Calendar.current.component(.year, from: Date())
        let age = currentYear - birthYear
        switch age {
        case 13...14: return "13-14"
        case 15...16: return "15-16"
        case 17...18: return "17-18"
        case 19...22: return "19-22"
        default: return "Unknown"
        }
    }

    // Check if daily cap needs reset
    var needsCapReset: Bool {
        !Calendar.current.isDateInToday(lastJumpResetAt)
    }

    var remainingJumps: Int {
        max(0, 20 - dailyJumpsUsed)
    }
}

// MARK: - Mock Data
extension JumpUser {
    static let mock = JumpUser(
        id: "user_123",
        displayName: "JumpKing23",
        birthYear: 2008,
        gender: .male,
        city: "Houston",
        state: "TX",
        country: "US",
        profileVisibility: .public,
        showOnLeaderboards: true,
        dailyJumpsUsed: 5,
        lastJumpResetAt: Date(),
        createdAt: Date().addingTimeInterval(-86400 * 30),
        updatedAt: Date()
    )
}
