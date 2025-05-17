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
      addNotification("⚠️ Room ID must be exactly 6 numeric digits (0-9)!");
    } else {
      router.push(`/room/${roomId}`);
      setShowPopup(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#14161A] text-white">
      {/* Sidebar */}
      <div className="w-16 bg-[#1F1F22] flex flex-col items-center py-4 space-y-4">
        {mockRooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-12 text-2xl flex items-center justify-center transition-transform hover:scale-110"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index]}
          </button>
        ))}
        {/* Plus Icon */}
        <button
          className="w-10 h-10 rounded-lg bg-[#5C43DA] flex items-center justify-center text-white text-2xl font-bold hover:bg-[#44387c] transition-transform hover:scale-110"
          onClick={() => {
            setShowPopup(true);
            setPopupMode(null);
          }}
        >
          +
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl">Welcome to Dashboard</h1>
      </div>

      {/* Notification Popup Container */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-[#1F1F22] text-white px-5 py-3 rounded-md shadow-md border ${
              notif.type === "error" ? "border-red-500" : "border-green-500"
            } animate-slide-in flex items-center justify-between gap-3`}
            style={{
              boxShadow:
                notif.type === "error"
                  ? "0px 0px 20px 4px #D32F2F"
                  : "0px 0px 20px 4px #28A745",
            }}
          >
            <span>{notif.message}</span>
            <button
              className="text-sm px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 transition"
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notif.id)
                )
              }
            >
              OK
            </button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
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
      )}
    </div>
  );
}
