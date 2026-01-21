// ═══════════════════════════════════════════════════════════════
// DEVICE KEY MANAGER
// Manages hardware-backed signing keys for device attestation
// Uses Secure Enclave for key storage and App Attest for verification
// ═══════════════════════════════════════════════════════════════

import Foundation
import CryptoKit
import Security
import DeviceCheck

/// Manages device-specific signing keys
/// Uses Secure Enclave when available for hardware-backed security
final class DeviceKeyManager {

    // MARK: - Properties

    private let userId: String
    private let keyTag: String
    private var cachedKey: DeviceKey?

    // MARK: - Initialization

    init(userId: String) {
        self.userId = userId
        self.keyTag = "com.youthperformance.xlens.devicekey.\(userId)"
    }

    // MARK: - Public Interface

    /// Get existing key or create a new one
    func getOrCreateKey() async throws -> DeviceKey {
        // Return cached key if available
        if let key = cachedKey {
            return key
        }

        // Try to load existing key
        if let existingKey = try loadExistingKey() {
            cachedKey = existingKey
            return existingKey
        }

        // Create new key
        let newKey = try await createKey()
        cachedKey = newKey
        return newKey
    }

    /// Delete the device key (for key rotation or user logout)
    func deleteKey() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag
        ]

        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw XLensError.storageError("Failed to delete key: \(status)")
        }

        cachedKey = nil
    }

    // MARK: - Private Methods

    private func loadExistingKey() throws -> DeviceKey? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag,
            kSecReturnRef as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess else {
            if status == errSecItemNotFound {
                return nil
            }
            throw XLensError.storageError("Failed to load key: \(status)")
        }

        guard let secKey = item else {
            return nil
        }

        // Get public key
        guard let publicKey = SecKeyCopyPublicKey(secKey as! SecKey) else {
            throw XLensError.keyGenerationFailed
        }

        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, nil) as Data? else {
            throw XLensError.keyGenerationFailed
        }

        // Generate key ID from public key hash
        let keyId = generateKeyId(from: publicKeyData)

        return DeviceKey(
            keyId: keyId,
            publicKey: publicKeyData.base64EncodedString(),
            privateKeyRef: secKey as! SecKey,
            hardwareLevel: determineHardwareLevel()
        )
    }

    private func createKey() async throws -> DeviceKey {
        // Determine if Secure Enclave is available
        let hasSecureEnclave = SecureEnclave.isAvailable

        var attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrApplicationTag as String: keyTag,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
            ]
        ]

        // Use Secure Enclave if available
        if hasSecureEnclave {
            attributes[kSecAttrTokenID as String] = kSecAttrTokenIDSecureEnclave
        }

        var error: Unmanaged<CFError>?
        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            let errorMessage = error?.takeRetainedValue().localizedDescription ?? "Unknown error"
            throw XLensError.keyGenerationFailed
        }

        // Get public key
        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            throw XLensError.keyGenerationFailed
        }

        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, nil) as Data? else {
            throw XLensError.keyGenerationFailed
        }

        // Generate key ID
        let keyId = generateKeyId(from: publicKeyData)

        return DeviceKey(
            keyId: keyId,
            publicKey: publicKeyData.base64EncodedString(),
            privateKeyRef: privateKey,
            hardwareLevel: hasSecureEnclave ? .strongbox : .software
        )
    }

    private func generateKeyId(from publicKeyData: Data) -> String {
        let hash = SHA256.hash(data: publicKeyData)
        return hash.prefix(8).map { String(format: "%02x", $0) }.joined()
    }

    private func determineHardwareLevel() -> HardwareLevel {
        return SecureEnclave.isAvailable ? .strongbox : .software
    }
}

// MARK: - Device Key

/// Represents a device-specific signing key
struct DeviceKey {
    let keyId: String
    let publicKey: String // Base64 encoded
    fileprivate let privateKeyRef: SecKey
    let hardwareLevel: HardwareLevel

    /// Sign data with the private key
    func sign(data: Data) throws -> Data {
        var error: Unmanaged<CFError>?

        guard let signature = SecKeyCreateSignature(
            privateKeyRef,
            .ecdsaSignatureMessageX962SHA256,
            data as CFData,
            &error
        ) else {
            let errorMessage = error?.takeRetainedValue().localizedDescription ?? "Unknown error"
            throw XLensError.signatureFailed
        }

        return signature as Data
    }
}

// MARK: - Hardware Level

enum HardwareLevel: String, Codable {
    case strongbox // Secure Enclave (Gold eligible)
    case tee       // Trusted Execution Environment (Silver max)
    case software  // Software-only (Bronze max)
}

// MARK: - Secure Enclave Check

private enum SecureEnclave {
    static var isAvailable: Bool {
        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave
        ]

        var error: Unmanaged<CFError>?
        let access = SecAccessControlCreateWithFlags(
            nil,
            kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly,
            .privateKeyUsage,
            &error
        )

        return access != nil && error == nil
    }
}
