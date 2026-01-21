import SwiftUI

struct AuthView: View {
    @EnvironmentObject var appState: AppState
    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                Spacer()

                // Logo and tagline
                logoSection

                // Auth form
                authForm

                // Or divider
                orDivider

                // Social sign in
                socialSignIn

                Spacer()

                // Toggle sign up/sign in
                toggleAuthMode
            }
            .padding()
            .background(
                LinearGradient(
                    colors: [Color.accentColor.opacity(0.1), Color(.systemBackground)],
                    startPoint: .top,
                    endPoint: .center
                )
                .ignoresSafeArea()
            )
        }
    }

    // MARK: - Logo Section
    private var logoSection: some View {
        VStack(spacing: 16) {
            // App icon placeholder
            ZStack {
                RoundedRectangle(cornerRadius: 24)
                    .fill(Color.accentColor)
                    .frame(width: 100, height: 100)

                Image(systemName: "figure.jumprope")
                    .font(.system(size: 50))
                    .foregroundColor(.white)
            }

            VStack(spacing: 4) {
                Text("YP Jump")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                Text("Verified vertical jump measurement")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
    }

    // MARK: - Auth Form
    private var authForm: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $email)
                .textFieldStyle(.roundedBorder)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)

            SecureField("Password", text: $password)
                .textFieldStyle(.roundedBorder)
                .textContentType(isSignUp ? .newPassword : .password)

            Button(action: handleAuth) {
                Group {
                    if isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text(isSignUp ? "Create Account" : "Sign In")
                    }
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.accentColor)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .disabled(isLoading || email.isEmpty || password.isEmpty)
        }
    }

    // MARK: - Or Divider
    private var orDivider: some View {
        HStack {
            Rectangle()
                .fill(Color.secondary.opacity(0.3))
                .frame(height: 1)
            Text("or")
                .font(.caption)
                .foregroundColor(.secondary)
            Rectangle()
                .fill(Color.secondary.opacity(0.3))
                .frame(height: 1)
        }
    }

    // MARK: - Social Sign In
    private var socialSignIn: some View {
        VStack(spacing: 12) {
            // Sign in with Apple
            Button(action: handleAppleSignIn) {
                HStack {
                    Image(systemName: "apple.logo")
                    Text("Continue with Apple")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.black)
                .foregroundColor(.white)
                .cornerRadius(12)
            }

            // Sign in with Google
            Button(action: handleGoogleSignIn) {
                HStack {
                    Image(systemName: "g.circle.fill")
                    Text("Continue with Google")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemBackground))
                .foregroundColor(.primary)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.secondary.opacity(0.3), lineWidth: 1)
                )
            }
        }
    }

    // MARK: - Toggle Auth Mode
    private var toggleAuthMode: some View {
        HStack {
            Text(isSignUp ? "Already have an account?" : "Don't have an account?")
                .foregroundColor(.secondary)
            Button(isSignUp ? "Sign In" : "Sign Up") {
                withAnimation {
                    isSignUp.toggle()
                }
            }
            .fontWeight(.semibold)
        }
        .font(.subheadline)
    }

    // MARK: - Actions
    private func handleAuth() {
        isLoading = true

        // Simulate auth delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            appState.isAuthenticated = true
        }
    }

    private func handleAppleSignIn() {
        // Apple Sign In implementation
        appState.isAuthenticated = true
    }

    private func handleGoogleSignIn() {
        // Google Sign In implementation
        appState.isAuthenticated = true
    }
}

#Preview {
    AuthView()
        .environmentObject(AppState())
}
