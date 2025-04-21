"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { InputField } from "@/components/InputField";
import { useApi } from "@/hooks/useApi";
import { ApplicationError } from "@/types/error";
import { stompApi } from "./api/stompApi";
import { Frame } from "./components/frame";
import { HorizontalFlex } from "./components/horizontalFlex";
import { Button } from "./components/Button";
import { useTheme } from "@/context/ThemeContext";


export default function Home() {
  const [nickname, setNickname] = useState("");
  const [code, setcode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const apiService = useApi();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleDisconnect = () => {
      stompApi.disconnect();
    };
    handleDisconnect();
    const handlePopState = () => {
      handleDisconnect();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleJoin = async () => {
    if (!nickname.trim() || !code.trim()) {
      setError("Please enter both nickname and game code.");
      return;
    }
    try {
      await apiService.post("/validate", {
        nickname: nickname.trim(),
        code: code.trim(),
      });
      stompApi.setCode(code);
      stompApi.setNickname(nickname);
      router.push(`/game/${code.trim()}`);
    } catch (error) {
      if (error instanceof ApplicationError) {
        if (error.status === 409) {
          setError("Nickname is already taken in this game.");
        } else if (error.status === 404) {
          setError("Game room not found.");
        } else {
          setError(error.message || "Failed to join the game.");
        }
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
  };

  const handleStart = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname to start a game.");
      return;
    }
    try {
      const response = await apiService.post<{ roomCode: string }>("/create", {
        nickname: nickname.trim(),
      });
      const code = response?.roomCode;
      if (!code) {
        setError("No game code returned from the server.");
        return;
      }
      stompApi.setCode(code);
      stompApi.setNickname(nickname);
      stompApi.setRoomAdmin(nickname);
      router.push(`/game/${code.trim()}`);
    } catch (error) {
      if (error instanceof ApplicationError) {
        setError(error.message || "Failed to create a new game room.");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="landing-page">
      <AppHeader onToggleTheme={toggleTheme} />
        <Frame>
          <InputField
            placeholder="Enter your nickname ..."
            value={nickname}
            onChange={setNickname}
          />
          <InputField
            placeholder="Enter game code ..."
            value={code}
            onChange={setcode}
          />
          <HorizontalFlex gap={15}>
            <Button onClick={handleJoin}>Join</Button>
            <Button onClick={handleStart}>Start new game</Button>
          </HorizontalFlex>
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </Frame>
      </div>
    </div>
  );
}
