"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const emojis = ["🔥", "🚀", "🎯", "💡", "⚡", "🏆"];

let tempRooms = [];

export default function Dashboard() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
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

  const handleCreateRoom = async () => {
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString();
    var sendObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    var response = await fetch("http://localhost:4000/createRoom", sendObj);
    if (response.ok) {
      const data = await response.json();
      const newRoomId = data.id;
      fetchRooms();
      router.push(`/room/${newRoomId}`);
      setShowPopup(false);
    } else {
      console.error(`Failed to create room! Status: ${response.status}`);
      addNotification("Room creation failed. Please try again.");
    }
  };

  const handleJoinRoom = async () => {
    if (!/^\d{6}$/.test(roomId)) {
      addNotification("Room ID must be exactly 6 digits!");
      return;
    }

    var sendObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    var response = await fetch(
      `http://localhost:4000/joinRoom/${roomId}`,
      sendObj
    );
    console.log(response.ok);
    if (response.ok) {
      const data = await response.json();
      fetchRooms();
      router.push(`/room/${roomId}`);
      setShowPopup(false);
    } else {
      addNotification("Room Not Found or Unable to Join!");
      return;
    }
  };

  return (
    <div
      className="min-h-screen flex text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/ritaa2.jpg')" }}
    >
      {/* Sidebar */}
      <div className="w-20 bg-white/1 backdrop-blur-md shadow-lg flex flex-col items-center py-6 space-y-6 rounded-r-xl">
        {rooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-12 text-2xl flex items-center justify-center rounded-full transition-transform hover:scale-120"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index % uniqueEmojis.length]}
          </button>
        ))}
        {/* MyTodo Icon*/}
        <button
          className="w-12 h-35 text-2xl flex items-center justify-center rounded-full transition-transform hover:scale-110 absolute bottom-6 text-blue-500 hover:text-blue-700"
          onClick={() => router.push("/my-todo")}
        >
          📝{" "}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <h1 className="text-5xl mb-10">Welcome to Dashboard !</h1>
        <div className="flex gap-18">
          <div className="w-96 p-7 rounded-xl bg-white/10 backdrop-blur-sm shadow-lg text-center border border-white/40">
            <h2 className="text-2xl font-semibold mb-4">Create Room</h2>
            <p className="mb-9 text-white/80">
              Start your own session and invite others!
            </p>
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 rounded-lg bg-white/30 hover:bg-white/50 text-white text-lg font-semibold transition"
            >
              Generate & Enter Room
            </button>
          </div>
          <div className="w-96 p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-lg text-center border border-white/40">
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

      {/* Notifications */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white/5 backdrop-blur-sm text-gray-300 text-1xl px-4 py-2 rounded-xl shadow-lg border border-white/1 flex items-center justify-between gap-3 transition-opacity duration-200`}
          >
            <span className="text-gray-300 text-1xl">{notif.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
