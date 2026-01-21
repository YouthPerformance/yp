import SwiftUI

struct ResultView: View {
    let jump: Jump
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 32) {
                    // Hero measurement
                    measurementHero

                    // Verification badge
                    verificationCard

                    // Details
                    detailsCard

                    // Action buttons
                    actionButtons
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Jump Result")
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

    // MARK: - Measurement Hero
    private var measurementHero: some View {
        VStack(spacing: 8) {
            Text("🎉")
                .font(.system(size: 60))

            HStack(alignment: .lastTextBaseline, spacing: 4) {
                Text(String(format: "%.1f", jump.heightInches))
                    .font(.system(size: 72, weight: .bold, design: .rounded))
                Text("in")
                    .font(.title)
                    .foregroundColor(.secondary)
            }

            Text(String(format: "%.1f cm", jump.heightCm))
                .font(.title3)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 24)
    }

    // MARK: - Verification Card
    private var verificationCard: some View {
        VStack(spacing: 16) {
            HStack {
                Image(systemName: badgeIcon)
                    .font(.title)
                    .foregroundColor(badgeColor)

                VStack(alignment: .leading, spacing: 4) {
                    Text("\(jump.verificationTier.rawValue.capitalized) Verified")
                        .font(.headline)
                    Text(verificationDescription)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()
            }

            // Verification signals
            HStack(spacing: 12) {
                signalChip(icon: "video.fill", text: "Video", verified: true)
                signalChip(icon: "iphone", text: "Device", verified: true)
                signalChip(icon: "location.fill", text: "GPS", verified: jump.verificationTier == .silver)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
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

    private var verificationDescription: String {
        switch jump.verificationTier {
        case .bronze: return "Video captured in-app with device verification"
        case .silver: return "Video + GPS + App Attest verification"
        case .gold: return "Video + GPS + Wearable correlation"
        case .platinum: return "Witnessed measurement at verified location"
        }
    }

    private func signalChip(icon: String, text: String, verified: Bool) -> some View {
        HStack(spacing: 4) {
            Image(systemName: verified ? "checkmark.circle.fill" : icon)
                .font(.caption)
            Text(text)
                .font(.caption)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(verified ? Color.green.opacity(0.15) : Color.gray.opacity(0.15))
        .foregroundColor(verified ? .green : .gray)
        .cornerRadius(8)
    }

    // MARK: - Details Card
    private var detailsCard: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Details")
                    .font(.headline)
                Spacer()
            }

            VStack(spacing: 12) {
                detailRow(label: "Confidence", value: jump.confidence.rawValue.capitalized)
                detailRow(label: "Location", value: locationString)
                detailRow(label: "Recorded", value: jump.createdAt.formatted(date: .abbreviated, time: .shortened))

                if jump.isPractice {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.orange)
                        Text("Practice jump (over daily cap)")
                            .font(.caption)
                            .foregroundColor(.orange)
                        Spacer()
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }

    private var locationString: String {
        if let city = jump.gpsCity, let state = jump.gpsState {
            return "\(city), \(state)"
        }
        return "Not recorded"
    }

    private func detailRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
        .font(.subheadline)
    }

    // MARK: - Action Buttons
    private var actionButtons: some View {
        VStack(spacing: 12) {
            Button(action: {}) {
                Label("Share Result", systemImage: "square.and.arrow.up")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.accentColor)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }

            Button(action: {}) {
                Label("Watch Replay", systemImage: "play.circle")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(.systemBackground))
                    .foregroundColor(.accentColor)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.accentColor, lineWidth: 1)
                    )
            }
        }
    }
}

#Preview {
    ResultView(jump: Jump.mockBest)
}
