// ═══════════════════════════════════════════════════════════════
// COMPATIBILITY TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDeviceInfo, isIOSSafari, isWeChatBrowser } from './compatibility';

describe('compatibility utils', () => {
	beforeEach(() => {
		// Reset navigator mock
		vi.stubGlobal('navigator', {
			userAgent:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			platform: 'MacIntel'
		});
		vi.stubGlobal('window', {
			screen: { width: 1920, height: 1080 },
			devicePixelRatio: 2,
			VideoEncoder: undefined,
			DeviceMotionEvent: undefined
		});
	});

	describe('getDeviceInfo', () => {
		it('should return device information', () => {
			const info = getDeviceInfo();

			expect(info.userAgent).toContain('Chrome');
			expect(info.platform).toBe('MacIntel');
			expect(info.screenWidth).toBe(1920);
			expect(info.screenHeight).toBe(1080);
			expect(info.devicePixelRatio).toBe(2);
		});

		it('should detect Chrome browser', () => {
			const info = getDeviceInfo();

			expect(info.browserName).toBe('Chrome');
			expect(info.browserVersion).toBe('120');
		});

		it('should detect Safari browser', () => {
			vi.stubGlobal('navigator', {
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
				platform: 'MacIntel'
			});

			const info = getDeviceInfo();
			expect(info.browserName).toBe('Safari');
			expect(info.browserVersion).toBe('17');
		});

		it('should detect Firefox browser', () => {
			vi.stubGlobal('navigator', {
				userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
				platform: 'MacIntel'
			});

			const info = getDeviceInfo();
			expect(info.browserName).toBe('Firefox');
			expect(info.browserVersion).toBe('120');
		});

		it('should detect WebCodecs support', () => {
			vi.stubGlobal('window', {
				screen: { width: 1920, height: 1080 },
				devicePixelRatio: 2,
				VideoEncoder: class {},
				DeviceMotionEvent: undefined
			});

			const info = getDeviceInfo();
			expect(info.supportsWebCodecs).toBe(true);
		});

		it('should detect DeviceMotion support', () => {
			vi.stubGlobal('window', {
				screen: { width: 1920, height: 1080 },
				devicePixelRatio: 2,
				VideoEncoder: undefined,
				DeviceMotionEvent: class {}
			});

			const info = getDeviceInfo();
			expect(info.supportsDeviceMotion).toBe(true);
		});
	});

	describe('isIOSSafari', () => {
		it('should return false for desktop Chrome', () => {
			expect(isIOSSafari()).toBe(false);
		});

		it('should return true for iOS Safari', () => {
			vi.stubGlobal('navigator', {
				userAgent:
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
			});

			expect(isIOSSafari()).toBe(true);
		});

		it('should return false for Chrome on iOS', () => {
			vi.stubGlobal('navigator', {
				userAgent:
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1'
			});

			expect(isIOSSafari()).toBe(false);
		});
	});

	describe('isWeChatBrowser', () => {
		it('should return false for regular browser', () => {
			expect(isWeChatBrowser()).toBe(false);
		});

		it('should return true for WeChat browser', () => {
			vi.stubGlobal('navigator', {
				userAgent:
					'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0'
			});

			expect(isWeChatBrowser()).toBe(true);
		});
	});
});
