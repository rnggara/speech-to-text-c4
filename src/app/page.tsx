"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSession } from "@/redux/slices/sessionSlice";
import { Mic, ArrowRight } from "lucide-react";
import { CgSpinner } from "react-icons/cg";

export default function Home() {
  const [code, setCode] = useState("");
  const [floor, setFloor] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorFloor, setErrorFloor] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const [onSubmit, setOnSubmit] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setErrorCode("Please enter a mom code")
    }
    if (!floor) {
      setErrorFloor("Please enter a floor")
    }
    if(code && floor && !onSubmit){
      setOnSubmit(true)
      try {
        // Check mom code
        const response = await fetch("/api/check-mom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mom_code: code,
          }),
        })
        const data = await response.json()
        setOnSubmit(false)
        console.log(data)
        if (data.success) {
          dispatch(setSession({ mom_code: code, floor }));
          router.push("/transcript-page");
        } else {
          setErrorCode(data.message)
        }
      } catch (error: any) {
        console.error("Error checking mom code:", error);
        alert("Failed to check mom code")
        setOnSubmit(false)
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] p-4 relative z-10">
        <div className="card bg-base-100 shadow-2xl border border-base-content/5 overflow-visible">
          <div className="card-body p-10 md:p-12 items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary to-primary-focus rounded-3xl shadow-lg shadow-primary/20 flex items-center justify-center mb-6 transform -rotate-6">
              <Mic className="w-10 h-10 text-primary-content" />
            </div>
            
            <h1 className="text-4xl font-black text-base-content tracking-tight mb-3">
              Notulen<span className="text-primary">.</span>
            </h1>
            <p className="text-base-content/60 font-medium mb-12 bg-red-500 text-white p-10 uppercase">
              Transkripsi meeting real-time dengan <br /> akurasi tingkat tinggi.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="space-y-6 text-left">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-base-content/50 uppercase tracking-widest text-xs">Meeting Code</span>
                  </label>
                  <input
                    id="meetingCode"
                    type="text"
                    placeholder="Contoh: STRAT-2024"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  {errorCode && <p className="text-red-500 text-xs">{errorCode}</p>}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-base-content/50 uppercase tracking-widest text-xs">Floor / Room</span>
                  </label>
                  <input
                    id="floor"
                    type="text"
                    placeholder="Nama ruangan atau lantai"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                  {errorFloor && <p className="text-red-500 text-xs">{errorFloor}</p>}
                </div>
              </div>

              <button
                type="submit"
                className={`btn flex items-center justify-center btn-primary btn-lg w-full shadow-xl shadow-primary/20 gap-3 text-lg h-[4.5rem] rounded-2xl group ${onSubmit ? "btn-disabled" : ""}`}
              >
                {onSubmit ? (<>
                  <span>Loading...</span>
                </>) : (
                  <>
                    <span>Masuk Meeting</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-base-content/5 flex justify-center gap-8 opacity-20">
              <div className="w-8 h-8 bg-base-content rounded-full" />
              <div className="w-8 h-8 bg-base-content rounded-full" />
              <div className="w-8 h-8 bg-base-content rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
