import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @State private var displayName = ""
    @State private var birthYear = Calendar.current.component(.year, from: Date()) - 16
    @State private var selectedGender: JumpUser.Gender = .male
    @State private var city = ""
    @State private var state = ""
    @State private var country = "US"
    @State private var showAgeError = false
    @State private var isLoading = false

    private let currentYear = Calendar.current.component(.year, from: Date())

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    header

                    // Form
                    profileForm

                    // Age requirement note
                    ageRequirement

                    // Continue button
                    continueButton
                }
                .padding()
            }
            .navigationTitle("Create Profile")
            .navigationBarTitleDisplayMode(.large)
            .alert("Age Requirement", isPresented: $showAgeError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("You must be 13 or older to use YP Jump.")
            }
        }
    }

    // MARK: - Header
    private var header: some View {
        VStack(spacing: 8) {
            Image(systemName: "person.crop.circle.badge.plus")
                .font(.system(size: 60))
                .foregroundColor(.accentColor)

            Text("Let's set up your profile")
                .font(.headline)

            Text("This info helps us match you with athletes in your area and age group.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Profile Form
    private var profileForm: some View {
        VStack(spacing: 20) {
            // Display Name
            VStack(alignment: .leading, spacing: 8) {
                Text("Display Name")
                    .font(.subheadline)
                    .fontWeight(.medium)
                TextField("Choose a username", text: $displayName)
                    .textFieldStyle(.roundedBorder)
                    .autocapitalization(.none)
            }

            // Birth Year
            VStack(alignment: .leading, spacing: 8) {
                Text("Birth Year")
                    .font(.subheadline)
                    .fontWeight(.medium)

                Picker("Birth Year", selection: $birthYear) {
                    ForEach((currentYear - 22)...(currentYear - 13), id: \.self) { year in
                        Text(String(year)).tag(year)
                    }
                }
                .pickerStyle(.wheel)
                .frame(height: 100)
                .clipped()

                Text("Your exact age is never shown. Only age range (e.g., 15-16) is displayed.")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Gender
            VStack(alignment: .leading, spacing: 8) {
                Text("Gender")
                    .font(.subheadline)
                    .fontWeight(.medium)

                Picker("Gender", selection: $selectedGender) {
                    ForEach(JumpUser.Gender.allCases, id: \.self) { gender in
                        Text(gender.rawValue.capitalized).tag(gender)
                    }
                }
                .pickerStyle(.segmented)
            }

            // Location
            VStack(alignment: .leading, spacing: 8) {
                Text("Location")
                    .font(.subheadline)
                    .fontWeight(.medium)

                HStack(spacing: 12) {
                    TextField("City", text: $city)
                        .textFieldStyle(.roundedBorder)

                    TextField("State", text: $state)
                        .textFieldStyle(.roundedBorder)
                        .frame(width: 80)
                }

                Text("Only your city is shown publicly, never your exact location.")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
    }

    // MARK: - Age Requirement
    private var ageRequirement: some View {
        HStack(spacing: 8) {
            Image(systemName: "info.circle")
                .foregroundColor(.blue)
            Text("YP Jump is for athletes ages 13-22")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    // MARK: - Continue Button
    private var continueButton: some View {
        Button(action: handleContinue) {
            Group {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    Text("Continue")
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(isFormValid ? Color.accentColor : Color.gray)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(!isFormValid || isLoading)
    }

    private var isFormValid: Bool {
        !displayName.isEmpty && !city.isEmpty && isAgeValid
    }

    private var isAgeValid: Bool {
        let age = currentYear - birthYear
        return age >= 13 && age <= 22
    }

    // MARK: - Actions
    private func handleContinue() {
        guard isAgeValid else {
            showAgeError = true
            return
        }

        isLoading = true

        // Create user profile
        let newUser = JumpUser(
            id: UUID().uuidString,
            displayName: displayName,
            birthYear: birthYear,
            gender: selectedGender,
            city: city,
            state: state.isEmpty ? nil : state,
            country: country,
            profileVisibility: .public,
            showOnLeaderboards: true,
            dailyJumpsUsed: 0,
            lastJumpResetAt: Date(),
            createdAt: Date(),
            updatedAt: Date()
        )

        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            appState.currentUser = newUser
            appState.hasCompletedOnboarding = true
            isLoading = false
        }
    }
}

#Preview {
    OnboardingView()
        .environmentObject(AppState())
}
