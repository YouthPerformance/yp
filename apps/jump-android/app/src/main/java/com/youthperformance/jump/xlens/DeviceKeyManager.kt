// ═══════════════════════════════════════════════════════════════
// DEVICE KEY MANAGER
// Hardware-backed signing keys using Android Keystore/StrongBox
// Layer 1 + 2 of xLENS Three-Layer Defense
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.jump.xlens

import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.PrivateKey
import java.security.SecureRandom
import java.security.Signature
import java.security.spec.ECGenParameterSpec

/**
 * Manages hardware-backed device keys for xLENS verification
 * Uses Android Keystore with StrongBox when available
 */
class DeviceKeyManager {

    companion object {
        private const val TAG = "DeviceKeyManager"
        private const val KEY_ALIAS = "ypjump_xlens_device_key"
        private const val KEYSTORE_PROVIDER = "AndroidKeyStore"
    }

    // State
    private val _deviceKey = MutableStateFlow<DeviceKey?>(null)
    val deviceKey: StateFlow<DeviceKey?> = _deviceKey.asStateFlow()

    private val _isRegistered = MutableStateFlow(false)
    val isRegistered: StateFlow<Boolean> = _isRegistered.asStateFlow()

    private val _error = MutableStateFlow<XLENSError?>(null)
    val error: StateFlow<XLENSError?> = _error.asStateFlow()

    private val keyStore: KeyStore = KeyStore.getInstance(KEYSTORE_PROVIDER).apply {
        load(null)
    }

    /**
     * Generate a new device key using Android Keystore
     * Returns the key ID if successful
     */
    suspend fun generateDeviceKey(): String {
        // Delete any existing key
        deleteExistingKey()

        val keyId = generateKeyId()
        val hardwareLevel = determineHardwareLevel()

        try {
            // Build key generation parameters
            val keyGenBuilder = KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
            )
                .setDigests(KeyProperties.DIGEST_SHA256)
                .setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
                .setUserAuthenticationRequired(false)

            // Try to use StrongBox if available (Android 9+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && hardwareLevel == DeviceKey.HardwareLevel.STRONGBOX) {
                try {
                    keyGenBuilder.setIsStrongBoxBacked(true)
                    Log.i(TAG, "Using StrongBox for key generation")
                } catch (e: Exception) {
                    Log.w(TAG, "StrongBox not available, falling back to TEE")
                }
            }

            val keyGenParameterSpec = keyGenBuilder.build()

            // Generate the key pair
            val keyPairGenerator = KeyPairGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_EC,
                KEYSTORE_PROVIDER
            )
            keyPairGenerator.initialize(keyGenParameterSpec)
            val keyPair = keyPairGenerator.generateKeyPair()

            // Get public key as Base64
            val publicKeyBase64 = Base64.encodeToString(
                keyPair.public.encoded,
                Base64.NO_WRAP
            )

            _deviceKey.value = DeviceKey(
                keyId = keyId,
                publicKey = publicKeyBase64,
                platform = "android",
                deviceModel = "${Build.MANUFACTURER}_${Build.MODEL}",
                osVersion = Build.VERSION.RELEASE,
                hardwareLevel = hardwareLevel
            )

            _isRegistered.value = true

            Log.i(TAG, "✅ Generated device key")
            Log.i(TAG, "   Key ID: $keyId")
            Log.i(TAG, "   Hardware Level: $hardwareLevel")

            return keyId

        } catch (e: Exception) {
            Log.e(TAG, "Failed to generate device key", e)
            _error.value = XLENSError.SignatureFailed
            throw e
        }
    }

    /**
     * Sign data using the device key
     * Returns base64-encoded ES256 signature
     */
    suspend fun sign(data: ByteArray): String {
        try {
            val privateKey = keyStore.getKey(KEY_ALIAS, null) as? PrivateKey
                ?: throw XLENSError.DeviceKeyNotFound

            val signature = Signature.getInstance("SHA256withECDSA")
            signature.initSign(privateKey)
            signature.update(data)

            val signatureBytes = signature.sign()
            return Base64.encodeToString(signatureBytes, Base64.NO_WRAP)

        } catch (e: XLENSError) {
            throw e
        } catch (e: Exception) {
            Log.e(TAG, "Failed to sign data", e)
            throw XLENSError.SignatureFailed
        }
    }

    /**
     * Check if device has a registered key
     */
    fun checkRegistration(): Boolean {
        val hasKey = keyStore.containsAlias(KEY_ALIAS)
        _isRegistered.value = hasKey
        return hasKey
    }

    /**
     * Delete existing device key
     */
    fun deleteExistingKey() {
        if (keyStore.containsAlias(KEY_ALIAS)) {
            keyStore.deleteEntry(KEY_ALIAS)
        }
        _isRegistered.value = false
        _deviceKey.value = null
    }

    /**
     * Determine the hardware security level available
     */
    private fun determineHardwareLevel(): DeviceKey.HardwareLevel {
        return when {
            // Check for StrongBox (Android 9+)
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && hasStrongBox() -> {
                DeviceKey.HardwareLevel.STRONGBOX
            }
            // Check for TEE
            hasTee() -> {
                DeviceKey.HardwareLevel.TEE
            }
            // Software fallback
            else -> {
                DeviceKey.HardwareLevel.SOFTWARE
            }
        }
    }

    private fun hasStrongBox(): Boolean {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                // Try to create a StrongBox-backed key to check availability
                val testAlias = "ypjump_strongbox_test"
                val keyGenParameterSpec = KeyGenParameterSpec.Builder(
                    testAlias,
                    KeyProperties.PURPOSE_SIGN
                )
                    .setDigests(KeyProperties.DIGEST_SHA256)
                    .setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
                    .setIsStrongBoxBacked(true)
                    .build()

                val keyPairGenerator = KeyPairGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_EC,
                    KEYSTORE_PROVIDER
                )
                keyPairGenerator.initialize(keyGenParameterSpec)
                keyPairGenerator.generateKeyPair()

                // Clean up test key
                keyStore.deleteEntry(testAlias)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            false
        }
    }

    private fun hasTee(): Boolean {
        // Most modern Android devices have TEE
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
    }

    private fun generateKeyId(): String {
        val bytes = ByteArray(12)
        SecureRandom().nextBytes(bytes)
        val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP or Base64.URL_SAFE)
            .replace("+", "")
            .replace("/", "")
            .replace("=", "")
        return "dk_$base64"
    }
}
