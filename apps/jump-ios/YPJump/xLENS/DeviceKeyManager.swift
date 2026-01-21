// ═══════════════════════════════════════════════════════════════
// DEVICE KEY MANAGER
// Hardware-backed signing keys using Secure Enclave
// Layer 1 + 2 of xLENS Three-Layer Defense
// ═══════════════════════════════════════════════════════════════

import Foundation
import Security
import CryptoKit

/// Manages hardware-backed device keys for xLENS verification
/// Uses iOS Secure Enclave for tamper-resistant key storage
@MainActor
final class DeviceKeyManager: ObservableObject {

    // MARK: - Published State

    @Published private(set) var deviceKey: DeviceKey?
    @Published private(set) var isRegistered = false
    @Published private(set) var error: XLENSError?

    // MARK: - Private Properties

    private let keyTag = "com.ypjump.xlens.devicekey"
    private let keychainService = "YPJumpXLENS"

    // MARK: - Key Generation

    /// Generate a new device key using Secure Enclave
    /// Returns the key ID if successful
    func generateDeviceKey() async throws -> String {
        // Delete any existing key
        deleteExistingKey()

        // Create key with Secure Enclave protection
        let access = SecAccessControlCreateWithFlags(
            kCFAllocatorDefault,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            [.privateKeyUsage],
            nil
        )!

        var attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!,
                kSecAttrAccessControl as String: access
            ]
        ]

        var error: Unmanaged<CFError>?
        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            // Fallback to software key if Secure Enclave not available (e.g., simulator)
            print("⚠️ DeviceKeyManager: Secure Enclave not available, using software key")
            return try generateSoftwareKey()
        }

        // Get public key
        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            throw XLENSError.signatureFailed
        }

        // Export public key as raw data
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, nil) as Data? else {
            throw XLENSError.signatureFailed
        }

        let keyId = generateKeyId()
        let publicKeyBase64 = publicKeyData.base64EncodedString()

        deviceKey = DeviceKey(
            keyId: keyId,
            publicKey: publicKeyBase64,
            platform: "ios",
            deviceModel: deviceModel,
            osVersion: osVersion,
            hardwareLevel: .strongbox
        )

        isRegistered = true

        print("✅ DeviceKeyManager: Generated Secure Enclave key")
        print("   Key ID: \(keyId)")

        return keyId
    }

    /// Fallback: Generate software-only key (for simulator)
    private func generateSoftwareKey() throws -> String {
        let privateKey = P256.Signing.PrivateKey()
        let publicKeyData = privateKey.publicKey.rawRepresentation

        // Store in keychain
        let keyId = generateKeyId()

        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!,
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecValueData as String: privateKey.rawRepresentation,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]

        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw XLENSError.signatureFailed
        }

        deviceKey = DeviceKey(
            keyId: keyId,
            publicKey: publicKeyData.base64EncodedString(),
            platform: "ios",
            deviceModel: deviceModel,
            osVersion: osVersion,
            hardwareLevel: .software
        )

        isRegistered = true

        print("✅ DeviceKeyManager: Generated software key (Secure Enclave not available)")
        print("   Key ID: \(keyId)")

        return keyId
    }

    // MARK: - Signing

    /// Sign data using the device key
    /// Returns base64-encoded ES256 signature
    func sign(data: Data) async throws -> String {
        // Try Secure Enclave key first
        if let signature = try? signWithSecureEnclave(data: data) {
            return signature
        }

        // Fallback to software key
        return try signWithSoftwareKey(data: data)
    }

    private func signWithSecureEnclave(data: Data) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!,
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecReturnRef as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess, let privateKey = item else {
            throw XLENSError.deviceKeyNotFound
        }

        let key = privateKey as! SecKey

        var error: Unmanaged<CFError>?
        guard let signature = SecKeyCreateSignature(
            key,
            .ecdsaSignatureMessageX962SHA256,
            data as CFData,
            &error
        ) as Data? else {
            throw XLENSError.signatureFailed
        }

        return signature.base64EncodedString()
    }

    private func signWithSoftwareKey(data: Data) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!,
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecReturnData as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess, let keyData = item as? Data else {
            throw XLENSError.deviceKeyNotFound
        }

        let privateKey = try P256.Signing.PrivateKey(rawRepresentation: keyData)
        let signature = try privateKey.signature(for: data)

        return signature.rawRepresentation.base64EncodedString()
    }

    // MARK: - Key Management

    /// Check if device has a registered key
    func checkRegistration() -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!,
            kSecReturnRef as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        isRegistered = status == errSecSuccess
        return isRegistered
    }

    /// Delete existing device key
    func deleteExistingKey() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag.data(using: .utf8)!
        ]

        SecItemDelete(query as CFDictionary)
        isRegistered = false
        deviceKey = nil
    }

    /// Load stored key ID from keychain
    func loadStoredKeyId() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: "keyId",
            kSecReturnData as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess, let data = item as? Data else {
            return nil
        }

        return String(data: data, encoding: .utf8)
    }

    /// Store key ID in keychain
    private func storeKeyId(_ keyId: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: "keyId",
            kSecValueData as String: keyId.data(using: .utf8)!
        ]

        // Delete existing
        SecItemDelete(query as CFDictionary)

        // Add new
        SecItemAdd(query as CFDictionary, nil)
    }

    // MARK: - Helpers

    private func generateKeyId() -> String {
        var bytes = [UInt8](repeating: 0, count: 12)
        _ = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        let base64 = Data(bytes).base64EncodedString()
            .replacingOccurrences(of: "+", with: "")
            .replacingOccurrences(of: "/", with: "")
            .replacingOccurrences(of: "=", with: "")
        return "dk_\(base64)"
    }

    private var deviceModel: String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8, value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value)))
        }
        return identifier
    }

    private var osVersion: String {
        "\(ProcessInfo.processInfo.operatingSystemVersion.majorVersion).\(ProcessInfo.processInfo.operatingSystemVersion.minorVersion).\(ProcessInfo.processInfo.operatingSystemVersion.patchVersion)"
    }
}
