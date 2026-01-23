// ═══════════════════════════════════════════════════════════════
// XLENS SVELTE STORE
// Global reactive store for xLENS state
// ═══════════════════════════════════════════════════════════════

import { getContext, setContext } from 'svelte';
import { XLensWebClient, createXLensWebClient } from '$lib/client/XLensWebClient.svelte';
import type { XLensWebConfig } from '$lib/types';

// ─────────────────────────────────────────────────────────────────
// Context Key
// ─────────────────────────────────────────────────────────────────

const XLENS_CONTEXT_KEY = Symbol('xlens');

// ─────────────────────────────────────────────────────────────────
// Context Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Set xLENS client in Svelte context
 */
export function setXLensClient(client: XLensWebClient): void {
	setContext(XLENS_CONTEXT_KEY, client);
}

/**
 * Get xLENS client from Svelte context
 */
export function getXLensClient(): XLensWebClient {
	const client = getContext<XLensWebClient>(XLENS_CONTEXT_KEY);
	if (!client) {
		throw new Error('xLENS client not found in context. Did you call setXLensClient?');
	}
	return client;
}

/**
 * Initialize and set xLENS client
 */
export function initXLens(config: XLensWebConfig): XLensWebClient {
	const client = createXLensWebClient(config);
	setXLensClient(client);
	return client;
}

// ─────────────────────────────────────────────────────────────────
// Derived State Helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Check if client is ready to capture
 */
export function isReadyToCapture(client: XLensWebClient): boolean {
	return client.state === 'session_ready' && client.session !== null;
}

/**
 * Check if client is currently recording
 */
export function isRecording(client: XLensWebClient): boolean {
	return client.state === 'capturing';
}

/**
 * Check if client is in a busy state
 */
export function isBusy(client: XLensWebClient): boolean {
	return [
		'checking_compatibility',
		'requesting_permissions',
		'preparing_session',
		'capturing',
		'processing',
		'uploading'
	].includes(client.state);
}

/**
 * Get human-readable state label
 */
export function getStateLabel(client: XLensWebClient): string {
	const labels: Record<string, string> = {
		idle: 'Ready',
		checking_compatibility: 'Checking browser...',
		requesting_permissions: 'Requesting permissions...',
		preparing_session: 'Preparing session...',
		session_ready: 'Ready to record',
		capturing: 'Recording...',
		processing: 'Processing...',
		uploading: 'Uploading...',
		submitted: 'Submitted',
		complete: 'Complete',
		error: 'Error',
		unsupported: 'Browser not supported'
	};
	return labels[client.state] || client.state;
}

/**
 * Format recording duration
 */
export function formatDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const tenths = Math.floor((ms % 1000) / 100);
	return `${seconds}.${tenths}s`;
}

/**
 * Format session time remaining
 */
export function formatTimeRemaining(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}
