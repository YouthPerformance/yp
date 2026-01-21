import SwiftUI

struct HomeView: View {
    @EnvironmentObject var appState: AppState
    @State private var recentJumps: [Jump] = Jump.mockJumps

    private var user: JumpUser { appState.currentUser ?? .mock }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Welcome Header
                    welcomeHeader

                    // Quick Stats
                    quickStatsCard

                    // Daily Cap Progress
                    dailyCapCard

                    // Recent Jumps
                    recentJumpsSection
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("YP Jump")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Welcome Header
    private var welcomeHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Welcome back,")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Text(user.displayName)
                    .font(.title2)
                    .fontWeight(.bold)
            }
            Spacer()
            // Avatar placeholder
            Circle()
                .fill(Color.accentColor.opacity(0.2))
                .frame(width: 50, height: 50)
                .overlay(
                    Text(String(user.displayName.prefix(1)))
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.accentColor)
                )
        }
    }

    // MARK: - Quick Stats
    private var quickStatsCard: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Your Stats")
                    .font(.headline)
                Spacer()
            }

            HStack(spacing: 20) {
                statItem(
                    title: "Best Jump",
                    value: String(format: "%.1f\"", Jump.mockBest.heightInches),
                    icon: "trophy.fill",
                    color: .yellow
                )

                statItem(
                    title: "Average",
                    value: String(format: "%.1f\"", averageJump),
                    icon: "chart.line.uptrend.xyaxis",
                    color: .blue
                )

                statItem(
                    title: "Total",
                    value: "\(recentJumps.count)",
                    icon: "number",
                    color: .green
                )
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }

    private func statItem(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(value)
                .font(.title3)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var averageJump: Double {
        guard !recentJumps.isEmpty else { return 0 }
        return recentJumps.map(\.heightInches).reduce(0, +) / Double(recentJumps.count)
    }

    // MARK: - Daily Cap
    private var dailyCapCard: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Today's Jumps")
                    .font(.headline)
                Spacer()
                Text("\(user.dailyJumpsUsed)/20")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(user.dailyJumpsUsed >= 20 ? .orange : .accentColor)
            }

            ProgressView(value: Double(user.dailyJumpsUsed), total: 20)
                .tint(user.dailyJumpsUsed >= 20 ? .orange : .accentColor)

            if user.dailyJumpsUsed >= 20 {
                HStack {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.orange)
                    Text("Daily cap reached. Practice jumps only.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }

    // MARK: - Recent Jumps
    private var recentJumpsSection: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Recent Jumps")
                    .font(.headline)
                Spacer()
                NavigationLink("See All") {
                    JumpHistoryView()
                }
                .font(.subheadline)
            }

            ForEach(recentJumps.prefix(3)) { jump in
                JumpRowView(jump: jump)
            }
        }
    }
}

// MARK: - Jump Row View
struct JumpRowView: View {
    let jump: Jump

    var body: some View {
        HStack(spacing: 16) {
            // Height
            VStack(alignment: .leading, spacing: 2) {
                Text(String(format: "%.1f\"", jump.heightInches))
                    .font(.title3)
                    .fontWeight(.bold)
                Text(String(format: "%.1f cm", jump.heightCm))
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            // Verification badge
            verificationBadge

            // Confidence indicator
            confidenceIndicator

            // Time
            Text(jump.createdAt, style: .relative)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.03), radius: 5, x: 0, y: 2)
    }

    private var verificationBadge: some View {
        HStack(spacing: 4) {
            Image(systemName: badgeIcon)
                .font(.caption)
            Text(jump.verificationTier.rawValue.capitalized)
                .font(.caption)
                .fontWeight(.medium)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(badgeColor.opacity(0.2))
        .foregroundColor(badgeColor)
        .cornerRadius(8)
    }

    private var badgeIcon: String {
        switch jump.verificationTier {
        case .bronze: return "shield.fill"
        case .silver: return "shield.checkerboard"
        case .gold: return "medal.fill"
        case .platinum: return "crown.fill"
        }
    }

    private var badgeColor: Color {
        switch jump.verificationTier {
        case .bronze: return .brown
        case .silver: return .gray
        case .gold: return .yellow
        case .platinum: return .purple
        }
    }

    private var confidenceIndicator: some View {
        Group {
            if jump.confidence == .low {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.caption)
                    .foregroundColor(.orange)
            }
        }
    }
}

// MARK: - Jump History View (placeholder)
struct JumpHistoryView: View {
    var body: some View {
        List(Jump.mockJumps) { jump in
            JumpRowView(jump: jump)
                .listRowInsets(EdgeInsets())
                .listRowBackground(Color.clear)
                .padding(.vertical, 4)
        }
        .listStyle(.plain)
        .navigationTitle("Jump History")
    }
}

#Preview {
    HomeView()
        .environmentObject(AppState())
}
