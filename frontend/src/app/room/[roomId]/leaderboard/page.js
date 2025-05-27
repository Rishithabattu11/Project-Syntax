"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  "🚠",
  "🔗",
  "📚",
  "🔑",
  "🎮",
  "🌍",
  "👶",
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
  const { roomId } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMode, setPopupMode] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [uniqueEmojis, setUniqueEmojis] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomNames, setRoomNames] = useState([]);
  const chartRef = useRef(null);
  const [crownPos, setCrownPos] = useState({ x: 521, y: 175 });
  const [selectedMetric, setSelectedMetric] = useState("Overall");
  const [ratings, setRatings] = useState({
    codechef: [],
    codeforces: [],
    leetcode: [],
    overall: [],
  });

  useEffect(() => {
    const fetchRoomNames = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:4000/getPeople/${roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setRoomNames(data);
        } else {
          console.error("Authentication Failed:", response.status);
        }
      } catch (err) {
        console.error("Error fetching room people:", err);
      }
    };
    if (roomId) fetchRoomNames();
  }, [roomId]);

  useEffect(() => {
    let intervalId;

    const fetchRatings = async () => {
      const token = localStorage.getItem("token");
      const cc = [];
      const cf = [];
      const lc = [];

      for (const name of roomNames) {
        try {
          const response = await fetch(
            `http://localhost:4000/getRatings/${name}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            cc.push(data.CodeChefRating);
            cf.push(data.CodeforcesRating);
            lc.push(data.LeetcodeRating);
          } else {
            cc.push(0);
            cf.push(0);
            lc.push(0);
          }
        } catch (err) {
          console.error("Error fetching rating for", name, err);
          cc.push(0);
          cf.push(0);
          lc.push(0);
        }
      }

      const overall = cc.map((_, i) => cc[i] + cf[i] + lc[i]);
      setRatings({ codechef: cc, codeforces: cf, leetcode: lc, overall });
    };

    if (roomNames.length > 0) {
      fetchRatings(); // initial fetch
      intervalId = setInterval(fetchRatings, 60000);
    }

    return () => clearInterval(intervalId);
  }, [roomNames]);

  const getRatings = () => {
    switch (selectedMetric) {
      case "Codechef":
        return ratings.codechef;
      case "Codeforces":
        return ratings.codeforces;
      case "Leetcode":
        return ratings.leetcode;
      case "Overall":
      default:
        return ratings.overall;
    }
  };

  const updateChart = () => {
    const rankings = getRatings();
    const players = roomNames.map((name, idx) => ({
      name,
      score: rankings[idx],
    }));
    players.sort((a, b) => b.score - a.score);

    const sortedNames = players.map((p) => p.name);
    const sortedScores = players.map((p) => p.score);
    const decoratedLabels = sortedNames.map((name, idx) => {
      if (idx === 0) return "🎖️ " + name;
      if (idx === 1) return "🥈 " + name;
      if (idx === 2) return "🥉 " + name;
      return name;
    });

    const chart = chartRef.current;
    if (!chart) return;
    const chartInstance = chart;
    const {
      ctx,
      chartArea: { left, right },
    } = chartInstance;

    const newBackgrounds = sortedScores.map((_, i) => {
      const gradient = ctx.createLinearGradient(left, 0, right, 0);
      if (i === 0) {
        gradient.addColorStop(0, "#b89d0d");
        gradient.addColorStop(0.5, "#c9b037");
        gradient.addColorStop(1, "#f0e68c");
      } else if (i === 1) {
        gradient.addColorStop(0, "#8a8a8a");
        gradient.addColorStop(0.5, "#bcbcbc");
        gradient.addColorStop(1, "#a8a9ad");
      } else if (i === 2) {
        gradient.addColorStop(0, "#6e4b25");
        gradient.addColorStop(0.5, "#aa7f45");
        gradient.addColorStop(1, "#b87333");
      } else {
        gradient.addColorStop(0, "#5C43DA");
        gradient.addColorStop(0.5, "#9E78FF");
        gradient.addColorStop(1, "#5C43DA");
      }
      return gradient;
    });

    chartInstance.data.labels = decoratedLabels;
    chartInstance.data.datasets[0].data = sortedScores;
    chartInstance.data.datasets[0].backgroundColor = newBackgrounds;
    chartInstance.update();
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const timeout = setTimeout(() => {
      updateChart();
    }, 100);
    return () => clearTimeout(timeout);
  }, [ratings, selectedMetric]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/fetchRooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const tempRooms = await response.json();
          setRooms(tempRooms);
          const shuffled = [...emojis].sort(() => Math.random() - 0.5);
          setUniqueEmojis(shuffled.slice(0, tempRooms.length));
        } else {
          console.error("Authentication Failed:", response.status);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const activePath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Leaderboard",
        color: "#fff",
        font: { size: 20 },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#ccc",
        displayColors: false,
        cornerRadius: 8,
        yAlign: "bottom",
        xAlign: "center",
        callbacks: {
          label: function (context) {
            const raw = context.raw.toString().replace(/,/g, "");
            return `Rating: ${raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          callback: (value) => value.toString().replace(/,/g, ""),
        },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: {
          color: "#fff",
          font: { weight: "bold" },
        },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
    },
  };

  return (
    <div className="min-h-screen text-white bg-[#1E1E20] flex">
      {/* Sidebar */}
      <div className="w-17 bg-[#14161A] z-[9999] shadow-md flex flex-col items-center py-6 space-y-6 fixed h-full">
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
          className="w-8 h-8 rounded-full overflow-hidden flex items-center cursor-pointer justify-center transition-transform hover:scale-120 absolute bottom-16"
          onClick={() => router.push("/dashboard")}
        >
          <img
            src="/home.png"
            alt="Home Icon"
            className="w-full h-full object-cover"
          />
        </button>
        <button
          className="w-12 h-15 text-2xl flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-120 absolute bottom-6 text-blue-500 hover:text-blue-700"
          onClick={() => router.push("/my-todo")}
        >
          📝
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "4.25rem" }}>
        {/* Topbars */}
        <div
          className="w-full h-16 bg-[#14161A] shadow-md flex items-center fixed z-[999] justify-center px-6 rounded-b-md"
          style={{ left: 0, right: 0 }}
        >
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
        <div className="fixed w-full z-50 top-16">
          <div className="w-full h-12 bg-[#1A1B1F] shadow-md flex items-center justify-center px-6 border-b border-[#2b2b2b]">
            <div className="flex space-x-4">
              {["Overall", "Codechef", "Codeforces", "Leetcode"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMetric(type)}
                  className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                    selectedMetric === type
                      ? "bg-[#3a3a3c] text-white shadow-sm"
                      : "text-[#7A797C] hover:bg-[#2c2c2e] hover:text-[#b4b4bf]"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Leaderboard Section */}
        <div className="flex-1 overflow-y-auto pt-[140px] px-10 relative">
          <div
            className="absolute text-2xl animate-bounce z-[10] rotate-[-25deg] transition-all duration-300"
            style={{ left: `${crownPos.x}px`, top: `${crownPos.y - 20}px` }}
          >
            👑
          </div>
          <div
            className="w-full bg-[#2B2B30] rounded-2xl shadow-lg p-6 relative overflow-hidden"
            style={{ height: `${Math.max(400, roomNames.length * 60)}px` }}
          >
            <Bar
              ref={chartRef}
              data={{ labels: [], datasets: [{ label: "Rating", data: [] }] }}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
