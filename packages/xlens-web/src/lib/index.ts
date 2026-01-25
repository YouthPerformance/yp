// ═══════════════════════════════════════════════════════════════
// xLENS Web SDK
// Verified Athletic Performance Capture for Web
// ═══════════════════════════════════════════════════════════════

// Main Client
export { XLensWebClient, createXLensWebClient } from './client/XLensWebClient.svelte';

// Types
export type {
	CaptureState,
	DeviceInfo,
	CompatibilityResult,
	Session,
	SessionConfig,
	CaptureResult,
	IMUSample,
	WebProofPayload,
	DeviceKey,
	UploadProgress,
	SubmissionResult,
	JumpStatus,
	VerificationTier,
	JumpResult,
	XLensErrorCode,
	XLensWebConfig,
	UserCalibration,
	SetupGuidance
} from './types';

export {
	XLensError,
	DEFAULT_SETUP_GUIDANCE,
	feetInchesToTotalInches,
	totalInchesToFeetInches,
	inchesToCm,
	cmToInches
} from './types';

// Stores
export {
	setXLensClient,
	getXLensClient,
	initXLens,
	isReadyToCapture,
	isRecording,
	isBusy,
	getStateLabel,
	formatDuration,
	formatTimeRemaining
} from './stores/xlens.svelte';

// Capture Components
export { CameraManager, createCameraManager } from './capture/CameraManager.svelte';
export { MotionCapture, createMotionCapture, serializeSamples } from './capture/MotionCapture';
export { WebCodecsEncoder, createWebCodecsEncoder } from './capture/WebCodecsEncoder';
export {
	MediaRecorderFallback,
	createMediaRecorderFallback
} from './capture/MediaRecorderFallback';

// Crypto
export { generateKeyPair, getOrCreateKey, storeKey, deleteKey } from './crypto/KeyStorage';
export { signData, signPayload, sha256, sha256String } from './crypto/WebCryptoSigner';
export { generateProof, verifyProofHashes } from './crypto/ProofGenerator';

// Upload
export { TusUploader, SimpleFetchUploader, createTusUploader } from './upload/TusUploader';

// Utils
export {
	checkCompatibility,
	getDeviceInfo,
	requestMotionPermission,
	isIOSSafari,
	isWeChatBrowser
} from './utils/compatibility';

// Components
// TODO: Re-enable after fixing Svelte 5 type issues
// export { default as CalibrationFrame } from './components/CalibrationFrame.svelte';
// export type { CalibrationState, CalibrationData, BodyBounds } from './components/calibration-types';
