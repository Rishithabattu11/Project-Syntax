"use client";
// import { useRouter } from "next/navigation";
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

// const mockRooms = [{ id: "123456" }, { id: "654321" }, { id: "987654" }];

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
      setRooms(tempRooms); // simulate backend fetch
      const shuffled = [...emojis].sort(() => Math.random() - 0.5);
      setUniqueEmojis(shuffled.slice(0, tempRooms.length));
    } else {
      console.error("Authentication Failed:", response.status);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  // useEffect(() => {
  //   const shuffled = [...emojis].sort(() => Math.random() - 0.5);
  //   setUniqueEmojis(shuffled.slice(0, mockRooms.length));
  // }, []);

  const addNotification = (message, type = "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen flex text-white br-[#1E1E20]">
      {/* Top Bar */}
      <div className="w-full  h-16 fixed bg-[#14161A] top-0 shadow-md flex items-center justify-between px-6 rounded-b-xl">
        <div className="flex space-x-12 px-15">
          {/* Leaderboard Button */}
          <button
            className="px-4 py-2 text-white rounded-md hover:scale-110"
            onClick={() => router.push(`/leaderboard`)}
          >
            Leaderboard
          </button>

          {/* Room Todo Button */}
          <button
            className="px-4 py-2 text-white rounded-md hover:scale-110"
            onClick={() => router.push(`/room-todo`)}
          >
            Room Todo
          </button>
        </div>

        <h3 className="text-sm text-[#D0D5DC]">Room ID: {roomId}</h3>
      </div>

      {/* Sidebar */}
      <div className="w-20 bg-[#14161A] z-[999] shadow-md flex flex-col items-center py-6 space-y-6">
        {/* Room Buttons */}
        {rooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-11 text-2xl flex items-center justify-center rounded-full transition-transform hover:scale-180"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index % uniqueEmojis.length]}
          </button>
        ))}
        <button
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-transform hover:scale-180 absolute bottom-16"
          onClick={() => router.push("/dashboard")}
        >
          <img
            src="\home.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </button>

        {/* MyTodo Icon - Sticking to Bottom */}
        <button
          className="w-12 h-15 text-2xl flex items-center justify-center rounded-full transition-transform hover:scale-180 absolute bottom-6 text-blue-500 hover:text-blue-700"
          onClick={() => router.push("/my-todo")}
        >
          📝
        </button>
      </div>

      {/* Room Content */}
      <div className="flex-1 bg-[#1F1F22] flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">You're in Room:{roomId}</h1>
        <p className="mt-4 text-grey-300">Room-specific content goes here!</p>
      </div>
    </div>
  );
}
