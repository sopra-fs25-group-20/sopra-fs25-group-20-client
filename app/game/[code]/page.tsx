"use client";

import { useEffect, useState } from "react";
import LobbyPage from "./lobby";
import PlayPage from "./play";
import { GamePhase } from "@/types/gamePhase";
import { stompApi } from "@/api/stompApi";
import { useGame } from "@/hooks/useGame";
import { useApi } from "@/hooks/useApi";
import { Role } from "@/types/role";
import { HighlightedImage } from "@/types/highlightedImage";

export default function GamePage() {
  const gameApi = useGame();
  const apiService = useApi();
  const [role, setRole] = useState<Role | null>(null);
  const [highlightedImage, setHighlightedImage] = useState<
    HighlightedImage | null
  >(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);

  useEffect(() => {
    /**
     * Handles receptions of changed game phase.
     */
    const handlePhase = (phase: GamePhase) => {
      setPhase(phase);
      if (phase === GamePhase.GAME) {
        requestRole();
        requestHighlightedImage();
      }
    };

    /**
     * Handles reception of the highlighted image
     */
    const handleHighlightedImage = (highlightedImage: HighlightedImage) => {
      setHighlightedImage(highlightedImage);
    };

    /**
     * Handles receptions of changed game role.
     */
    const handleRole = (role: Role) => {
      setRole(role);
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

    /**
     * Request broadcasting of role.
     */
    const requestRole = async () => {
      gameApi.requestRole();
    };

    /**
     * Request broadcasting of the highlighted image.
     */
    const requestHighlightedImage = async () => {
      gameApi.requestHighlightedImage();
    };

    requestPhase();
    requestRole();
    requestHighlightedImage();

    gameApi.onPhase(handlePhase);
    gameApi.onRole(handleRole);
    gameApi.onHighlightedImage(handleHighlightedImage);
  }, [gameApi, apiService]);

  if (phase === null) return <div>Loading...</div>;
  if (phase === GamePhase.LOBBY || phase === GamePhase.SUMMARY) {
    return <LobbyPage phase={phase} />;
  }
  if (role === null || highlightedImage === null) {
    return <div>Waiting for role...</div>;
  }
  return (
    <PlayPage role={role} highlightedImage={highlightedImage} phase={phase} />
  );
}
