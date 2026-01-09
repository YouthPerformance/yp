/**
 * useRealtimeVoice - OpenAI Realtime API Voice Hook
 *
 * Handles WebRTC connection for real-time voice conversation with Wolf.
 * ~300ms latency vs ~950ms with modular pipeline.
 *
 * @see /.specify/specs/007-realtime-voice/spec.md
 */

import { useCallback, useEffect, useRef, useState } from "react";

// Types
export interface ClassificationResult {
  training_path: "GLASS" | "GRINDER" | "PROSPECT";
  wolf_identity: "SPEED" | "AIR" | "TANK";
  pain_area?: string;
  volume_level?: "HIGH" | "MEDIUM" | "LOW";
  coach_comment?: string;
}

export interface SessionMetrics {
  session_id: string;
  implementation: "realtime";
  start_time: number;
  end_time?: number;
  latency_samples: number[];
  turn_count: number;
  errors: string[];
  classification?: ClassificationResult;
}

export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "processing"
  | "speaking"
  | "error"
  | "complete";

export interface UseRealtimeVoiceOptions {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onClassification?: (result: ClassificationResult) => void;
  onError?: (error: Error) => void;
  onMetrics?: (metrics: SessionMetrics) => void;
}

export interface UseRealtimeVoiceReturn {
  state: VoiceState;
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  classification: ClassificationResult | null;
  metrics: SessionMetrics | null;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  interrupt: () => void;
}

/**
 * OpenAI Realtime API Voice Hook
 */
export function useRealtimeVoice(options: UseRealtimeVoiceOptions = {}): UseRealtimeVoiceReturn {
  const { onStateChange, onTranscript, onClassification, onError, onMetrics } = options;

  // State
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<SessionMetrics | null>(null);

  // Refs for WebRTC
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const metricsRef = useRef<SessionMetrics | null>(null);
  const lastSpeechEndRef = useRef<number>(0);

  // Update state and notify
  const updateState = useCallback(
    (newState: VoiceState) => {
      setState(newState);
      onStateChange?.(newState);
    },
    [onStateChange],
  );

  // Track latency sample
  const trackLatency = useCallback(() => {
    if (metricsRef.current && lastSpeechEndRef.current > 0) {
      const latency = Date.now() - lastSpeechEndRef.current;
      metricsRef.current.latency_samples.push(latency);
      lastSpeechEndRef.current = 0;
    }
  }, []);

  // Handle data channel messages
  const handleDataChannelMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "session.created":
            console.log("[realtime] Session created:", message.session.id);
            break;

          case "input_audio_buffer.speech_started":
            updateState("listening");
            break;

          case "input_audio_buffer.speech_stopped":
            lastSpeechEndRef.current = Date.now();
            updateState("processing");
            break;

          case "response.audio_transcript.delta":
            // Partial transcript of AI response
            break;

          case "response.audio.delta":
            // AI is speaking
            if (state !== "speaking") {
              trackLatency();
              updateState("speaking");
            }
            break;

          case "response.audio.done":
            updateState("listening");
            if (metricsRef.current) {
              metricsRef.current.turn_count++;
            }
            break;

          case "conversation.item.input_audio_transcription.completed": {
            // User speech transcribed
            const userText = message.transcript;
            setTranscript(userText);
            onTranscript?.(userText, true);
            break;
          }

          case "response.function_call_arguments.done":
            // Classification function called
            if (message.name === "classify_athlete") {
              try {
                const result = JSON.parse(message.arguments) as ClassificationResult;
                setClassification(result);
                onClassification?.(result);

                if (metricsRef.current) {
                  metricsRef.current.classification = result;
                  metricsRef.current.end_time = Date.now();
                }

                // Sorting complete
                updateState("complete");
              } catch (e) {
                console.error("[realtime] Failed to parse classification:", e);
              }
            }
            break;

          case "error": {
            const errorMsg = message.error?.message || "Unknown error";
            console.error("[realtime] API error:", errorMsg);
            const err = new Error(errorMsg);
            setError(err);
            onError?.(err);

            if (metricsRef.current) {
              metricsRef.current.errors.push(errorMsg);
            }

            updateState("error");
            break;
          }

          default:
            // Log unhandled message types for debugging
            if (process.env.NODE_ENV === "development") {
              console.log("[realtime] Unhandled message:", message.type);
            }
        }
      } catch (e) {
        console.error("[realtime] Failed to parse message:", e);
      }
    },
    [state, updateState, trackLatency, onTranscript, onClassification, onError],
  );

  // Connect to Realtime API
  const connect = useCallback(async () => {
    try {
      updateState("connecting");
      setError(null);

      // Initialize metrics
      metricsRef.current = {
        session_id: crypto.randomUUID(),
        implementation: "realtime",
        start_time: Date.now(),
        latency_samples: [],
        turn_count: 0,
        errors: [],
      };
      setMetrics(metricsRef.current);

      // Get ephemeral token
      const tokenResponse = await fetch("/api/voice/realtime-token", {
        method: "POST",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get realtime token");
      }

      const { client_secret } = await tokenResponse.json();

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });
      mediaStreamRef.current = stream;

      // Create peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Add audio track
      const audioTrack = stream.getAudioTracks()[0];
      pc.addTrack(audioTrack, stream);

      // Create audio element for playback
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;

      // Handle incoming audio
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // Create data channel for events
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("[realtime] Data channel open");
        // Send initial response.create to start conversation
        dc.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["text", "audio"],
            },
          }),
        );
      };

      dc.onmessage = handleDataChannelMessage;

      dc.onerror = (event) => {
        console.error("[realtime] Data channel error:", event);
      };

      // Create and set local description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to OpenAI Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client_secret}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        throw new Error(`SDP exchange failed: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      // Connection established
      updateState("listening");
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      console.error("[realtime] Connection error:", error);
      setError(error);
      onError?.(error);

      if (metricsRef.current) {
        metricsRef.current.errors.push(error.message);
      }

      updateState("error");
    }
  }, [updateState, handleDataChannelMessage, onError]);

  // Disconnect
  const disconnect = useCallback(() => {
    // Stop media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Remove audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    // Finalize metrics
    if (metricsRef.current) {
      metricsRef.current.end_time = Date.now();
      onMetrics?.(metricsRef.current);
    }

    updateState("idle");
  }, [updateState, onMetrics]);

  // Interrupt AI speech (barge-in)
  const interrupt = useCallback(() => {
    if (dataChannelRef.current?.readyState === "open") {
      dataChannelRef.current.send(
        JSON.stringify({
          type: "response.cancel",
        }),
      );
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    isConnected: state !== "idle" && state !== "error",
    isSpeaking: state === "speaking",
    isListening: state === "listening",
    transcript,
    classification,
    metrics,
    error,
    connect,
    disconnect,
    interrupt,
  };
}

export default useRealtimeVoice;
