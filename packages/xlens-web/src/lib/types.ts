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
	| 'failed'
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
	userId?: string; // Optional - auto-generates anonymous ID if not provided
	cloudflareAccountId?: string;
	onStateChange?: (state: CaptureState) => void;
	onProgress?: (progress: UploadProgress) => void;
	onError?: (error: XLensError) => void;
}

// ─────────────────────────────────────────────────────────────────
// User Calibration Data
// For accurate height measurement using visual reference method
// ─────────────────────────────────────────────────────────────────

export interface UserCalibration {
	heightInches: number; // User's standing height in inches
	heightFeet: number; // Feet component (for UI display)
	heightInchesRemainder: number; // Inches component (for UI display)
	armSpanInches?: number; // Optional: arm span for additional reference
	cameraDistanceFeet: number; // Recommended 8-10 feet
	cameraHeightPosition: 'floor' | 'hip' | 'tripod'; // Where camera is placed
}

export interface SetupGuidance {
	distanceRecommendation: string; // "Place your phone 8-10 feet away"
	orientationRecommendation: string; // "Landscape mode, camera at hip height"
	lightingRecommendation: string; // "Ensure good lighting, avoid backlight"
	positioningRecommendation: string; // "Stand in center of frame"
	surfaceRecommendation: string; // "Jump on flat, non-slip surface"
}

export const DEFAULT_SETUP_GUIDANCE: SetupGuidance = {
	distanceRecommendation: "Place your phone 5-6 feet away - just far enough to see your full body",
	orientationRecommendation: "Landscape mode, prop phone at hip height (use a chair or stack books)",
	lightingRecommendation: "Face a window or light source - avoid backlight",
	positioningRecommendation: "Full body in frame with some headroom for the jump",
	surfaceRecommendation: "Flat, non-slip surface"
};

// Height conversion utilities
export function feetInchesToTotalInches(feet: number, inches: number): number {
	return feet * 12 + inches;
}

export function totalInchesToFeetInches(totalInches: number): { feet: number; inches: number } {
	const feet = Math.floor(totalInches / 12);
	const inches = Math.round(totalInches % 12);
	return { feet, inches };
}

export function inchesToCm(inches: number): number {
	return Math.round(inches * 2.54 * 10) / 10;
}

export function cmToInches(cm: number): number {
	return Math.round((cm / 2.54) * 10) / 10;
}
