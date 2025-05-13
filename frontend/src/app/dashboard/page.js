"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const emojis = [
  "🔥",
  "🚀",
  "🎯",
  "💡",
  "⚡",
  "🏆",
  "🧠",
  "🔮",
  "💻",
  "🛠️",
  "🔗",
  "📚",
  "🔑",
  "🎮",
  "🌍",
  "🕶️",
  "✨",
  "🧩",
  "🖥️",
  "📈",
  "🔍",
  "🎨",
  "💎",
  "📜",
  "📝",
  "⏳",
];

const mockRooms = [{ id: "123456" }, { id: "654321" }, { id: "987654" }];

export default function Dashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [uniqueEmojis, setUniqueEmojis] = useState([]);

  useEffect(() => {
    // Shuffle emojis to ensure uniqueness
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    setUniqueEmojis(shuffled.slice(0, mockRooms.length)); // Assign unique emojis
  }, []);

  const handleJoinRoom = () => {
    if (roomId.length === 6) {
      router.push(`/room/${roomId}`);
      setShowPopup(false);
    } else {
      alert("Room ID must be 6 digits!");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-16 bg-[#1F1F22] flex flex-col items-center py-4 space-y-4">
        {mockRooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-12 text-2xl flex items-center justify-center transition-transform hover:scale-110"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index]} {/* Unique emoji for each room */}
          </button>
        ))}

        {/* Plus Icon to Open Popup */}
        <button
          className="w-12 h-12 rounded-full bg-[#F2994A] flex items-center justify-center text-black text-xl font-bold hover:scale-110"
          onClick={() => setShowPopup(true)}
        >
          +
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-[#14161A] text-white">
        <h1 className="text-3xl">Welcome to Dashboard</h1>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1F1F22] p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              Join or Create Room
            </h2>
            <input
              type="text"
              placeholder="Enter 6-digit Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-[#5C43DA] outline-none mb-4"
            />
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-[#5C43DA] text-white rounded-md"
                onClick={handleJoinRoom}
              >
                Join Room
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
