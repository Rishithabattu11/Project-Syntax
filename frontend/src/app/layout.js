import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "RankedIn",
  description: "Compete & Conquer",
  icons: "/rankediconcropped.png",
  extend: {
    keyframes: {
      "slide-in": {
        "0%": { transform: "translateX(50%)", opacity: "0" },
        "100%": { transform: "translateX(0)", opacity: "1" },
      },
    },
    animation: {
      "slide-in": "slide-in 0.3s ease-out forwards",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
