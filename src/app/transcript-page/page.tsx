"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useAssemblyAI } from "@/hooks/useAssemblyAI";
import { Mic, MicOff, Send, RotateCcw, Hash, AlertCircle, LogOut, User, FileText } from "lucide-react";
import { clearMom } from "@/redux/slices/momSessionSlice";

interface AttendanceTranscript {
  [attendeeId: string]: {
    speakerLabel: string | null;
    transcript: string;
    partialTranscript: string;
    summary: string;
  };
}

export default function TranscriptPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mom_code: meetingCode, attendance } = useSelector((state: RootState) => state.momSession);
  const { token } = useSelector((state: RootState) => state.session);
  
  const [activeAttendeeId, setActiveAttendeeId] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [transcripts, setTranscripts] = useState<AttendanceTranscript>({});

  const {
    transcript,
    partialTranscript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error,
    speakerLabel
  } = useAssemblyAI();

  useEffect(() => {
    if (!meetingCode || attendance.length === 0) {
      router.push("/");
    }
  }, [meetingCode, attendance, router]);

  useEffect(() => {
    if (activeAttendeeId && (transcript || partialTranscript)) {
      setTranscripts(prev => ({
        ...prev,
        [activeAttendeeId]: {
          ...prev[activeAttendeeId],
          speakerLabel: speakerLabel,
          transcript: transcript,
          partialTranscript: partialTranscript
        }
      }));
    }
  }, [speakerLabel, transcript, partialTranscript, activeAttendeeId]);

  const handleStartListening = async (attendeeId: string) => {
    resetTranscript();
    setActiveAttendeeId(attendeeId);
    setTranscripts(prev => ({
      ...prev,
      [attendeeId]: {
        speakerLabel: null,
        transcript: "",
        partialTranscript: "",
        summary: prev[attendeeId]?.summary || ""
      }
    }));
    await startListening();
  };

  const handleStopListening = async () => {
    await stopListening();
    if (activeAttendeeId) {
      const currentTranscript = transcripts[activeAttendeeId]?.transcript || "";
      setTranscripts(prev => ({
        ...prev,
        [activeAttendeeId]: {
          speakerLabel: null,
          transcript: currentTranscript,
          partialTranscript: "",
          summary: prev[activeAttendeeId]?.summary || ""
        }
      }));
      
      // Automatically trigger summary if there is content
      if (currentTranscript.trim()) {
        handleSummarize(activeAttendeeId);
      }
    }
  };

  const handleSummarize = async (attendeeId: string) => {
    const transcriptText = transcripts[attendeeId]?.transcript?.trim();
    if (!transcriptText) return;

    setIsSummarizing(true);
    try {
      // 1. Get summary
      const summaryResponse = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText, token }),
      });
      const summaryData = await summaryResponse.json();
      
      if (summaryData.success && summaryData.summary) {
        setTranscripts(prev => ({
          ...prev,
          [attendeeId]: {
            ...prev[attendeeId],
            summary: summaryData.summary
          }
        }));

        // 2. Automatically post to post-transcript with attendance ID
        const postPayload = {
          mom_code: meetingCode,
          attendance_id: attendeeId,
          transcript: transcriptText,
          summary: summaryData.summary,
          token,
        };

        console.log("Auto-posting summary:", postPayload);

        await fetch("/api/post-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload),
        });
      }
    } catch (err) {
      console.error("Failed to summarize or post:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleExit = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi ini? Semua data yang belum disimpan akan hilang.")) {
      dispatch(clearMom());
      router.push("/");
    }
  };

  if (!meetingCode || attendance.length === 0) return null;

  return (
    <main className="flex min-h-screen flex-col bg-base-200">
      <header className="bg-base-100/70 backdrop-blur-md border-b border-base-content/5 px-8 py-5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="badge badge-outline badge-lg py-5 px-6 gap-3 rounded-xl border-2">
              <Hash className="w-4 h-4 text-primary" />
              <span className="font-bold text-base-content tracking-tight">{meetingCode}</span>
            </div>
          </div>
          
          {isListening && activeAttendeeId && (
            <div className="badge badge-error badge-soft py-4 px-6 gap-3 rounded-full animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Recording: {attendance.find(a => a.id === activeAttendeeId)?.name}
              </span>
            </div>
          )}

          <button 
            onClick={handleExit}
            className="btn flex items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 justify-center btn-outline btn-error btn-sm gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sesi
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          {attendance.map((attendee) => {
            const attendeeTranscript = transcripts[attendee.id];
            const isActive = activeAttendeeId === attendee.id && isListening;
            const hasSummary = attendeeTranscript?.summary?.trim();

            return (
              <div 
                key={attendee.id}
                className={`card bg-base-100 shadow-xl border overflow-hidden rounded-2xl transition-all ${
                  isActive ? "border-primary ring-2 ring-primary/20" : "border-base-content/5"
                }`}
              >
                <div className="card-body p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? "bg-primary text-primary-content" : "bg-base-200"
                      }`}>
                        <User className={`w-5 h-5 ${isActive ? "text-primary-content" : "text-base-content/40"}`} />
                      </div>
                      <span className="font-bold text-lg">{attendee.name}</span>
                    </div>
                    
                    {!isListening && (
                      <button
                        onClick={() => handleStartListening(attendee.id)}
                        className="btn bg-white btn-circle p-4 rounded-2xl transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-100 shadow-lg shadow-primary/20"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                    
                    {isActive && activeAttendeeId === attendee.id && (
                      <button
                        onClick={handleStopListening}
                        className="btn btn-error btn-circle shadow-lg shadow-error/20 animate-pulse"
                      >
                        <MicOff className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {isActive && isSummarizing && (
                    <div className="mt-4 flex items-center gap-2 text-primary animate-pulse">
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Sedang merangkum...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="alert alert-error shadow-lg rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-5 h-5 text-error-content" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-error-content">System Error</p>
                <p className="text-sm text-error-content/80">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}