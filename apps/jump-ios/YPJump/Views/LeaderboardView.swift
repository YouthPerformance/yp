import SwiftUI

struct LeaderboardView: View {
    @State private var selectedScope: LeaderboardScope = .global
    @State private var selectedAgeGroup: String = "All"
    @State private var selectedGender: String = "All"
    @State private var selectedTimePeriod: TimePeriod = .allTime

    private let currentUserId = "user_123"

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filters
                filtersSection

                // Leaderboard list
                leaderboardList
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Leaderboard")
        }
    }

    // MARK: - Filters
    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Scope picker
            Picker("Scope", selection: $selectedScope) {
                ForEach(LeaderboardScope.allCases, id: \.self) { scope in
                    Text(scope.rawValue).tag(scope)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)

            // Additional filters
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    filterChip(label: "Age", value: selectedAgeGroup, options: ["All", "13-14", "15-16", "17-18", "19-22"]) {
                        selectedAgeGroup = $0
                    }

                    filterChip(label: "Gender", value: selectedGender, options: ["All", "Male", "Female"]) {
                        selectedGender = $0
                    }

                    filterChip(label: "Time", value: selectedTimePeriod.rawValue, options: TimePeriod.allCases.map(\.rawValue)) {
                        selectedTimePeriod = TimePeriod(rawValue: $0) ?? .allTime
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
    }

    private func filterChip(label: String, value: String, options: [String], onSelect: @escaping (String) -> Void) -> some View {
        Menu {
            ForEach(options, id: \.self) { option in
                Button(option) {
                    onSelect(option)
                }
            }
        } label: {
            HStack(spacing: 4) {
                Text(label)
                    .foregroundColor(.secondary)
                Text(value)
                    .fontWeight(.medium)
                Image(systemName: "chevron.down")
                    .font(.caption2)
            }
            .font(.caption)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .cornerRadius(20)
        }
        .foregroundColor(.primary)
    }

    // MARK: - Leaderboard List
    private var leaderboardList: some View {
        ScrollView {
            LazyVStack(spacing: 8) {
                ForEach(Array(LeaderboardEntry.mockLeaderboard.enumerated()), id: \.element.id) { index, entry in
                    LeaderboardRowView(
                        rank: index + 1,
                        entry: entry,
                        isCurrentUser: entry.userId == currentUserId
                    )
                }
            }
            .padding()
        }
    }
}

// MARK: - Supporting Types
enum LeaderboardScope: String, CaseIterable {
    case global = "Global"
    case country = "Country"
    case state = "State"
    case city = "City"
}

enum TimePeriod: String, CaseIterable {
    case allTime = "All Time"
    case thisYear = "This Year"
    case thisMonth = "This Month"
    case thisWeek = "This Week"
}

// MARK: - Leaderboard Row
struct LeaderboardRowView: View {
    let rank: Int
    let entry: LeaderboardEntry
    let isCurrentUser: Bool

    var body: some View {
        HStack(spacing: 16) {
            // Rank
            ZStack {
                if rank <= 3 {
                    Circle()
                        .fill(rankColor)
                        .frame(width: 36, height: 36)
                    Text("\(rank)")
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                } else {
                    Text("\(rank)")
                        .font(.headline)
                        .foregroundColor(.secondary)
                        .frame(width: 36)
                }
            }

            // Avatar placeholder
            Circle()
                .fill(isCurrentUser ? Color.accentColor.opacity(0.2) : Color.gray.opacity(0.2))
                .frame(width: 44, height: 44)
                .overlay(
                    Text(String(entry.displayName.prefix(1)))
                        .font(.headline)
                        .foregroundColor(isCurrentUser ? .accentColor : .gray)
                )

            // User info
            VStack(alignment: .leading, spacing: 2) {
                HStack {
                    Text(entry.displayName)
                        .font(.headline)
                    if isCurrentUser {
                        Text("(You)")
                            .font(.caption)
                            .foregroundColor(.accentColor)
                    }
                }

                HStack(spacing: 8) {
                    Text("\(entry.city), \(entry.state ?? "")")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Text("•")
                        .foregroundColor(.secondary)

                    Text(entry.ageGroup)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            // Height + badge
            VStack(alignment: .trailing, spacing: 4) {
                Text(String(format: "%.1f\"", entry.bestHeightInches))
                    .font(.title3)
                    .fontWeight(.bold)

                verificationBadge
            }
        }
        .padding()
        .background(isCurrentUser ? Color.accentColor.opacity(0.1) : Color(.systemBackground))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(isCurrentUser ? Color.accentColor : Color.clear, lineWidth: 2)
        )
    }

    private var rankColor: Color {
        switch rank {
        case 1: return .yellow
        case 2: return .gray
        case 3: return .brown
        default: return .clear
        }
    }

    private var verificationBadge: some View {
        HStack(spacing: 2) {
            Image(systemName: "shield.fill")
                .font(.caption2)
            Text(entry.verificationTier.rawValue.prefix(1).uppercased())
                .font(.caption2)
                .fontWeight(.bold)
        }
        .foregroundColor(badgeColor)
    }

    private var badgeColor: Color {
        switch entry.verificationTier {
        case .bronze: return .brown
        case .silver: return .gray
        case .gold: return .yellow
        case .platinum: return .purple
        }
    }
}

#Preview {
    LeaderboardView()
}
