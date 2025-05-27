"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

let tempRooms = [];

const emojis = [
  "🔥", "🚀", "🎯", "💡", "⚡", "🏆", "🧠", "🔮", "💻", "🛠",
  "🔗", "📚", "🔑", "🎮", "🌍", "🕶", "✨", "🧩", "🖥", "📈",
  "🔍", "🎨", "💎", "📜", "📝", "⏳",
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

  const activePath =
    typeof window !== "undefined" ? window.location.pathname : "";


useEffect(() => {
  const rocket = document.getElementById("rocket-image");
  if (!rocket) return;

  let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let target = { ...position };
  let angle = 0;
  let lastMouseMoveTime = Date.now();
  let animationFrameId;

  const lerp = (start, end, t) => start + (end - start) * t;

  const smoothAngle = (current, target, t) => {
    let diff = (target - current + 540) % 360 - 180;
    return current + diff * t;
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const handleMouseMove = (e) => {
    target = { x: e.clientX, y: e.clientY };
    lastMouseMoveTime = Date.now();
  };

  document.addEventListener("mousemove", handleMouseMove);

  const update = () => {
    const now = Date.now();
    const isIdle = now - lastMouseMoveTime > 3500;

    if (!isIdle) {
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const distance = Math.hypot(dx, dy);

    position.x = lerp(position.x, target.x, 0.05);
    position.y = lerp(position.y, target.y, 0.05);

    position.x = clamp(position.x, 20, window.innerWidth - 20);
    position.y = clamp(position.y, 20, window.innerHeight - 20);

    if (distance > 1) {
      const newTargetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      angle = smoothAngle(angle, newTargetAngle, 0.15); // increased smoothing factor
    }

    rocket.style.left = `${position.x - 20}px`;
    rocket.style.top = `${position.y - 20}px`;
    rocket.style.transform = `rotate(${angle}deg)`;

    rocket.classList.remove("animate-pulse");
  }else {
      // Idle donut orbit around cursor
      const idleRadius = 40;
      const idleSpeed = 0.0025;
      const time = now;

      // Orbit position
      const orbitX = target.x - Math.cos(time * idleSpeed) * idleRadius;
      const orbitY = target.y - Math.sin(time * idleSpeed) * idleRadius;

      const tangentAngleRad = time * idleSpeed + Math.PI / 2;
      const targetAngle = (tangentAngleRad * 180) / Math.PI - 90;

      position.x = lerp(position.x, orbitX, 0.1);
      position.y = lerp(position.y, orbitY, 0.1);

      position.x = clamp(position.x, 20, window.innerWidth - 20);
      position.y = clamp(position.y, 20, window.innerHeight - 20);

      angle = smoothAngle(angle, targetAngle, 0.1);

      rocket.style.left = `${position.x - 20}px`;
      rocket.style.top = `${position.y - 20}px`;
      rocket.style.transform = `rotate(${angle}deg)`;

      rocket.classList.add("animate-pulse");
    }

    animationFrameId = requestAnimationFrame(update);
  };

  update();

  return () => {
    cancelAnimationFrame(animationFrameId);
    document.removeEventListener("mousemove", handleMouseMove);
  };
}, []);


  return (
    <div className="min-h-screen flex text-white bg-[#1E1E20]">
      {/* Top Bar */}
      <div className="w-full h-16 fixed bg-[#14161A] top-0 shadow-md flex items-center justify-center px-6 z-50 rounded-b-xl">
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
        <p className="absolute right-6 text-[12px] text-[#7A797C]">
          Room ID: {roomId}
        </p>
      </div>

      {/* Sidebar */}
      <div className="w-17 bg-[#14161A] z-[999] shadow-md flex flex-col items-center py-6 space-y-6">
        {/* Room Buttons */}
        {rooms.map((room, index) => (
          <button
            key={room.id}
            className="w-12 h-11 text-2xl flex items-center justify-center rounded-full transition-transform hover:scale-120 cursor-pointer"
            onClick={() => router.push(`/room/${room.id}`)}
          >
            {uniqueEmojis[index % uniqueEmojis.length]}
          </button>
        ))}
        <button
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center transition-transform hover:scale-120 cursor-pointer absolute bottom-16"
          onClick={() => router.push("/dashboard")}
        >
          <img
            src="\home.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </button>

        {/* MyTodo Icon */}
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

      {/* Rocket Follows Cursor */}
            <Image
        src="/rocket1.png"
        alt="Rocket"
        width={20}
        height={20}
        id="rocket-image"
        className="fixed pointer-events-none z-[9999] drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}
