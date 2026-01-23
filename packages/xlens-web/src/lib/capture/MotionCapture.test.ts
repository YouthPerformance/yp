// ═══════════════════════════════════════════════════════════════
// MOTION CAPTURE TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MotionCapture, serializeSamples, createMotionCapture } from './MotionCapture';
import type { IMUSample } from '$lib/types';

describe('MotionCapture', () => {
	beforeEach(() => {
		// Reset window mock
		vi.stubGlobal('window', {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		});
	});

	describe('createMotionCapture', () => {
		it('should create a MotionCapture instance', () => {
			const capture = createMotionCapture();
			expect(capture).toBeInstanceOf(MotionCapture);
		});
	});

	describe('isAvailable', () => {
		it('should return false when DeviceMotionEvent is not available', () => {
			vi.stubGlobal('window', {});
			const capture = new MotionCapture();
			expect(capture.isAvailable()).toBe(false);
		});

		it('should return true when DeviceMotionEvent is available', () => {
			vi.stubGlobal('window', {
				DeviceMotionEvent: class {}
			});
			const capture = new MotionCapture();
			expect(capture.isAvailable()).toBe(true);
		});
	});

	describe('start/stop', () => {
		it('should return empty array when stopped without capturing', () => {
			const capture = new MotionCapture();
			const samples = capture.stop();
			expect(samples).toEqual([]);
		});

		it('should return sample count of 0 when not started', () => {
			const capture = new MotionCapture();
			expect(capture.getSampleCount()).toBe(0);
		});
	});
});

describe('serializeSamples', () => {
	it('should serialize empty array', () => {
		const result = serializeSamples([]);
		expect(result).toBe('[]');
	});

	it('should serialize samples to JSON', () => {
		const samples: IMUSample[] = [
			{
				timestamp: 1234567890,
				accelerationX: 0.1,
				accelerationY: 0.2,
				accelerationZ: 9.8,
				rotationAlpha: 0.01,
				rotationBeta: 0.02,
				rotationGamma: 0.03
			}
		];

		const result = serializeSamples(samples);
		const parsed = JSON.parse(result);

		expect(parsed).toHaveLength(1);
		expect(parsed[0].timestamp).toBe(1234567890);
		expect(parsed[0].accelerationX).toBe(0.1);
	});

	it('should handle null rotation values', () => {
		const samples: IMUSample[] = [
			{
				timestamp: 1234567890,
				accelerationX: 0,
				accelerationY: 0,
				accelerationZ: 0,
				rotationAlpha: null,
				rotationBeta: null,
				rotationGamma: null
			}
		];

		const result = serializeSamples(samples);
		const parsed = JSON.parse(result);

		expect(parsed[0].rotationAlpha).toBeNull();
	});
});
