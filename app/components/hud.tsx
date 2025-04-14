"use client";

import { useGame } from "@/hooks/useGame";
import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { GamePhase } from "@/types/gamePhase";
import { stompApi } from "@/api/stompApi";
import { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { GameSettings } from "@/types/gameSettings";

export const HUD = () => {
  const gameApi = useGame();
  const apiService = useApi();

  const [role, setRole] = useState<string | null>(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  /**
   * Handles receptions of changed game role.
   */
  const handleRole = (data: Role) => {
    console.warn(data.playerRole)
    setRole(data.playerRole);
  };

  /**
   * Request broadcasting of role.
   */
  const requestRole = async () => {
    gameApi.requestRole();
  };

  /**
   * Request phase.
   */
  const requestPhase = async () => {
    try {
      const response = await apiService.get<{ phase: GamePhase }>(`/phase/${stompApi.getCode()}`);
      setPhase(response.phase);
    } catch (error) {
      console.error("Failed to fetch phase:", error);
    }
  };

  /**
   * Request settings for timer.
   */
  const requestTimer = async () => {
    try {
      const response = await apiService.get<GameSettings>(`/settings/${stompApi.getCode()}`);
      setTimer(response.gameTimer);
    } catch (error) {
      console.error("Failed to fetch timer:", error);
    }
  };

  /**
   * Register handlers in game api and request initial values.
   */
  useEffect(() => {
    gameApi.onRole(handleRole);
    requestRole();
    requestPhase();
    requestTimer();
  }, [gameApi]);

  return (
    <HorizontalFlex>
      <Display>{role ?? "No Role"}</Display>
      <Display>{phase ?? "No Phase"}</Display>
      <Display>{timer !== null ? `${timer}s` : "No Timer"}</Display>
    </HorizontalFlex>
  );
};
