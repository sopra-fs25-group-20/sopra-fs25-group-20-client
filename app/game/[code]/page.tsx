"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChatWindow } from "@/components/chatWindow";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { GameSettingsComponent } from "@/components/gameSettingsComponent";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const apiService = useApi();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const codeFromUrl = params.code;

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const validateGameRoom = async () => {
      try {
        const code = stompApi.getCode();
        const nickname = stompApi.getNickname();

        if (!code || code !== codeFromUrl) {
          router.push("/");
          return;
        }
        await apiService.post("/validate", { nickname, code });
        setValidated(true);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateGameRoom();
  }, [codeFromUrl, router, apiService]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );
  }

  if (!validated) {
    return null;
  }

  return (
    <div className="page-wrapper">
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <ChatWindow />
      <GameSettingsComponent />
    </div>
  );
}
