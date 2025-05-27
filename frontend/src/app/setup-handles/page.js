"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SetupHandlesPage() {
  const [leetCode, setLeetCode] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [codechef, setCodechef] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const router = useRouter();

  const removeErrorForHandle = (handleName) => {
    setErrorMessages((prev) => prev.filter((err) => err.handle !== handleName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var token = localStorage.getItem("token");
    setIsSubmitting(true);
    setSubmitted(true);
    setIsLoading(true);
    setErrorMessages([]);

    var auth = "Bearer " + token;

    const platformusernames = {
      codeChefUsername: codechef,
      codeForcesUsername: codeforces,
      leetCodeUsername: leetCode,
    };

    var sendObj = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: auth,
        initial: 1,
      },
      body: JSON.stringify(platformusernames),
    };

    var results = await fetch("http://localhost:4000/fetchRatings", sendObj);

    setIsLoading(false);

    if (!results.ok) {
      console.error("Authentication Failed");
      return;
    }

    const data = await results.json();

    let tempErrors = [];

    if (data.CodeChefRating === -1) {
      tempErrors.push({
        handle: "CodeChef",
        message: "❌ Invalid CodeChef handle.",
      });
    }
    if (data.CodeforcesRating === -1) {
      tempErrors.push({
        handle: "Codeforces",
        message: "❌ Invalid Codeforces handle.",
      });
    }
    if (data.LeetcodeRating === -1) {
      tempErrors.push({
        handle: "LeetCode",
        message: "❌ Invalid LeetCode handle.",
      });
    }

    if (tempErrors.length > 0) {
      setErrorMessages(tempErrors);
      setIsSubmitting(false);
      setSubmitted(false);
      return;
    }

    setTimeout(() => {
      setSubmitted(false);
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#14161A] text-white px-4 font-sans space-y-6">
      {/* Heading Section */}
      <div className="text-center max-w-md space-y-3">
        <h1 className="text-4xl font-extrabold text-white">
          Enter Your Coding Handles
        </h1>
        <p className="text-base text-gray-300">
          Your handle is your <strong>public handle</strong> on platforms like
          LeetCode, Codeforces, and CodeChef.
        </p>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-2 right-4 bg-[#5C43DA] text-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm flex items-center gap-2">
          ⏳ Fetching rankings...
          <span className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></span>
        </div>
      )}

      {/* Image Section */}
      <div className="mb-2 flex flex-col items-center">
        <Image
          src="/setup-guide.png"
          alt="Example of entering handles"
          width={350}
          height={250}
          className="rounded-lg shadow-lg transition-transform hover:scale-105"
          priority
        />
        <p className="text-sm text-gray-400 mt-2 mb-2 text-center">
          Refer to this example to enter your coding handles correctly.
        </p>
      </div>

      {/* Compact Card with Inputs */}
      <div
        className="relative bg-[#1F1F22] backdrop-blur-md p-4 rounded-2xl shadow-2xl w-full max-w-[250px] border border-gray-700"
        style={{ boxShadow: "0px 0px 50px 12px #282348" }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {/* LeetCode */}
          <div>
            <label className="text-gray-300 text-sm font-medium">
              LeetCode Handle
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/leetcode.png"
                alt="LeetCode Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <input
                type="text"
                value={leetCode}
                onChange={(e) => {
                  setLeetCode(e.target.value);
                  removeErrorForHandle("LeetCode");
                }}
                placeholder="Handle"
                className="py-1.5 px-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] text-sm outline-none w-[170px]"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Codeforces */}
          <div>
            <label className="text-gray-300 text-sm font-medium">
              Codeforces Handle
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/codeforces.png"
                alt="Codeforces Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <input
                type="text"
                value={codeforces}
                onChange={(e) => {
                  setCodeforces(e.target.value);
                  removeErrorForHandle("Codeforces");
                }}
                placeholder="Handle"
                className="py-1.5 px-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] text-sm outline-none w-[170px]"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* CodeChef */}
          <div>
            <label className="text-gray-300 text-sm font-medium">
              CodeChef Handle
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/codechef.png"
                alt="CodeChef Icon"
                width={32}
                height={32}
                className="rounded-full"
              />
              <input
                type="text"
                value={codechef}
                onChange={(e) => {
                  setCodechef(e.target.value);
                  removeErrorForHandle("CodeChef");
                }}
                placeholder="Handle"
                className="py-1.5 px-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] text-sm outline-none w-[170px]"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-[#5C43DA] hover:bg-[#44387c] transition px-4 py-2 rounded-md text-sm font-medium text-white cursor-pointer ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save Handles"}
          </button>
        </form>
      </div>

      {/* Stylish Popups */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
        {errorMessages.map((error, index) => (
          <div
            key={index}
            className="bg-[#E02E2A] text-white text-xs px-3 py-2 rounded-xl shadow-lg animate-fade-in-up transition-all"
          >
            {error.message}
          </div>
        ))}
      </div>
    </div>
  );
}
