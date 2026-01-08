// ═══════════════════════════════════════════════════════════
// VOICE SORTING HOOK v2
// Event-driven flow: Wolf speaks → User responds (mic OR button)
// Tap-to-talk UX for clear user control
// ═══════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type TrainingPath = "glass" | "grinder" | "prospect";
export type WolfIdentity = "speed" | "tank" | "air";
export type SortingStep = "idle" | "intro" | "pain" | "volume" | "ambition" | "reveal" | "complete";

export interface SortingResult {
  trainingPath: TrainingPath;
  wolfIdentity: WolfIdentity;
  coachComment: string;
  firstMissionId: string;
}

interface VoiceSortingState {
  step: SortingStep;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;

  // Flow control
  waitingForInput: boolean; // True when wolf finished speaking, awaiting user
  voiceFailures: number; // Track failures per step for progressive fallback

  // Accumulated results
  trainingPath: TrainingPath | null;
  wolfIdentity: WolfIdentity | null;
  painDetected: boolean | null;
  highVolume: boolean | null;

  // Final result
  result: SortingResult | null;
}

// ─────────────────────────────────────────────────────────────
// WOLF SCRIPTS
// ─────────────────────────────────────────────────────────────

const WOLF_SCRIPTS = {
  intro: "Welcome to the Pack. I'm calibrating your system.",

  pain: "Be real with me. Does anything hurt when you play? Knees, ankles, back?",

  volume: "Good. How many teams you on right now? Waking up fresh or feeling heavy?",

  ambition: "Last one. What's stopping you from dominating? Speed, bounce, or strength?",

  painAck: "Copy. Your landing gear needs calibration first.",

  volumeHighAck: "Your engine's redlining. Noted.",

  volumeFreshAck: "System primed. Let's build.",

  reveal: (identity: WolfIdentity) => `You are a ${identity.toUpperCase()} WOLF.`,
};

const COACH_COMMENTS: Record<TrainingPath, Record<WolfIdentity, string>> = {
  glass: {
    speed:
      "Your acceleration system is strong, but your chassis needs calibration first. We're locking in your foundation so you can hit top speed safely.",
    tank: "Your power potential is massive, but your base needs reinforcement. We're fortifying your foundation before we build the engine.",
    air: "You're built to fly, but your landing gear is compromised. We're calibrating your chassis so you can catch bodies without breaking.",
  },
  grinder: {
    speed:
      "Your engine is redlining from too much volume. We're flushing the system so you can unlock your true top speed.",
    tank: "You've been grinding hard. Your system needs a reset. We're optimizing your recovery so you can build real power.",
    air: "Your flight systems are overloaded. We're restoring your elastic energy so you can explode when it counts.",
  },
  prospect: {
    speed:
      "Your system is primed. We're building acceleration mechanics to unlock your speed potential.",
    tank: "Your foundation is solid. We're engineering force production to maximize your power output.",
    air: "Your chassis is ready. We're calibrating your vertical mechanics to unlock your flight ceiling.",
  },
};

