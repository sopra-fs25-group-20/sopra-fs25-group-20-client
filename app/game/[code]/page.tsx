"use client";

import { useEffect, useState } from "react";
import LobbyPage from "./lobby/page";
import PlayPage from "./play/page";
import { GamePhase } from "@/types/gamePhase";
import { stompApi } from "@/api/stompApi";
import { useGame } from "@/hooks/useGame";
import { useApi } from "@/hooks/useApi";

export default function GamePage() {
  const gameApi = useGame();
  const apiService = useApi();
  const [phase, setPhase] = useState<GamePhase | null>(null);

  useEffect(() => {
    /**
     * Handles receptions of changed game phase.
     */
    const handlePhase = (phase: GamePhase) => {
      setPhase(phase);
    };

    /**
     * Request phase of a game room.
     */
    const requestPhase = async () => {
      try {
        const response = await apiService.get<{ phase: GamePhase }>(
          `/phase/${stompApi.getCode()}`,
        );
        setPhase(response.phase);
      } catch (error) {
        console.error("Failed to fetch phase:", error);
      }
    };

    requestPhase();
    gameApi.onPhase(handlePhase);
  }, [gameApi, apiService]);

  if (phase === null) return <div>Loading...</div>;
  if (phase === GamePhase.LOBBY || phase === GamePhase.SUMMARY) {
    return <LobbyPage />;
  }
  return <PlayPage />;
}
