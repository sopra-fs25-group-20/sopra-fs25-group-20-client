"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Box } from "@/components/Box";
import { PrimaryButton } from "@/components/PrimaryButton";
import { InputField } from "@/components/InputField";
import { getApiDomain } from "@/utils/domain";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleJoin = async () => {
    if (!nickname.trim() || !gameCode.trim()) {
      setError("Please enter both nickname and game code.");
      return;
    }

    const res = await fetch(`${getApiDomain()}/validate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: nickname.trim(),
        code: gameCode.trim(),
      }),
    });

    if (res.ok) {
      router.push(`/game/${gameCode.trim()}`);
    } else if (res.status === 409) {
      setError("Nickname is already taken in this game.");
    } else if (res.status === 404) {
      setError("Game room not found.");
    } else {
      setError("Failed to join the game.");
    }
  };

  const handleStart = async () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname to start a game.");
      return;
    }

    const res = await fetch(`${getApiDomain()}/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nickname.trim() }),
    });

    if (res.ok) {
      const data = await res.json();
      const code = data?.roomCode;

      if (!code) {
        setError("No game code returned from the server.");
        return;
      }

      router.push(`/game/${code}`);
    } else {
      const error = await res.json().catch(() => ({}));
      setError(error?.error || "Failed to create a new game room.");
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
