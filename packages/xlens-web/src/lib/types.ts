// ═══════════════════════════════════════════════════════════════
// xLENS WEB SDK - Type Definitions
// Core types for verified performance capture
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// Capture State Machine
// ─────────────────────────────────────────────────────────────────

export type CaptureState =
	| 'idle'
	| 'checking_compatibility'
	| 'requesting_permissions'
	| 'preparing_session'
	| 'session_ready'
	| 'capturing'
	| 'processing'
	| 'uploading'
	| 'submitted'
	| 'complete'
	| 'error'
	| 'unsupported';

// ─────────────────────────────────────────────────────────────────
// Device & Browser Compatibility
// ─────────────────────────────────────────────────────────────────

export interface DeviceInfo {
	userAgent: string;
	platform: string;
	screenWidth: number;
	screenHeight: number;
	devicePixelRatio: number;
	supportsWebCodecs: boolean;
	supportsDeviceMotion: boolean;
	browserName: string;
	browserVersion: string;
}

export interface CompatibilityResult {
	isCompatible: boolean;
	hasWebCodecs: boolean;
	hasMediaRecorder: boolean;
	hasDeviceMotion: boolean;
	hasCamera: boolean;
	hasMicrophone: boolean;
	warnings: string[];
	errors: string[];
}

// ─────────────────────────────────────────────────────────────────
// Session & Nonce
// ─────────────────────────────────────────────────────────────────

export interface Session {
	id: string;
	nonce: string;
	nonceDisplay: string; // Human-readable: "A7B3X9"
	expiresAt: Date;
	deviceKeyId: string;
}

export interface SessionConfig {
	maxDurationMs: number; // Default: 15000 (15s)
	targetFps: number; // Default: 60
	recordAudio: boolean; // Default: false
}

// ─────────────────────────────────────────────────────────────────
// Capture Results
// ─────────────────────────────────────────────────────────────────

export interface CaptureResult {
	videoData: Uint8Array;
	sensorData: IMUSample[];
	startedAtMs: number;
	endedAtMs: number;
	fps: number;
	frameCount: number;
	videoHash: string;
	sensorHash: string;
}

export interface IMUSample {
	timestamp: number; // Unix timestamp in ms
	accelerationX: number;
	accelerationY: number;
	accelerationZ: number;
	rotationAlpha: number | null;
	rotationBeta: number | null;
	rotationGamma: number | null;
}

// ─────────────────────────────────────────────────────────────────
// Cryptographic Proofs
// ─────────────────────────────────────────────────────────────────

export interface WebProofPayload {
	sessionId: string;
	nonce: string;
	capture: {
		testType: 'VERT_JUMP';
		startedAtMs: number;
		endedAtMs: number;
		fps: number;
		device: DeviceInfo;
	};
	hashes: {
		videoSha256: string;
		sensorSha256: string;
		metadataSha256: string;
	};
	signature: {
		alg: 'ES256';
		keyId: string;
		sig: string;
	};
	sensorsAvailable: boolean;
}

export interface DeviceKey {
	keyId: string;
	publicKey: string; // Base64 encoded SPKI
	privateKey: CryptoKey; // Non-extractable
	createdAt: number;
}

// ─────────────────────────────────────────────────────────────────
// Upload & Submission
// ─────────────────────────────────────────────────────────────────

export interface UploadProgress {
	phase: 'video' | 'sensor' | 'proof';
	bytesUploaded: number;
	bytesTotal: number;
	percentage: number;
}

export interface SubmissionResult {
	jumpId: string;
	status: JumpStatus;
	verificationTier: VerificationTier;
	message?: string;
}

export type JumpStatus =
	| 'uploading'
	| 'processing'
	| 'complete'
	| 'flagged'
	| 'challenged'
	| 'rejected';

export type VerificationTier =
	| 'measured' // Basic capture, no crypto
	| 'bronze' // Valid crypto + nonce
	| 'silver' // + Device attestation (max for web)
	| 'gold' // + Hardware attestation (native only)
	| 'rejected';

// ─────────────────────────────────────────────────────────────────
// Jump Result
// ─────────────────────────────────────────────────────────────────

export interface JumpResult {
	jumpId: string;
	userId: string;
	status: JumpStatus;
	verificationTier: VerificationTier;
	height?: {
		inches: number;
		centimeters: number;
	};
	videoUrl?: string;
	thumbnailUrl?: string;
	processedAt?: Date;
	flags?: string[];
}

// ─────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────

export class XLensError extends Error {
	constructor(
		public code: XLensErrorCode,
		message: string,
		public recoverable: boolean = false
	) {
		super(message);
		this.name = 'XLensError';
	}
}

export type XLensErrorCode =
	| 'UNSUPPORTED_BROWSER'
	| 'CAMERA_PERMISSION_DENIED'
	| 'MOTION_PERMISSION_DENIED'
	| 'SESSION_EXPIRED'
	| 'SESSION_CREATE_FAILED'
	| 'CAPTURE_FAILED'
	| 'ENCODING_FAILED'
	| 'UPLOAD_FAILED'
	| 'NETWORK_ERROR'
	| 'KEY_GENERATION_FAILED'
	| 'SIGNING_FAILED'
	| 'UNKNOWN_ERROR';

// ─────────────────────────────────────────────────────────────────
// Client Configuration
// ─────────────────────────────────────────────────────────────────

export interface XLensWebConfig {
	convexUrl: string;
	userId: string;
	cloudflareAccountId?: string;
	onStateChange?: (state: CaptureState) => void;
	onProgress?: (progress: UploadProgress) => void;
	onError?: (error: XLensError) => void;
}
