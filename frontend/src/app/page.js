"use client";

import { useState } from "react";
import Image from "next/image";
import fire from "/public/fire.svg";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 2000);
  };

  const handleLogin = () => {
    if (!username) {
      addNotification("⚠️ Username required!");
      return;
    }
    if (!password) {
      addNotification("⚠️ Password required!");
      return;
    }
    console.log("Logging in with:", username, password);
  };

  const handleSignup = () => {
    if (!username) {
      addNotification("⚠️ Username required!");
      return;
    }
    if (!password) {
      addNotification("⚠️ Password required!");
      return;
    }
    console.log("Signing up with:", username, password);
    router.push("/setup-handles");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161A] text-white px-4 font-sans animate-slide-in">
      {/* Notification Popup Container */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-md transition-transform animate-slide-in"
          >
            {notif.message}
          </div>
        ))}
      </div>

      <div className="text-center space-y-7 max-w-xl flex flex-col items-center justify-center mx-auto">
        {/* Title */}
        <div>
          <h2 className="text-6xl font-extrabold text-[#ffffff]">RankedIn</h2>
        </div>

        {/* Heading */}
        <div>
          <div className="flex items-center gap-1 justify-center">
            <h1 className="text-2xl font-bold leading-tight text-gray-300">
              Unite. Compete. Conquer Together.
            </h1>
            <Image src={fire} alt="Illustration" width={20} height={20} />
          </div>
          <p className="mt-3 text-lg text-gray-300">
            Jump into coding rooms, dominate the leaderboard, and tackle epic challenges with your crew!
          </p>
        </div>

        {/* Login/Signup Box */}
        <div
          className="relative bg-[#1F1F22] backdrop-blur-md p-6 md:p-8 rounded-xl flex flex-col items-center justify-center mx-auto"
          style={{
            boxShadow: "0px 0px 40px 12px #282348",
            textAlign: "center",
            width: "fit-content",
          }}
        >
          {authMode === null ? (
            <div className="space-y-4 flex flex-col items-center">
              <button
                onClick={() => setAuthMode("login")}
                className="w-48 bg-[#5C43DA] hover:bg-[#44387c] transition px-6 py-3 rounded-lg text-lg font-semibold text-center text-white"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="w-48 bg-white text-gray-900 hover:bg-gray-300 transition px-6 py-3 rounded-lg text-lg font-semibold text-center"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 capitalize text-center">{authMode}</h2>
              <form className="space-y-4 flex flex-col items-center justify-center">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-[100%] p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none"
                />

                {/* Password Input */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[100%] p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none"
                />

                {/* ✅ Smaller Toggle Switch BELOW Password Input */}
                <div className="w-[100%] flex items-center gap-2 mt-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className="sr-only peer"
                    />
                    <div className="w-7 h-4 bg-gray-600 rounded-full peer-checked:bg-[#38C793] peer-focus:ring-[#38C793] transition-all relative">
                      <div
                        className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform ${
                          showPassword ? "translate-x-[13px]" : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                  </label>
                  <span className="text-gray-400 text-xs">Show Password</span>
                </div>


                <button
                  type="button"
                  className="w-30 bg-[#5C43DA] hover:bg-[#44387c] transition px-6 py-3 rounded-lg text-lg font-semibold text-center text-white"
                  onClick={authMode === "login" ? handleLogin : handleSignup}
                >
                  {authMode === "login" ? "Login" : "Sign Up"}
                </button>
              </form>

              {/* Toggle between Login and Signup */}
              <p className="mt-4 text-sm text-gray-400 text-center">
                {authMode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      className="text-[#5C43DA] hover:underline"
                      onClick={() => setAuthMode("signup")}
                    >
                      Sign up instead
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      className="text-[#5C43DA] hover:underline"
                      onClick={() => setAuthMode("login")}
                    >
                      Login instead
                    </button>
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}