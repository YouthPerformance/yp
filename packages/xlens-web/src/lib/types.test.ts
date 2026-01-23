// ═══════════════════════════════════════════════════════════════
// xLENS WEB SDK - Type Tests
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { XLensError } from './types';

describe('XLensError', () => {
	it('should create an error with code and message', () => {
		const error = new XLensError('CAMERA_PERMISSION_DENIED', 'Camera access denied');

		expect(error.code).toBe('CAMERA_PERMISSION_DENIED');
		expect(error.message).toBe('Camera access denied');
		expect(error.name).toBe('XLensError');
		expect(error.recoverable).toBe(false);
	});

	it('should create a recoverable error', () => {
		const error = new XLensError('NETWORK_ERROR', 'Connection lost', true);

		expect(error.recoverable).toBe(true);
	});

	it('should be instanceof Error', () => {
		const error = new XLensError('UNKNOWN_ERROR', 'Something went wrong');

		expect(error instanceof Error).toBe(true);
		expect(error instanceof XLensError).toBe(true);
	});
});