const FIRST_MISSIONS: Record<TrainingPath, string> = {
  glass: "mission_ankle_shield",
  grinder: "mission_system_reboot",
  prospect: "mission_flight_calibration",
};

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useVoiceSorting() {
  const [state, setState] = useState<VoiceSortingState>({
    step: "idle",
    isListening: false,
    isSpeaking: false,
    transcript: "",
    error: null,
    waitingForInput: false,
    voiceFailures: 0,
    trainingPath: null,
    wolfIdentity: null,
    painDetected: null,
    highVolume: null,
    result: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const deepgramSocketRef = useRef<WebSocket | null>(null);

  // Store trainingPath in ref for use in callbacks
  const trainingPathRef = useRef<TrainingPath | null>(null);
  useEffect(() => {
    trainingPathRef.current = state.trainingPath;
  }, [state.trainingPath]);

  // ─────────────────────────────────────────────────────────────
  // TTS: Wolf speaks
  // ─────────────────────────────────────────────────────────────

  const speak = useCallback(async (text: string): Promise<void> => {
    setState((s) => ({ ...s, isSpeaking: true, error: null }));

    try {
      const response = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve) => {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setState((s) => ({ ...s, isSpeaking: false }));
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audioRef.current.onerror = () => {
          setState((s) => ({ ...s, isSpeaking: false }));
          URL.revokeObjectURL(audioUrl);
          resolve(); // Resolve anyway so flow continues
        };

        // Handle mobile browsers that may reject play()
        audioRef.current.play().catch((playError) => {
          console.error("[VoiceSorting] Audio play failed:", playError);
          setState((s) => ({ ...s, isSpeaking: false }));
          URL.revokeObjectURL(audioUrl);
          resolve(); // Resolve anyway so flow continues
        });
      });
    } catch (error) {
      setState((s) => ({ ...s, isSpeaking: false, error: String(error) }));
      throw error;
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // STT: Listen to user via Deepgram
  // ─────────────────────────────────────────────────────────────

  const listen = useCallback(async (timeoutMs: number = 8000): Promise<string> => {
    setState((s) => ({ ...s, isListening: true, transcript: "", error: null }));

    return new Promise(async (resolve) => {
      try {
        // Get Deepgram token
        const tokenRes = await fetch("/api/voice/deepgram-token");
        if (!tokenRes.ok) {
          console.log("[VoiceSorting] Deepgram token failed, using button fallback");
          setState((s) => ({ ...s, isListening: false }));
          resolve("");
          return;
        }
        const { token } = await tokenRes.json();

        // Get microphone access - if denied, return empty string for fallback flow
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (_micError) {
          console.log("[VoiceSorting] Mic not available, using button fallback");
          setState((s) => ({ ...s, isListening: false }));
          resolve("");
          return;
        }

        // Connect to Deepgram
        const socket = new WebSocket(
          `wss://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&interim_results=true`,
          ["token", token],
        );

        deepgramSocketRef.current = socket;

        let finalTranscript = "";
        let lastInterimTranscript = ""; // Track interim results as fallback
        let silenceTimeout: NodeJS.Timeout;
        let hardTimeout: NodeJS.Timeout;

        const cleanup = () => {
          clearTimeout(silenceTimeout);
          clearTimeout(hardTimeout);

          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
          }

          stream.getTracks().forEach((track) => track.stop());

          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }

          setState((s) => ({ ...s, isListening: false }));
        };

        socket.onopen = () => {
          // Start recording
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });

          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              socket.send(event.data);
            }
          };

          mediaRecorder.start(250); // Send chunks every 250ms
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.channel?.alternatives?.[0]?.transcript) {
            const transcript = data.channel.alternatives[0].transcript;

            if (data.is_final) {
              finalTranscript += `${transcript} `;
              lastInterimTranscript = ""; // Clear interim since we got final
              setState((s) => ({ ...s, transcript: finalTranscript.trim() }));

              // Reset silence timeout on speech
              clearTimeout(silenceTimeout);
              silenceTimeout = setTimeout(() => {
                // No speech for 2 seconds, consider done
                cleanup();
                resolve(finalTranscript.trim());
              }, 2000);
            } else {
              // Interim result - update UI and track as fallback
              lastInterimTranscript = transcript;
              setState((s) => ({ ...s, transcript: finalTranscript + transcript }));
            }
          }
        };

        socket.onerror = () => {
          cleanup();
          // Use interim transcript as fallback if no final results
          resolve(finalTranscript.trim() || lastInterimTranscript.trim());
        };

        // Hard timeout
        hardTimeout = setTimeout(() => {
          cleanup();
          // Use interim transcript as fallback if no final results
          const result = finalTranscript.trim() || lastInterimTranscript.trim();
          console.log(`[VoiceSorting] Hard timeout - final: "${finalTranscript}", interim: "${lastInterimTranscript}", using: "${result}"`);
          resolve(result);
        }, timeoutMs);
      } catch (error) {
        setState((s) => ({ ...s, isListening: false, error: String(error) }));
        resolve("");
      }
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Classification
  // ─────────────────────────────────────────────────────────────

  const classify = useCallback(
    async (transcript: string, questionType: "pain" | "volume" | "ambition") => {
      const response = await fetch("/api/voice/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, questionType }),
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      return response.json();
    },
    [],
  );

  // ─────────────────────────────────────────────────────────────
  // Flow: Start Sorting (Intro → Pain Question)
  // ─────────────────────────────────────────────────────────────

  const startSorting = useCallback(async () => {
    try {
      setState((s) => ({ ...s, step: "intro", error: null, waitingForInput: false }));

      // INTRO
      await speak(WOLF_SCRIPTS.intro);

      // PAIN CHECK - speak question then wait for input
      setState((s) => ({ ...s, step: "pain" }));
      await speak(WOLF_SCRIPTS.pain);

      // Now waiting for user to tap mic or button
      setState((s) => ({ ...s, waitingForInput: true }));
    } catch (error) {
      console.error("[VoiceSorting] Error:", error);
      setState((s) => ({ ...s, error: String(error) }));
    }
  }, [speak]);

  // ─────────────────────────────────────────────────────────────
  // Voice Answer: User taps mic to answer current question
  // ─────────────────────────────────────────────────────────────

  const answerWithVoice = useCallback(async () => {
    setState((s) => ({ ...s, waitingForInput: false, error: null }));

    try {
      const transcript = await listen(8000);

      if (!transcript) {
        // No voice detected - increment failures and re-enable input
        setState((s) => ({
          ...s,
          waitingForInput: true,
          voiceFailures: s.voiceFailures + 1,
          error: s.voiceFailures >= 1 ? "Having trouble? Just tap a button below." : "No response detected. Try again or tap a button.",
        }));
        return;
      }

      // Process based on current step
      if (state.step === "pain") {
        const result = await classify(transcript, "pain");
        await processPainAnswer(result.painDetected);
      } else if (state.step === "volume") {
        const result = await classify(transcript, "volume");
        await processVolumeAnswer(result.highVolume);
      } else if (state.step === "ambition") {
        const result = await classify(transcript, "ambition");
        await processAmbitionAnswer(result.wolfIdentity as WolfIdentity);
      }
    } catch (error) {
      console.error("[VoiceSorting] Voice answer error:", error);
      setState((s) => ({
        ...s,
        waitingForInput: true,
        voiceFailures: s.voiceFailures + 1,
        error: s.transcript ? `I heard "${s.transcript}". Pick one below.` : "Something went wrong. Tap a button below.",
      }));
    }
  }, [state.step, listen, classify]);

  // ─────────────────────────────────────────────────────────────
  // Process Answers (shared by voice and button)
  // ─────────────────────────────────────────────────────────────

  const processPainAnswer = useCallback(
    async (hasPain: boolean) => {
      setState((s) => ({
        ...s,
        painDetected: hasPain,
        trainingPath: hasPain ? "glass" : null,
        waitingForInput: false,
        voiceFailures: 0, // Reset on step change
        error: null,
      }));

      if (hasPain) {
        // Pain detected → GLASS path, skip volume, go to ambition
        await speak(WOLF_SCRIPTS.painAck);
        setState((s) => ({ ...s, step: "ambition" }));
        await speak(WOLF_SCRIPTS.ambition);
        setState((s) => ({ ...s, waitingForInput: true }));
      } else {
        // No pain → ask volume
        setState((s) => ({ ...s, step: "volume" }));
        await speak(WOLF_SCRIPTS.volume);
        setState((s) => ({ ...s, waitingForInput: true }));
      }
    },
    [speak],
  );

  const processVolumeAnswer = useCallback(
    async (isHighVolume: boolean) => {
      setState((s) => ({
        ...s,
        highVolume: isHighVolume,
        trainingPath: isHighVolume ? "grinder" : "prospect",
        waitingForInput: false,
        voiceFailures: 0, // Reset on step change
        error: null,
      }));

      if (isHighVolume) {
        await speak(WOLF_SCRIPTS.volumeHighAck);
      } else {
        await speak(WOLF_SCRIPTS.volumeFreshAck);
      }

      // Go to ambition
      setState((s) => ({ ...s, step: "ambition" }));
      await speak(WOLF_SCRIPTS.ambition);
      setState((s) => ({ ...s, waitingForInput: true }));
    },
    [speak],
  );

  const processAmbitionAnswer = useCallback(
    async (identity: WolfIdentity) => {
      setState((s) => ({
        ...s,
        wolfIdentity: identity,
        waitingForInput: false,
        error: null,
        step: "reveal",
      }));

      // Dramatic pause
      await new Promise((r) => setTimeout(r, 1000));

      await speak(WOLF_SCRIPTS.reveal(identity));

      // Get final path
      const finalPath = trainingPathRef.current || "prospect";

      const coachComment = COACH_COMMENTS[finalPath][identity];
      await speak(coachComment);

      // Build final result
      const result: SortingResult = {
        trainingPath: finalPath,
        wolfIdentity: identity,
        coachComment,
        firstMissionId: FIRST_MISSIONS[finalPath],
      };

      setState((s) => ({ ...s, step: "complete", result }));
    },
    [speak],
  );

  // ─────────────────────────────────────────────────────────────
  // Button Answers (explicit user choice)
  // ─────────────────────────────────────────────────────────────

  const answerPain = useCallback(
    async (hasPain: boolean) => {
      await processPainAnswer(hasPain);
    },
    [processPainAnswer],
  );

  const answerVolume = useCallback(
    async (isHighVolume: boolean) => {
      await processVolumeAnswer(isHighVolume);
    },
    [processVolumeAnswer],
  );

  const answerAmbition = useCallback(
    async (identity: WolfIdentity) => {
      await processAmbitionAnswer(identity);
    },
    [processAmbitionAnswer],
  );

  // ─────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (deepgramSocketRef.current) {
        deepgramSocketRef.current.close();
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────

  return {
    ...state,
    startSorting,
    answerWithVoice,
    answerPain,
    answerVolume,
    answerAmbition,
    speak,
    listen,
  };
}
