// ═══════════════════════════════════════════════════════════════
// XLENS STORE TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { formatDuration, formatTimeRemaining } from './xlens.svelte';

describe('xlens store helpers', () => {
	describe('formatDuration', () => {
		it('should format 0ms', () => {
			expect(formatDuration(0)).toBe('0.0s');
		});

		it('should format milliseconds to seconds with tenths', () => {
			expect(formatDuration(1500)).toBe('1.5s');
			expect(formatDuration(2300)).toBe('2.3s');
			expect(formatDuration(10000)).toBe('10.0s');
		});

		it('should handle partial seconds', () => {
			expect(formatDuration(500)).toBe('0.5s');
			expect(formatDuration(100)).toBe('0.1s');
			expect(formatDuration(50)).toBe('0.0s');
		});
	});

	describe('formatTimeRemaining', () => {
		it('should format 0 seconds', () => {
			expect(formatTimeRemaining(0)).toBe('0:00');
		});

		it('should format seconds under a minute', () => {
			expect(formatTimeRemaining(30)).toBe('0:30');
			expect(formatTimeRemaining(5)).toBe('0:05');
			expect(formatTimeRemaining(59)).toBe('0:59');
		});

		it('should format minutes and seconds', () => {
			expect(formatTimeRemaining(60)).toBe('1:00');
			expect(formatTimeRemaining(90)).toBe('1:30');
			expect(formatTimeRemaining(120)).toBe('2:00');
			expect(formatTimeRemaining(125)).toBe('2:05');
		});
	});
});
