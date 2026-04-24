"use client";

import { useState, useRef } from "react";
import type RecordRTC from "recordrtc";
import type { StreamingTranscriber } from "assemblyai";

interface UseAssemblyAIReturn {
  transcript: string;
  partialTranscript: string;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  resetTranscript: () => void;
  error: string | null;
}

export function useAssemblyAI(): UseAssemblyAIReturn {
  const [transcript, setTranscript] = useState("");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const transcriberRef = useRef<StreamingTranscriber | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);

  const startListening = async () => {
    try {
      setError(null);
      
      // Dynamic imports to prevent SSR issues
      const [RecordRTCModule, AssemblyAIModule] = await Promise.all([
        import("recordrtc"),
        import("assemblyai"),
      ]);
      
      const RecordRTC = RecordRTCModule.default;
      const { StreamingTranscriber } = AssemblyAIModule;

      const tokenResponse = await fetch("/api/get-token");
      const { token } = await tokenResponse.json();

      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      // Initialize AssemblyAI Streaming Transcriber with SDK as requested
      const transcriber = new StreamingTranscriber({
        token: token,
        sampleRate: 16000,
        // @ts-ignore - speechModel is used to specify whisper-rt
        speechModel: "whisper-rt",
        
      });

      transcriberRef.current = transcriber;

      // Listen for both 'turn' and 'transcript' events to be safe
      // @ts-ignore
      transcriber.on("turn", (message: any) => {
        console.log("Streaming turn:", message);
        if (message.utterance && message.language_code == "id") {
          setTranscript((prev) => prev + " " + message.utterance);
          setPartialTranscript("");
        }
      });

      // @ts-ignore
      transcriber.on("transcript", (message: any) => {
        console.log("Streaming transcript:", message);
        if (message.utterance) {
          if (message.message_type === "PartialTranscript") {
            setPartialTranscript(message.utterance);
          } else {
            setTranscript((prev) => prev + " " + message.utterance);
            setPartialTranscript("");
          }
        }
      });

      // Add a generic open listener to verify connection
      // @ts-ignore
      transcriber.on("open", (message: any) => {
        console.log("Streaming connection opened:", message);
      });

      // @ts-ignore
      transcriber.on("begin", (message: any) => {
        console.log("Streaming session began:", message);
      });

      transcriber.on("error", (err: Error) => {
        console.error("Transcriber error:", err);
        setError("Connection error. Please check your internet.");
        stopListening();
      });

      // @ts-ignore - 'close' might have different arguments in types
      transcriber.on("close", () => {
        setIsListening(false);
      });

      await transcriber.connect();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new RecordRTC(stream, {
        type: "audio",
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: "audio/wav",
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        // bufferSize: 16384, // Increased buffer size for better stability
        ondataavailable: async (blob: Blob) => {
          if (transcriberRef.current) {
            const buffer = await blob.arrayBuffer();
            if (buffer.byteLength > 44) {
              const pcmData = buffer.slice(44);
              // console.log(`Sending audio chunk: ${pcmData.byteLength} bytes`);
              transcriberRef.current.sendAudio(pcmData);
            }
          }
        },
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsListening(true);

    } catch (err: any) {
      console.error("Error starting transcription:", err);
      setError(err.message || "Could not access microphone");
    }
  };

  const stopListening = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording();
      recorderRef.current = null;
    }

    if (transcriberRef.current) {
      await transcriberRef.current.close();
      transcriberRef.current = null;
    }

    setIsListening(false);
    setPartialTranscript("");
  };

  const resetTranscript = () => {
    setTranscript("");
    setPartialTranscript("");
  };

  return {
    transcript,
    partialTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
