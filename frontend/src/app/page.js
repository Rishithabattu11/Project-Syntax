"use client";

import { useState } from "react";

export default function Home() {
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161A] text-white px-4 font-sans">
      <div className="text-center space-y-7 max-w-xl flex flex-col items-center justify-center mx-auto">
        {/* Title */}
        <div>
          <h2 className="text-6xl font-extrabold text-[#ffffff]">RankedIn</h2>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold leading-tight text-gray-300">
            Unite. Compete. Conquer Together.
          </h1>
          <p className="mt-3 text-lg text-gray-300">
            Jump into coding rooms, dominate the leaderboard, and tackle epic
            challenges with your crew!
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
                className="w-48 bg-[#5C43DA] hover:bg-[#5C43DA] transition px-6 py-3 rounded-lg text-lg font-semibold text-center text-white"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="w-48 bg-white text-gray-900 hover:bg-gray-200 transition px-6 py-3 rounded-lg text-lg font-semibold text-center"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 capitalize text-center">
                {authMode}
              </h2>
              <form className="space-y-4 flex flex-col items-center justify-center">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-[100%]  p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-[100%] p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none"
                />
                <button
                  type="submit"
                  className="w-30 bg-[#5C43DA] hover:bg-purple-700 transition px-6 py-3 rounded-lg text-lg font-semibold text-center text-white"
                >
                  {authMode === "login" ? "Login" : "Sign Up"}
                </button>
              </form>
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
