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
import { Player } from "@/types/player";
import { usePlayersStore } from "@/hooks/usePlayersStore";

export default function GamePage() {
  const gameApi = useGame();
  const apiService = useApi();
  const [role, setRole] = useState<Role | null>(null);
  const [highlightedImage, setHighlightedImage] =
    useState<HighlightedImage | null>(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { setPlayers: setGlobalPlayers } = usePlayersStore();

  useEffect(() => {
    const handlePhase = (phase: GamePhase) => {
      setPhase(phase);
      if (phase === GamePhase.GAME) {
        requestRole();
        requestHighlightedImage();
      }
    };

    const handleHighlightedImage = (highlightedImage: HighlightedImage) => {
      setHighlightedImage(highlightedImage);
    };

    const handleRole = (role: Role) => {
      setRole(role);
    };

    const handlePlayers = (players: Player[]) => {
      setPlayers(players);
      setGlobalPlayers(players);
      stompApi.setRoomAdmin(players);
    };

    const requestPhase = async () => {
      try {
        const response = await apiService.get<{ phase: GamePhase }>(
          `/phase/${stompApi.getCode()}`
        );
        setPhase(response.phase);
      } catch (error) {
        console.error("Failed to fetch phase:", error);
      }
    };

    const requestPlayers = async () => {
      try {
        const response = await apiService.get<Player[]>(
          `/players/${stompApi.getCode()}`
        );
        setPlayers(response);
        setGlobalPlayers(response);
        stompApi.setRoomAdmin(response);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    const requestRole = async () => {
      gameApi.requestRole();
    };

    const requestHighlightedImage = async () => {
      gameApi.requestHighlightedImage();
    };

    requestPhase();
    requestPlayers();
    requestRole();
    requestHighlightedImage();

    gameApi.onPhase(handlePhase);
    gameApi.onRole(handleRole);
    gameApi.onHighlightedImage(handleHighlightedImage);
    gameApi.onPlayers(handlePlayers);

    return () => {
      gameApi.removePhaseHanlder(handlePhase);
      gameApi.removePlayersHandler(handlePlayers);
    };
  }, [gameApi, apiService]);

  if (phase === null) return <div>Loading...</div>;
  if (phase === GamePhase.LOBBY || phase === GamePhase.SUMMARY) {
    return <LobbyPage phase={phase} players={players} />;
  }
  if (role === null || highlightedImage === null) {
    return <div>Waiting for role...</div>;
  }
  return (
    <PlayPage
      role={role}
      highlightedImage={highlightedImage}
      phase={phase}
      players={players}
    />
  );
}
