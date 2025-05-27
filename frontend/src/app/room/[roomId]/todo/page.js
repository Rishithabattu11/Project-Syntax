"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

let tempRooms = [];

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

export default function RoomPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const { roomId } = useParams();
  const [popupMode, setPopupMode] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [uniqueEmojis, setUniqueEmojis] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    var sendObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    var response = await fetch("http://localhost:4000/fetchRooms", sendObj);

    if (response.ok) {
      tempRooms = await response.json();
      setRooms(tempRooms);
      const shuffled = [...emojis].sort(() => Math.random() - 0.5);
      setUniqueEmojis(shuffled.slice(0, tempRooms.length));
    } else {
      console.error("Authentication Failed:", response.status);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const addNotification = (message, type = "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 2000);
  };

  const activePath = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="min-h-screen flex text-white bg-[#1E1E20]">
      {/* Top Bar */}
      <div className="w-full h-16 fixed bg-[#14161A] top-0 shadow-md flex items-center justify-center z-50 rounded-b-xl">
        <div className="flex items-center bg-[#1F1F22] rounded-md p-1 shadow-inner border border-[#333]">
          {[
            { label: "Leaderboard", path: `/room/${roomId}/leaderboard` },
            { label: "Room Todo", path: `/room/${roomId}/todo` },
          ].map((tab) => (
            <button
              key={tab.path}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer text-md ${
                activePath === tab.path
                  ? "bg-[#3a3a3c] text-white shadow-sm"
                  : "text-[#7A797C] hover:bg-[#2c2c2e] hover:text-[#b4b4bf]"
              }`}
              onClick={() => router.push(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
       <p className="absolute right-6 text-[12px] text-[#7A797C]">Room ID: {roomId}</p>
      </div>

      {/* Sidebar */}
      <div className="w-17 bg-[#14161A] z-[999] shadow-md flex flex-col items-center py-6 space-y-6">
        {/* Room Buttons */}
        {rooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-11 text-2xl flex items-center justify-center cursor-pointer rounded-full transition-transform hover:scale-120"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index % uniqueEmojis.length]}
          </button>
        ))}
        <button
          className="w-8 h-8 rounded-full overflow-hidden flex items-center cursor-pointer justify-center transition-transform hover:scale-120 absolute bottom-16"
          onClick={() => router.push("/dashboard")}
        >
          <img
            src="\home.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </button>

        {/* MyTodo Icon*/}
        <button
          className="w-12 h-15 text-2xl flex items-center justify-center cursor-pointer rounded-full transition-transform hover:scale-120 absolute bottom-6 text-blue-500 hover:text-blue-700"
          onClick={() => router.push("/my-todo")}
        >
          📝
        </button>
      </div>

      {/* Room Content */}
      <div className="flex-1 bg-[#1F1F22] flex flex-col items-center justify-center">
        {/* Your actual room content goes here */}
      </div>
    </div>
  );
}
