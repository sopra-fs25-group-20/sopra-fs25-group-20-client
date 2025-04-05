"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChatWindow } from "@/components/chatWindow";

export default function Lobby() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode, router]);

  return (
    <div className="page-wrapper">
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <ChatWindow />
    </div>
  );
}
