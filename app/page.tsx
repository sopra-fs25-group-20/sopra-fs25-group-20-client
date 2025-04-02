"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Box } from "@/components/Box";
import { PrimaryButton } from "@/components/PrimaryButton";
import { InputField } from "@/components/InputField";
import { useApi } from "@/hooks/useApi";
import { ApplicationError } from "@/types/error";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const apiService = useApi();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleJoin = async () => {
    if (!nickname.trim() || !gameCode.trim()) {
      setError("Please enter both nickname and game code.");
      return;
    }

    try {
      await apiService.post("/validate", {
        nickname: nickname.trim(),
        code: gameCode.trim(),
      });
      router.push(`/game/${gameCode.trim()}`);
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

      router.push(`/game/${code}`);
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
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />

      <Box className="flex flex-col gap-3 w-full max-w-md">
        <div className="input-group">
          <InputField
            placeholder="Enter your nickname ..."
            value={nickname}
            onChange={setNickname}
          />
        </div>

        <div className="input-group">
          <InputField
            placeholder="Enter game code ..."
            value={gameCode}
            onChange={setGameCode}
          />
        </div>

        <div className="button-row">
          <PrimaryButton
            label="Join"
            onClick={handleJoin}
            className="btn-sm half-button"
          />
          <PrimaryButton
            label="Start new game"
            onClick={handleStart}
            className="btn-sm half-button"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
      </Box>
    </div>
  );
}
