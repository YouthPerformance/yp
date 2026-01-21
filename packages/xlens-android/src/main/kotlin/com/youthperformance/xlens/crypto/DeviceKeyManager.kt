// ═══════════════════════════════════════════════════════════════
// DEVICE KEY MANAGER
// Manages hardware-backed signing keys for device attestation
// Uses Android Keystore for key storage and Play Integrity for verification
// ═══════════════════════════════════════════════════════════════

package com.youthperformance.xlens.crypto

import android.content.Context
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyInfo
import android.security.keystore.KeyProperties
import android.util.Base64
import com.youthperformance.xlens.XLensException
import java.security.*
import java.security.spec.ECGenParameterSpec
import javax.crypto.SecretKeyFactory

/**
 * Manages device-specific signing keys
 * Uses Android Keystore with hardware backing when available
 */
internal class DeviceKeyManager(
    private val context: Context,
    private val userId: String
) {
    private val keyAlias = "xlens_device_key_$userId"
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }

    private var cachedKey: DeviceKey? = null

    /**
     * Get existing key or create a new one
     */
    fun getOrCreateKey(): DeviceKey {
        // Return cached key if available
        cachedKey?.let { return it }

        // Try to load existing key
        loadExistingKey()?.let {
            cachedKey = it
            return it
        }

        // Create new key
        val newKey = createKey()
        cachedKey = newKey
        return newKey
    }

    /**
     * Delete the device key (for key rotation or user logout)
     */
    fun deleteKey() {
        if (keyStore.containsAlias(keyAlias)) {
            keyStore.deleteEntry(keyAlias)
        }
        cachedKey = null
    }

    private fun loadExistingKey(): DeviceKey? {
        if (!keyStore.containsAlias(keyAlias)) {
            return null
        }

        return try {
            val privateKeyEntry = keyStore.getEntry(keyAlias, null) as? KeyStore.PrivateKeyEntry
                ?: return null

            val privateKey = privateKeyEntry.privateKey
            val publicKey = privateKeyEntry.certificate.publicKey

            // Get public key bytes
            val publicKeyBytes = publicKey.encoded

            // Generate key ID from public key hash
            val keyId = generateKeyId(publicKeyBytes)

            // Determine hardware level
            val hardwareLevel = determineHardwareLevel(privateKey)

            DeviceKey(
                keyId = keyId,
                publicKey = Base64.encodeToString(publicKeyBytes, Base64.NO_WRAP),
                privateKey = privateKey,
                hardwareLevel = hardwareLevel
            )
        } catch (e: Exception) {
            null
        }
    }

    private fun createKey(): DeviceKey {
        // Determine if StrongBox is available (Android 9+)
        val hasStrongBox = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P &&
                context.packageManager.hasSystemFeature("android.hardware.strongbox_keystore")

        val keyPairGenerator = KeyPairGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_EC,
            "AndroidKeyStore"
        )

        val parameterSpec = KeyGenParameterSpec.Builder(
            keyAlias,
            KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
        ).apply {
            setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
            setDigests(KeyProperties.DIGEST_SHA256)

            // Use StrongBox if available
            if (hasStrongBox && Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                setIsStrongBoxBacked(true)
            }

            // Require user authentication for additional security (optional)
            // setUserAuthenticationRequired(true)
            // setUserAuthenticationValidityDurationSeconds(30)
        }.build()

        try {
            keyPairGenerator.initialize(parameterSpec)
        } catch (e: Exception) {
            // Fallback without StrongBox
            if (hasStrongBox) {
                val fallbackSpec = KeyGenParameterSpec.Builder(
                    keyAlias,
                    KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
                ).apply {
                    setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1"))
                    setDigests(KeyProperties.DIGEST_SHA256)
                }.build()

                keyPairGenerator.initialize(fallbackSpec)
            } else {
                throw XLensException.KeyGenerationFailed
            }
        }

        val keyPair = keyPairGenerator.generateKeyPair()

        // Get public key bytes
        val publicKeyBytes = keyPair.public.encoded

        // Generate key ID
        val keyId = generateKeyId(publicKeyBytes)

        // Determine hardware level
        val hardwareLevel = determineHardwareLevel(keyPair.private)

        return DeviceKey(
            keyId = keyId,
            publicKey = Base64.encodeToString(publicKeyBytes, Base64.NO_WRAP),
            privateKey = keyPair.private,
            hardwareLevel = hardwareLevel
        )
    }

    private fun generateKeyId(publicKeyBytes: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hash = digest.digest(publicKeyBytes)
        return hash.take(8).joinToString("") { "%02x".format(it) }
    }

    private fun determineHardwareLevel(privateKey: PrivateKey): HardwareLevel {
        return try {
            val keyFactory = KeyFactory.getInstance(privateKey.algorithm, "AndroidKeyStore")
            val keyInfo = keyFactory.getKeySpec(privateKey, KeyInfo::class.java)

            when {
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
                        keyInfo.securityLevel == KeyProperties.SECURITY_LEVEL_STRONGBOX -> {
                    HardwareLevel.STRONGBOX
                }
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
                        keyInfo.securityLevel == KeyProperties.SECURITY_LEVEL_TRUSTED_ENVIRONMENT -> {
                    HardwareLevel.TEE
                }
                keyInfo.isInsideSecureHardware -> {
                    HardwareLevel.TEE
                }
                else -> {
                    HardwareLevel.SOFTWARE
                }
            }
        } catch (e: Exception) {
            HardwareLevel.SOFTWARE
        }
    }
}

/**
 * Represents a device-specific signing key
 */
data class DeviceKey(
    val keyId: String,
    val publicKey: String, // Base64 encoded
    internal val privateKey: PrivateKey,
    val hardwareLevel: HardwareLevel
) {
    /**
     * Sign data with the private key
     */
    fun sign(data: ByteArray): ByteArray {
        return try {
            val signature = Signature.getInstance("SHA256withECDSA")
            signature.initSign(privateKey)
            signature.update(data)
            signature.sign()
        } catch (e: Exception) {
            throw XLensException.SignatureFailed
        }
    }
}

enum class HardwareLevel {
    STRONGBOX,  // StrongBox (Gold eligible)
    TEE,        // Trusted Execution Environment (Silver max)
    SOFTWARE    // Software-only (Bronze max)
}
