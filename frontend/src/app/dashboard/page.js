"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const emojis = ["🔥", "🚀", "🎯", "💡", "⚡", "🏆"];

const mockRooms = [{ id: "123456" }, { id: "654321" }, { id: "987654" }];

export default function Dashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [popupMode, setPopupMode] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [uniqueEmojis, setUniqueEmojis] = useState([]);

  useEffect(() => {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    setUniqueEmojis(shuffled.slice(0, mockRooms.length));
  }, []);

  const addNotification = (message, type = "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 2000);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString();
    router.push(`/room/${newRoomId}`);
    setShowPopup(false);
  };

  const handleJoinRoom = () => {
    if (!/^\d{6}$/.test(roomId)) {
      addNotification("Room ID must be exactly 6 digits!");
    } else {
      router.push(`/room/${roomId}`);
      setShowPopup(false);
    }
  };

  return (
    <div
      className="min-h-screen flex text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hellorita.jpg')" }}
    >
      {/* Sidebar */}
      <div className="w-20 bg-white/1 backdrop-blur-md shadow-lg flex flex-col items-center py-6 space-y-6 rounded-r-xl">
        {mockRooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-12 text-2xl flex item`s-center justify-center rounded-full transition-transform hover:scale-120"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index]}
          </button>
        ))}
        {/* Plus Icon */}
        {/* <button
    className="w-12 h-12 rounded-full bg-[#5C43DA] flex items-center justify-center text-white text-2xl font-bold hover:bg-[#44387c] hover:scale-110 transition-all"
    onClick={() => {
      setShowPopup(true);
      setPopupMode(null);
    }}
  >
    +
  </button> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <h1 className="text-5xl mb-10">Welcome to Dashboard !</h1>
        {/* Two Transparent Cards in the Background */}
        {/* Two Transparent Cards in the Background */}
        <div className="flex gap-16">
          {" "}
          {/* Increased spacing */}
          {/* Create Room Card */}
          <div className="w-96 p-8 rounded-xl bg-white/10 backdrop-blur-sm shadow-lg text-center border border-white/40">
            {" "}
            {/* Added white border */}
            <h2 className="text-2xl font-semibold mb-4">Create Room</h2>
            <p className="mb-4 text-white/80">
              Start your own session and invite others!
            </p>
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 rounded-lg bg-white/30 hover:bg-white/50 text-white text-lg font-semibold transition"
            >
              Generate & Enter Room
            </button>
          </div>
          {/* Join Room Card */}
          <div className="w-96 p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-lg text-center border border-white/40">
            {" "}
            {/* Added white border */}
            <h2 className="text-2xl font-semibold mb-4">Join Room</h2>
            <input
              type="text"
              placeholder="Enter 6-digit Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-white focus:ring-1 focus:ring-[#A0A0A0] outline-none border border-white/40 mb-4"
            />
            <button
              onClick={handleJoinRoom}
              className="w-full py-3 rounded-lg bg-white/30 hover:bg-white/50 text-white text-lg font-semibold transition"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Notification Popup Container */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white/5 backdrop-blur-sm text-gray-300 text-1xl px-4 py-2 rounded-xl shadow-lg border border-white/1 flex items-center justify-between gap-3 transition-opacity duration-200 `}
          >
            <span className="text-gray-300 text-1xl">{notif.message}</span>{" "}
            {/* Keeping bold text unchanged */}
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {/* {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="relative bg-[#1F1F22] backdrop-blur-md p-8 rounded-xl flex flex-col items-center justify-center"
            style={{ boxShadow: "0px 0px 40px 12px #282348", width: "450px" }}
          >
            {popupMode === null ? (
              <div className="space-y-6 flex flex-col items-center w-full">
                <button
                  onClick={() => setPopupMode("create")}
                  className="w-full bg-[#5C43DA] hover:bg-[#44387c] transition px-6 py-4 rounded-lg text-lg font-semibold text-white"
                >
                  Create Room
                </button>
                <button
                  onClick={() => setPopupMode("join")}
                  className="w-full bg-white text-gray-900 hover:bg-gray-300 transition px-6 py-4 rounded-lg text-lg font-semibold"
                >
                  Join Room
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full bg-red-600 hover:bg-red-700 transition px-6 py-4 rounded-lg text-lg font-semibold text-white"
                >
                  Cancel
                </button>
              </div>
            ) : popupMode === "create" ? (
              <>
                <h2 className="text-xl font-bold text-white mb-4">
                  Create Room
                </h2>
                <button
                  className="w-full px-6 py-4 bg-[#5C43DA] text-white rounded-md text-lg font-semibold"
                  onClick={handleCreateRoom}
                >
                  Generate & Enter Room
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-4">
                  Enter Room ID
                </h2>
                <input
                  type="text"
                  placeholder="Enter 6-digit Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none mb-4"
                />
                <div className="flex space-x-4">
                  <button
                    className="w-32 px-4 py-3 bg-[#5C43DA] text-white rounded-md"
                    onClick={handleJoinRoom}
                  >
                    Join Room
                  </button>
                  <button
                    className="w-32 px-4 py-3 bg-red-600 text-white rounded-md"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
