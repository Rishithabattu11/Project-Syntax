"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  "🛠",
  "🔗",
  "📚",
  "🔑",
  "🎮",
  "🌍",
  "🕶",
  "✨",
  "🧩",
  "🖥",
  "📈",
  "🔍",
  "🎨",
  "💎",
  "📜",
  "📝",
  "⏳",
];

const mockRooms = [{ id: "123456" }, { id: "654321" }, { id: "987654" }];

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const [uniqueEmojis, setUniqueEmojis] = useState([]);

  useEffect(() => {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    setUniqueEmojis(shuffled.slice(0, mockRooms.length));
  }, []);

  return (
    <div className="min-h-screen flex bg-[#14161A] text-white">
      {/* Sidebar remains unchanged across rooms */}
      <div className="w-16 bg-[#1F1F22] flex flex-col items-center py-4 space-y-4">
        {mockRooms.map((room, index) => (
          <button
            key={room.id}
            className={`w-12 h-12 text-2xl flex items-center justify-center transition-transform ${
              roomId === room.id
                ? "scale-110 border-2 border-white"
                : "hover:scale-110"
            }`}
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index]}
          </button>
        ))}
      </div>

      {/* Room Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">You're in Room: {roomId}</h1>
        <p className="mt-4 text-gray-300">Room-specific content goes here!</p>
      </div>
    </div>
  );
}
