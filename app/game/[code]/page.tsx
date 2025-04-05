"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChatWindow } from "@/components/chatWindow";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const apiService = useApi();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const codeFromUrl = params.code;

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const validateGameRoom = async () => {
      try {
        const code = stompApi.getCode();
        const nickname = stompApi.getNickname();
        // Make sure local game code equals URL game code
        if (!code || code !== codeFromUrl) {
          router.push("/");
          return;
        }
        // Validate the game room
        await apiService.post("/validate", {
          nickname,
          code,
        });
      } catch (err) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateGameRoom();
  }, [codeFromUrl, router, apiService]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <ChatWindow />
    </div>
  );
}
