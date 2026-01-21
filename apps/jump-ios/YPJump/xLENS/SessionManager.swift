// ═══════════════════════════════════════════════════════════════
// SESSION MANAGER
// Manages xLENS sessions and nonce lifecycle
// Handles challenge-response for anti-replay protection
// ═══════════════════════════════════════════════════════════════

import Foundation
import Combine

/// Manages xLENS session lifecycle
/// - Fetches session nonces from server
/// - Tracks session expiry
/// - Provides nonce for video overlay
@MainActor
final class SessionManager: ObservableObject {

    // MARK: - Published State

    @Published private(set) var currentSession: XLENSSession?
    @Published private(set) var isLoading = false
    @Published private(set) var error: XLENSError?
    @Published private(set) var timeRemaining: Int = 0

    // MARK: - Private Properties

    private var expiryTimer: Timer?
    private var cancellables = Set<AnyCancellable>()

    // Session expiry buffer (fetch new session when < 30s remaining)
    private let expiryBufferSeconds = 30

    // MARK: - Computed Properties

    /// Display-friendly nonce for video overlay (e.g., "A7B3X9K2")
    var nonceDisplay: String {
        currentSession?.nonceDisplay ?? "--------"
    }

    /// Whether we have a valid, non-expired session
    var hasValidSession: Bool {
        guard let session = currentSession else { return false }
        return session.expiresAt > Date()
    }

    /// Seconds until session expires
    var secondsUntilExpiry: Int {
        guard let session = currentSession else { return 0 }
        return max(0, Int(session.expiresAt.timeIntervalSinceNow))
    }

    // MARK: - Session Management

    /// Fetch a new session from the server
    /// - Parameter userId: The jump user ID
    func fetchSession(userId: String) async {
        isLoading = true
        error = nil

        do {
            // TODO: Replace with actual Convex API call
            // let session = try await convexClient.mutation("jump/sessions:create", args: ["userId": userId])

            // Mock session for development
            let session = mockCreateSession()

            currentSession = session
            startExpiryTimer()

            print("✅ SessionManager: New session created")
            print("   Session ID: \(session.sessionId)")
            print("   Nonce Display: \(session.nonceDisplay)")
            print("   Expires in: \(session.expiresInMs / 1000)s")

        } catch {
            self.error = .networkError(error)
            print("❌ SessionManager: Failed to create session - \(error)")
        }

        isLoading = false
    }

    /// Refresh session if it's close to expiring
    func refreshIfNeeded(userId: String) async {
        guard let session = currentSession else {
            await fetchSession(userId: userId)
            return
        }

        // Refresh if less than buffer time remaining
        if secondsUntilExpiry < expiryBufferSeconds {
            await fetchSession(userId: userId)
        }
    }

    /// Validate that the current session matches the provided nonce
    func validateNonce(_ nonce: String) -> Bool {
        guard let session = currentSession else { return false }
        return session.nonce == nonce && session.expiresAt > Date()
    }

    /// Clear the current session
    func clearSession() {
        currentSession = nil
        stopExpiryTimer()
    }

    // MARK: - Timer Management

    private func startExpiryTimer() {
        stopExpiryTimer()

        // Update every second
        expiryTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self = self else { return }
                self.timeRemaining = self.secondsUntilExpiry

                if self.timeRemaining <= 0 {
                    self.handleExpiry()
                }
            }
        }
    }

    private func stopExpiryTimer() {
        expiryTimer?.invalidate()
        expiryTimer = nil
    }

    private func handleExpiry() {
        print("⚠️ SessionManager: Session expired")
        error = .sessionExpired
        clearSession()
    }

    // MARK: - Mock Implementation

    private func mockCreateSession() -> XLENSSession {
        let now = Date()
        let expiresAt = now.addingTimeInterval(120) // 120 seconds

        // Generate random nonce display (6-8 alphanumeric chars)
        let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        let nonceDisplay = String((0..<8).map { _ in chars.randomElement()! })

        // Generate random nonce (base64)
        var bytes = [UInt8](repeating: 0, count: 16)
        _ = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        let nonce = Data(bytes).base64EncodedString()

        return XLENSSession(
            sessionId: "session_\(UUID().uuidString.prefix(8))",
            nonce: nonce,
            nonceDisplay: nonceDisplay,
            expiresAt: expiresAt,
            expiresInMs: 120000
        )
    }
}

// MARK: - Session Display

extension SessionManager {
    /// Formatted time remaining string
    var timeRemainingFormatted: String {
        let minutes = timeRemaining / 60
        let seconds = timeRemaining % 60

        if minutes > 0 {
            return "\(minutes):\(String(format: "%02d", seconds))"
        } else {
            return "\(seconds)s"
        }
    }

    /// Color indicator for time remaining
    var timeRemainingColor: String {
        if timeRemaining > 60 {
            return "green"
        } else if timeRemaining > 30 {
            return "yellow"
        } else {
            return "red"
        }
    }
}
