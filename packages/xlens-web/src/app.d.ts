// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// WebCodecs API types
	interface VideoEncoder {
		configure(config: VideoEncoderConfig): void;
		encode(frame: VideoFrame, options?: VideoEncoderEncodeOptions): void;
		flush(): Promise<void>;
		close(): void;
		reset(): void;
		readonly state: CodecState;
		readonly encodeQueueSize: number;
	}

	interface VideoEncoderConfig {
		codec: string;
		width: number;
		height: number;
		bitrate: number;
		framerate: number;
		hardwareAcceleration?: 'no-preference' | 'prefer-hardware' | 'prefer-software';
		avc?: { format: 'annexb' | 'avc' };
	}

	interface VideoEncoderEncodeOptions {
		keyFrame?: boolean;
	}

	interface VideoFrame {
		readonly timestamp: number;
		readonly duration: number | null;
		readonly codedWidth: number;
		readonly codedHeight: number;
		close(): void;
	}

	interface EncodedVideoChunk {
		readonly type: 'key' | 'delta';
		readonly timestamp: number;
		readonly duration: number | null;
		readonly byteLength: number;
		copyTo(destination: BufferSource): void;
	}

	type CodecState = 'unconfigured' | 'configured' | 'closed';

	// DeviceMotion extended types
	interface DeviceMotionEventAcceleration {
		x: number | null;
		y: number | null;
		z: number | null;
	}

	interface DeviceMotionEventRotationRate {
		alpha: number | null;
		beta: number | null;
		gamma: number | null;
	}
}

export {};
