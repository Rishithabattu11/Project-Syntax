"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>👨‍💻 Welcome to Project-Syntax</h1>
      <p>
        A collaborative hub for you and your tech-squad to conquer coding
        together!
      </p>
      <hr />
      <h2>💬 Message from backend:</h2>
      <p>{message}</p>
    </main>
  );
}
