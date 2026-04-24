"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearSession } from "@/redux/slices/sessionSlice";
import { useAssemblyAI } from "@/hooks/useAssemblyAI";
import { Mic, MicOff, Send, RotateCcw, Building2, Hash, AlertCircle, LogOut, User } from "lucide-react";

export default function TranscriptPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mom_code: meetingCode, floor } = useSelector((state: RootState) => state.session);
  const { 
    transcript, 
    partialTranscript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    error 
  } = useAssemblyAI();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Redirect if no meeting data
  useEffect(() => {
    if (!meetingCode || !floor) {
      router.push("/");
    }
  }, [meetingCode, floor, router]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, partialTranscript]);

  const handleStart = async () => {
    await startListening();
    setHasStarted(true);
  };

  const handleExit = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sesi ini? Semua data yang belum disimpan akan hilang.")) {
      dispatch(clearSession());
      resetTranscript();
      router.push("/");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mocking API call
    try {
      const payload = {
        mom_code: meetingCode,
        floor: floor,
        transcript: transcript.trim(),
      };
      
      console.log("Submitting payload:", payload);

      // Call the API endpoint
      const response = await fetch("/api/post-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      console.log(data)
      if (data.success) {
        alert("Transcript submitted successfully!");
        dispatch(clearSession());
        resetTranscript();
        router.push("/");
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Failed to submit transcript. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!meetingCode || !floor) return null;

  return (
    <main className="flex min-h-screen flex-col bg-base-200">
      {/* Header */}
      <header className="bg-base-100/70 backdrop-blur-md border-b border-base-content/5 px-8 py-5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="badge badge-outline badge-lg py-5 px-6 gap-3 rounded-xl border-2">
              <Hash className="w-4 h-4 text-primary" />
              <span className="font-bold text-base-content tracking-tight">{meetingCode}</span>
            </div>
            <div className="badge badge-outline badge-lg py-5 px-6 gap-3 rounded-xl border-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-base-content font-medium">{floor}</span>
            </div>
          </div>
          
          {isListening && (
            <div className="badge badge-error badge-soft py-4 px-6 gap-3 rounded-full animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">Live Recording</span>
            </div>
          )}

          <button 
            onClick={handleExit}
            className="btn flex items-center justify-center btn-outline btn-error btn-sm gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar Sesi
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col gap-10">
        {/* Transcript Area */}
        <div className="card bg-base-100 shadow-2xl border border-base-content/5 flex flex-col overflow-hidden min-h-[550px] relative rounded-[3rem]">
          <div className="card-body p-0 flex flex-col h-full">
            <div className="px-10 py-8 border-b border-base-content/5 flex justify-between items-center bg-base-200/30">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--p),0.5)]" />
                <h2 className="font-black text-base-content/40 uppercase tracking-[0.2em] text-xs">Transcription Engine</h2>
              </div>
              {transcript && (
                <button 
                  onClick={resetTranscript}
                  className="btn btn-ghost btn-circle text-base-content/40 hover:text-error hover:bg-error/10 group"
                  title="Hapus transkrip"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                </button>
              )}
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 p-10 overflow-y-auto space-y-8 scroll-smooth"
            >
              {transcript === "" && partialTranscript === "" && !isListening && (
                <div className="h-full flex flex-col items-center justify-center text-base-content/20 gap-6">
                  <div className="w-24 h-24 bg-base-200 rounded-[2rem] flex items-center justify-center border border-base-content/5">
                    <Mic className="w-10 h-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base-content/40 text-lg">Siap untuk memulai?</p>
                    <p className="text-sm">Klik tombol di bawah untuk transkripsi otomatis.</p>
                  </div>
                </div>
              )}

              {transcript === "" && partialTranscript === "" && isListening && (
                <div className="h-full flex flex-col items-center justify-center text-base-content/20 gap-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                    <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30 relative z-10">
                      <Mic className="w-10 h-10 text-primary-content" />
                    </div>
                  </div>
                  <div className="text-center animate-pulse">
                    <p className="font-black text-primary text-xl tracking-tight uppercase">Mendengarkan...</p>
                    <p className="text-base-content/40 font-medium">Silakan bicara ke mikrofon Anda.</p>
                  </div>
                </div>
              )}
              
              <div className="text-2xl leading-[1.6] text-base-content whitespace-pre-wrap font-medium tracking-tight px-4">
                {transcript}
                {partialTranscript && (
                  <span className="text-primary/40 bg-primary/5 rounded-lg px-2 py-1 ml-1 transition-all">
                    {partialTranscript}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Gradient Overlay for Scroll */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-100 to-transparent pointer-events-none" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error shadow-lg rounded-[2rem] p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-error-content/20 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-error-content" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-wider mb-0.5 text-error-content">System Error</p>
                <p className="font-medium text-error-content/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pb-16">
          {!isListening ? (
            <>
              <button
                onClick={handleStart}
                className="btn btn-primary flex items-center justify-center gap-2 btn-lg h-[4.5rem] px-12 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
              >
                <Mic className="w-6 h-6" />
                {hasStarted ? "Lanjutkan Sesi" : "Mulai Notulensi"}
              </button>
              
              {hasStarted && transcript.trim().length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-neutral flex items-center justify-center gap-2 btn-lg h-[4.5rem] px-12 rounded-[2rem] font-black text-lg shadow-xl shadow-neutral/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                  Kirim Notulen
                </button>
              )}
            </>
          ) : (
            <button
              onClick={stopListening}
              className="btn btn-error flex items-center justify-center gap-2 btn-lg h-[4.5rem] px-12 rounded-[2rem] font-black text-lg shadow-xl shadow-error/20 transition-all transform hover:scale-105 active:scale-95 group"
            >
              <div className="relative">
                <MicOff className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-content opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-error-content"></span>
                </span>
              </div>
              Hentikan Rekaman
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
