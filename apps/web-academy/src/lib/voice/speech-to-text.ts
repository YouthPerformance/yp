/**
 * Speech-to-Text Service
 *
 * Unified interface for voice transcription with multiple providers:
 * - Groq (fastest, best accuracy)
 * - Deepgram (real-time streaming)
 * - Browser Native (free, offline)
 *
 * For James & Adam's voice editing workflow.
 */

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type STTProvider = "groq" | "deepgram" | "browser";

export interface TranscriptionResult {
  text: string;
  confidence: number;
  duration: number;
  provider: STTProvider;
}

export interface STTConfig {
  provider: STTProvider;
  groqApiKey?: string;
  deepgramApiKey?: string;
  language?: string;
  onInterimResult?: (text: string) => void;
  onFinalResult?: (result: TranscriptionResult) => void;
  onError?: (error: Error) => void;
}

// ─────────────────────────────────────────────────────────────
// GROQ PROVIDER (Fastest + Most Accurate)
// ─────────────────────────────────────────────────────────────

export async function transcribeWithGroq(
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-large-v3");
  formData.append("response_format", "json");

  const startTime = Date.now();

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const duration = (Date.now() - startTime) / 1000;

  return {
    text: data.text,
    confidence: 0.95, // Groq doesn't return confidence, assume high
    duration,
    provider: "groq",
  };
}

// ─────────────────────────────────────────────────────────────
// DEEPGRAM PROVIDER (Real-time Streaming)
// ─────────────────────────────────────────────────────────────

export class DeepgramStream {
  private socket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private onInterim: ((text: string) => void) | null = null;
  private onFinal: ((result: TranscriptionResult) => void) | null = null;
  private startTime: number = 0;
  private fullTranscript: string = "";

  constructor(private apiKey: string) {}

  async start(
    onInterimResult: (text: string) => void,
    onFinalResult: (result: TranscriptionResult) => void
  ): Promise<void> {
    this.onInterim = onInterimResult;
    this.onFinal = onFinalResult;
    this.startTime = Date.now();
    this.fullTranscript = "";

    // Connect to Deepgram WebSocket
    const url = `wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true`;

    this.socket = new WebSocket(url, ["token", this.apiKey]);

    this.socket.onopen = async () => {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(event.data);
        }
      };

      this.mediaRecorder.start(250); // Send chunks every 250ms
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.channel?.alternatives?.[0]?.transcript) {
        const transcript = data.channel.alternatives[0].transcript;
        const isFinal = data.is_final;

        if (isFinal) {
          this.fullTranscript += transcript + " ";
        }

        this.onInterim?.(isFinal ? this.fullTranscript : this.fullTranscript + transcript);
      }
    };

    this.socket.onerror = (error) => {
      console.error("Deepgram error:", error);
    };
  }

  stop(): TranscriptionResult {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.socket) {
      this.socket.close();
    }

    const duration = (Date.now() - this.startTime) / 1000;

    const result: TranscriptionResult = {
      text: this.fullTranscript.trim(),
      confidence: 0.92,
      duration,
      provider: "deepgram",
    };

    this.onFinal?.(result);
    return result;
  }
}

// ─────────────────────────────────────────────────────────────
// BROWSER NATIVE PROVIDER (Free, Offline)
// ─────────────────────────────────────────────────────────────

export class BrowserSpeechRecognition {
  private recognition: SpeechRecognition | null = null;
  private onInterim: ((text: string) => void) | null = null;
  private onFinal: ((result: TranscriptionResult) => void) | null = null;
  private startTime: number = 0;
  private finalTranscript: string = "";

  constructor() {
    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error("Speech recognition not supported in this browser");
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
  }

  start(
    onInterimResult: (text: string) => void,
    onFinalResult: (result: TranscriptionResult) => void
  ): void {
    if (!this.recognition) return;

    this.onInterim = onInterimResult;
    this.onFinal = onFinalResult;
    this.startTime = Date.now();
    this.finalTranscript = "";

    this.recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      this.onInterim?.(this.finalTranscript + interimTranscript);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    this.recognition.start();
  }

  stop(): TranscriptionResult {
    if (this.recognition) {
      this.recognition.stop();
    }

    const duration = (Date.now() - this.startTime) / 1000;

    const result: TranscriptionResult = {
      text: this.finalTranscript.trim(),
      confidence: 0.85, // Browser varies
      duration,
      provider: "browser",
    };

    this.onFinal?.(result);
    return result;
  }
}

// ─────────────────────────────────────────────────────────────
// UNIFIED INTERFACE
// ─────────────────────────────────────────────────────────────

export class VoiceEditor {
  private config: STTConfig;
  private deepgramStream: DeepgramStream | null = null;
  private browserRecognition: BrowserSpeechRecognition | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;

  constructor(config: STTConfig) {
    this.config = config;
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) return;
    this.isRecording = true;

    const { provider, onInterimResult, onFinalResult } = this.config;

    switch (provider) {
      case "groq":
        // For Groq, we record audio and transcribe on stop
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.start();
        break;

      case "deepgram":
        if (!this.config.deepgramApiKey) throw new Error("Deepgram API key required");
        this.deepgramStream = new DeepgramStream(this.config.deepgramApiKey);
        await this.deepgramStream.start(
          onInterimResult || (() => {}),
          onFinalResult || (() => {})
        );
        break;

      case "browser":
        this.browserRecognition = new BrowserSpeechRecognition();
        this.browserRecognition.start(
          onInterimResult || (() => {}),
          onFinalResult || (() => {})
        );
        break;
    }
  }

  async stopRecording(): Promise<TranscriptionResult> {
    if (!this.isRecording) {
      return { text: "", confidence: 0, duration: 0, provider: this.config.provider };
    }
    this.isRecording = false;

    const { provider, onFinalResult } = this.config;

    switch (provider) {
      case "groq":
        if (!this.config.groqApiKey) throw new Error("Groq API key required");

        return new Promise((resolve) => {
          if (!this.mediaRecorder) {
            resolve({ text: "", confidence: 0, duration: 0, provider: "groq" });
            return;
          }

          this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
            const result = await transcribeWithGroq(audioBlob, this.config.groqApiKey!);
            onFinalResult?.(result);
            resolve(result);
          };

          this.mediaRecorder.stop();
          this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        });

      case "deepgram":
        if (this.deepgramStream) {
          return this.deepgramStream.stop();
        }
        break;

      case "browser":
        if (this.browserRecognition) {
          return this.browserRecognition.stop();
        }
        break;
    }

    return { text: "", confidence: 0, duration: 0, provider };
  }

  isActive(): boolean {
    return this.isRecording;
  }
}

// ─────────────────────────────────────────────────────────────
// REACT HOOK
// ─────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";

export function useVoiceEditor(config: STTConfig) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const editorRef = useRef<VoiceEditor | null>(null);

  const startRecording = useCallback(async () => {
    const editor = new VoiceEditor({
      ...config,
      onInterimResult: setTranscript,
      onFinalResult: (result) => {
        setTranscript(result.text);
        setIsProcessing(false);
      },
    });

    editorRef.current = editor;
    await editor.startRecording();
    setIsRecording(true);
    setTranscript("");
  }, [config]);

  const stopRecording = useCallback(async () => {
    if (!editorRef.current) return null;

    setIsRecording(false);
    if (config.provider === "groq") {
      setIsProcessing(true);
    }

    const result = await editorRef.current.stopRecording();
    return result;
  }, [config.provider]);

  const clear = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    clear,
  };
}
