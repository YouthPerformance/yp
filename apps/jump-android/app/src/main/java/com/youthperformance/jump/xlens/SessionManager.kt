// ═══════════════════════════════════════════════════════════════
// SESSION MANAGER
// Manages xLENS sessions and nonce lifecycle
// Handles challenge-response for anti-replay protection
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.security.SecureRandom
import java.util.Base64
import java.util.UUID

/**
 * Manages xLENS session lifecycle
 * - Fetches session nonces from server
 * - Tracks session expiry
 * - Provides nonce for video overlay
 */
class SessionManager {

    companion object {
        private const val TAG = "SessionManager"
        private const val SESSION_DURATION_MS = 120_000L // 120 seconds
        private const val EXPIRY_BUFFER_SECONDS = 30
    }

    // State
    private val _currentSession = MutableStateFlow<XLENSSession?>(null)
    val currentSession: StateFlow<XLENSSession?> = _currentSession.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<XLENSError?>(null)
    val error: StateFlow<XLENSError?> = _error.asStateFlow()

    private val _timeRemaining = MutableStateFlow(0)
    val timeRemaining: StateFlow<Int> = _timeRemaining.asStateFlow()

    // Timer job
    private var timerJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Default)

    // Computed properties
    val nonceDisplay: String
        get() = _currentSession.value?.nonceDisplay ?: "--------"

    val hasValidSession: Boolean
        get() = _currentSession.value?.let { !it.isExpired } ?: false

    val secondsUntilExpiry: Int
        get() = _currentSession.value?.secondsRemaining ?: 0

    /**
     * Fetch a new session from the server
     */
    suspend fun fetchSession(userId: String) {
        _isLoading.value = true
        _error.value = null

        try {
            // TODO: Replace with actual Convex API call
            // val session = convexClient.mutation("jump/sessions:create", mapOf("userId" to userId))

            // Mock session for development
            val session = mockCreateSession()

            _currentSession.value = session
            startExpiryTimer()

            Log.i(TAG, "✅ New session created")
            Log.i(TAG, "   Session ID: ${session.sessionId}")
            Log.i(TAG, "   Nonce Display: ${session.nonceDisplay}")
            Log.i(TAG, "   Expires in: ${session.expiresInMs / 1000}s")

        } catch (e: Exception) {
            _error.value = XLENSError.NetworkError(e)
            Log.e(TAG, "Failed to create session", e)
        }

        _isLoading.value = false
    }

    /**
     * Refresh session if it's close to expiring
     */
    suspend fun refreshIfNeeded(userId: String) {
        if (_currentSession.value == null) {
            fetchSession(userId)
            return
        }

        if (secondsUntilExpiry < EXPIRY_BUFFER_SECONDS) {
            fetchSession(userId)
        }
    }

    /**
     * Validate that the current session matches the provided nonce
     */
    fun validateNonce(nonce: String): Boolean {
        val session = _currentSession.value ?: return false
        return session.nonce == nonce && !session.isExpired
    }

    /**
     * Clear the current session
     */
    fun clearSession() {
        _currentSession.value = null
        stopExpiryTimer()
    }

    // Timer management
    private fun startExpiryTimer() {
        stopExpiryTimer()

        timerJob = scope.launch {
            while (true) {
                _timeRemaining.value = secondsUntilExpiry

                if (_timeRemaining.value <= 0) {
                    handleExpiry()
                    break
                }

                delay(1000)
            }
        }
    }

    private fun stopExpiryTimer() {
        timerJob?.cancel()
        timerJob = null
    }

    private fun handleExpiry() {
        Log.w(TAG, "Session expired")
        _error.value = XLENSError.SessionExpired
        clearSession()
    }

    // Mock implementation
    private fun mockCreateSession(): XLENSSession {
        val now = System.currentTimeMillis()
        val expiresAt = now + SESSION_DURATION_MS

        // Generate random nonce display (6-8 alphanumeric chars)
        val chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        val nonceDisplay = (1..8).map { chars.random() }.joinToString("")

        // Generate random nonce (base64)
        val bytes = ByteArray(16)
        SecureRandom().nextBytes(bytes)
        val nonce = Base64.getEncoder().encodeToString(bytes)

        return XLENSSession(
            sessionId = "session_${UUID.randomUUID().toString().take(8)}",
            nonce = nonce,
            nonceDisplay = nonceDisplay,
            expiresAt = expiresAt,
            expiresInMs = SESSION_DURATION_MS.toInt()
        )
    }

    /**
     * Format time remaining as string
     */
    fun timeRemainingFormatted(): String {
        val remaining = _timeRemaining.value
        val minutes = remaining / 60
        val seconds = remaining % 60

        return if (minutes > 0) {
            "$minutes:${seconds.toString().padStart(2, '0')}"
        } else {
            "${seconds}s"
        }
    }
}
