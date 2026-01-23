// ═══════════════════════════════════════════════════════════════
// PROOF GENERATOR
// Creates cryptographic proofs for jump verification
// ═══════════════════════════════════════════════════════════════

import type { WebProofPayload, DeviceKey, CaptureResult, Session, DeviceInfo } from '$lib/types';
import { sha256, sha256String, signPayload } from './WebCryptoSigner';
import { serializeSamples } from '$lib/capture/MotionCapture';
import { getDeviceInfo } from '$lib/utils/compatibility';

// ─────────────────────────────────────────────────────────────────
// Proof Generation
// ─────────────────────────────────────────────────────────────────

/**
 * Generate a complete proof payload for a jump capture
 */
export async function generateProof(
	session: Session,
	capture: CaptureResult,
	deviceKey: DeviceKey
): Promise<WebProofPayload> {
	const deviceInfo = getDeviceInfo();

	// Compute hashes
	const videoHash = await sha256(capture.videoData);
	const sensorJson = serializeSamples(capture.sensorData);
	const sensorHash = await sha256String(sensorJson);

	// Create metadata object for hashing
	const metadata = {
		sessionId: session.id,
		nonce: session.nonce,
		startedAtMs: capture.startedAtMs,
		endedAtMs: capture.endedAtMs,
		fps: capture.fps,
		device: deviceInfo
	};
	const metadataHash = await sha256String(JSON.stringify(metadata));

	// Create signature payload (concatenated hashes)
	const signaturePayload = `${session.nonce}:${videoHash}:${sensorHash}:${metadataHash}`;
	const signature = await signPayload(deviceKey, signaturePayload);

	const proof: WebProofPayload = {
		sessionId: session.id,
		nonce: session.nonce,
		capture: {
			testType: 'VERT_JUMP',
			startedAtMs: capture.startedAtMs,
			endedAtMs: capture.endedAtMs,
			fps: capture.fps,
			device: deviceInfo
		},
		hashes: {
			videoSha256: videoHash,
			sensorSha256: sensorHash,
			metadataSha256: metadataHash
		},
		signature: {
			alg: 'ES256',
			keyId: deviceKey.keyId,
			sig: signature
		},
		sensorsAvailable: capture.sensorData.length > 0
	};

	return proof;
}

/**
 * Verify proof hashes match capture data (client-side validation)
 */
export async function verifyProofHashes(
	proof: WebProofPayload,
	capture: CaptureResult
): Promise<boolean> {
	const videoHash = await sha256(capture.videoData);
	const sensorJson = serializeSamples(capture.sensorData);
	const sensorHash = await sha256String(sensorJson);

	return proof.hashes.videoSha256 === videoHash && proof.hashes.sensorSha256 === sensorHash;
}
