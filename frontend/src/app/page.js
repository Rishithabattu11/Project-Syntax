"use client";

import { useState } from "react";

export default function Home() {
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161A] text-white px-4 font-sans">
      <div className="text-center space-y-7 max-w-xl">
        {/* Heading */}
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Unite. Compete. Conquer Together.
          </h1>
          <p className="mt-3 text-lg text-gray-300">
            Jump into coding rooms, dominate the leaderboard, and tackle epic
            challenges with your crew!
          </p>
        </div>

        {/* Login/Signup Box */}
        <div
          className="relative bg-[#1F1F22] backdrop-blur-md p-6 md:p-8 rounded-2xl"
          style={{
            boxShadow: "0px 0px 40px 12px rgba(93, 68, 218, 0.7)",
          }}
        >
          {authMode === null ? (
            <div className="space-y-4">
              <button
                onClick={() => setAuthMode("login")}
                className="w-full bg-[#5D44DA] hover:bg-purple-700 transition py-3 rounded-lg text-lg font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="w-full bg-white text-gray-900 hover:bg-gray-200 transition py-3 rounded-lg text-lg font-semibold"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 capitalize">{authMode}</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5D44DA] outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5D44DA] outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#5D44DA] hover:bg-purple-700 transition py-3 rounded-lg text-lg font-semibold"
                >
                  {authMode === "login" ? "Login" : "Sign Up"}
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-400">
                {authMode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      className="text-[#5D44DA] hover:underline"
                      onClick={() => setAuthMode("signup")}
                    >
                      Sign up instead
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      className="text-[#5D44DA] hover:underline"
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
