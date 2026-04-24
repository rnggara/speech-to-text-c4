"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "@/redux/slices/sessionSlice";
import { Mic, ArrowRight } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const [onSubmit, setOnSubmit] = useState(false);
  const { token } = useSelector((state: any) => state.session);

  useEffect(() => {
    if(token){
      router.push("/");
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setErrorUsername("Please enter a username")
    }
    if (!password) {
      setErrorPassword("Please enter a password")
    }
    setErrorUsername("")
    setErrorPassword("")
    if(username && password && !onSubmit){
      setOnSubmit(true)
      try {
        // Login
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
        const data = await response.json()
        setOnSubmit(false)
        console.log(data)
        if (data.success) {
        //   dispatch(setSession({ mom_code: code, floor }));
          const user = data.data.user;
          console.log(user)
          dispatch(setSession({username : user.username, token: data.data.token}))
          router.push("/");
        } else {
            if(data.data[0] == 'username'){
              setErrorUsername(data.message)
            } else {
              setErrorPassword(data.message)
            }
        }
      } catch (error: any) {
        console.error("Error logging in:", error);
        alert("Failed to login")
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

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="space-y-6 text-left">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-base-content/50 uppercase tracking-widest text-xs">Username</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errorUsername && <p className="text-red-500 text-xs">{errorUsername}</p>}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-base-content/50 uppercase tracking-widest text-xs">Password</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errorPassword && <p className="text-red-500 text-xs">{errorPassword}</p>}
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
                    <span>Login</span>
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
