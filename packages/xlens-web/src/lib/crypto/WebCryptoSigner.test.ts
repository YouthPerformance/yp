// ═══════════════════════════════════════════════════════════════
// WEB CRYPTO SIGNER TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { sha256, sha256String } from './WebCryptoSigner';

describe('WebCryptoSigner', () => {
	describe('sha256', () => {
		it('should hash Uint8Array data', async () => {
			const data = new Uint8Array([1, 2, 3, 4, 5]);
			const hash = await sha256(data);

			expect(hash).toBeDefined();
			expect(typeof hash).toBe('string');
			expect(hash.length).toBe(64); // SHA-256 = 32 bytes = 64 hex chars
		});

		it('should produce consistent hashes', async () => {
			const data = new Uint8Array([1, 2, 3]);
			const hash1 = await sha256(data);
			const hash2 = await sha256(data);

			expect(hash1).toBe(hash2);
		});

		it('should produce different hashes for different data', async () => {
			const data1 = new Uint8Array([1, 2, 3]);
			const data2 = new Uint8Array([4, 5, 6]);

			const hash1 = await sha256(data1);
			const hash2 = await sha256(data2);

			expect(hash1).not.toBe(hash2);
		});
	});

	describe('sha256String', () => {
		it('should hash a string', async () => {
			const hash = await sha256String('hello world');

			expect(hash).toBeDefined();
			expect(hash.length).toBe(64);
		});

		it('should produce consistent hashes', async () => {
			const hash1 = await sha256String('test');
			const hash2 = await sha256String('test');

			expect(hash1).toBe(hash2);
		});

		it('should handle empty string', async () => {
			const hash = await sha256String('');

			expect(hash).toBeDefined();
			expect(hash.length).toBe(64);
		});

		it('should handle unicode', async () => {
			const hash = await sha256String('你好世界 🌍');

			expect(hash).toBeDefined();
			expect(hash.length).toBe(64);
		});
	});
});
