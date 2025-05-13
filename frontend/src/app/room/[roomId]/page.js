"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const { roomId } = useParams(); // ✅ Correct way to get dynamic route params

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161A] text-white">
      <h1 className="text-3xl font-bold">You're in Room: {roomId}</h1>
    </div>
  );
}
