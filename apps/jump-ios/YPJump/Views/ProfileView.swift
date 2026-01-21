import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var appState: AppState
    @State private var showSettings = false

    private var user: JumpUser { appState.currentUser ?? .mock }
    private var jumps: [Jump] { Jump.mockJumps }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile header
                    profileHeader

                    // Stats overview
                    statsOverview

                    // Rankings
                    rankingsCard

                    // Progression chart placeholder
                    progressionChart

                    // Settings shortcuts
                    settingsSection
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Profile")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showSettings = true }) {
                        Image(systemName: "gearshape.fill")
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
        }
    }

    // MARK: - Profile Header
    private var profileHeader: some View {
        VStack(spacing: 16) {
            // Avatar
            Circle()
                .fill(Color.accentColor.opacity(0.2))
                .frame(width: 100, height: 100)
                .overlay(
                    Text(String(user.displayName.prefix(2)))
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.accentColor)
                )

            // Name and info
            VStack(spacing: 4) {
                Text(user.displayName)
                    .font(.title2)
                    .fontWeight(.bold)

                HStack(spacing: 8) {
                    Text("\(user.city), \(user.state ?? "") \(user.country)")
                    Text("•")
                    Text(user.ageRange)
                }
                .font(.subheadline)
                .foregroundColor(.secondary)
            }

            // Share profile button
            Button(action: {}) {
                Label("Share Profile", systemImage: "square.and.arrow.up")
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.small)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    // MARK: - Stats Overview
    private var statsOverview: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Jump Stats")
                    .font(.headline)
                Spacer()
            }

            HStack(spacing: 0) {
                statBox(title: "Best", value: String(format: "%.1f\"", bestJump), subtitle: "Personal Record")
                Divider().frame(height: 50)
                statBox(title: "Average", value: String(format: "%.1f\"", averageJump), subtitle: "All Jumps")
                Divider().frame(height: 50)
                statBox(title: "Total", value: "\(jumps.count)", subtitle: "Verified Jumps")
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    private func statBox(title: String, value: String, subtitle: String) -> some View {
        VStack(spacing: 4) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            Text(subtitle)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var bestJump: Double {
        jumps.map(\.heightInches).max() ?? 0
    }

    private var averageJump: Double {
        guard !jumps.isEmpty else { return 0 }
        return jumps.map(\.heightInches).reduce(0, +) / Double(jumps.count)
    }

    // MARK: - Rankings Card
    private var rankingsCard: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Your Rankings")
                    .font(.headline)
                Spacer()
                NavigationLink("View Leaderboard") {
                    LeaderboardView()
                }
                .font(.caption)
            }

            HStack(spacing: 12) {
                rankingItem(scope: "Global", rank: 127, total: 10542)
                rankingItem(scope: "US", rank: 45, total: 3210)
                rankingItem(scope: "TX", rank: 12, total: 432)
                rankingItem(scope: "Houston", rank: 5, total: 87)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    private func rankingItem(scope: String, rank: Int, total: Int) -> some View {
        VStack(spacing: 4) {
            Text("#\(rank)")
                .font(.title3)
                .fontWeight(.bold)
            Text(scope)
                .font(.caption)
                .foregroundColor(.secondary)
            Text("of \(total)")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }

    // MARK: - Progression Chart
    private var progressionChart: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Progression")
                    .font(.headline)
                Spacer()
                Picker("", selection: .constant("30D")) {
                    Text("7D").tag("7D")
                    Text("30D").tag("30D")
                    Text("90D").tag("90D")
                    Text("All").tag("All")
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
            }

            // Chart placeholder
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.systemGray6))
                    .frame(height: 200)

                VStack(spacing: 8) {
                    Image(systemName: "chart.line.uptrend.xyaxis")
                        .font(.largeTitle)
                        .foregroundColor(.secondary)
                    Text("Progression chart")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    // MARK: - Settings Section
    private var settingsSection: some View {
        VStack(spacing: 12) {
            settingRow(icon: "eye.fill", title: "Profile Visibility", value: user.profileVisibility.rawValue.capitalized)
            settingRow(icon: "trophy.fill", title: "Show on Leaderboards", value: user.showOnLeaderboards ? "Yes" : "No")
            settingRow(icon: "bell.fill", title: "Notifications", value: "Enabled")
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    private func settingRow(icon: String, title: String, value: String) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.accentColor)
                .frame(width: 24)
            Text(title)
            Spacer()
            Text(value)
                .foregroundColor(.secondary)
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .font(.subheadline)
    }
}

// MARK: - Settings View (placeholder)
struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section("Account") {
                    Text("Edit Profile")
                    Text("Privacy Settings")
                    Text("Notifications")
                }

                Section("About") {
                    Text("Help & Support")
                    Text("Terms of Service")
                    Text("Privacy Policy")
                }

                Section {
                    Button("Sign Out", role: .destructive) {
                        // Sign out action
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppState())
}
