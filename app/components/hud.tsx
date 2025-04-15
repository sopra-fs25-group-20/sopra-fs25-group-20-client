"use client";

import { useGame } from "@/hooks/useGame";
import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { GamePhase } from "@/types/gamePhase";
import { stompApi } from "@/api/stompApi";
import { useEffect, useState } from "react";
import { GameSettings } from "@/types/gameSettings";
import { Role } from "@/types/role";

type Props = {
  role: Role;
};

export const HUD = ({ role }: Props) => {
  const gameApi = useGame();
  const apiService = useApi();
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  /**
   * Register handlers in game api and request initial values.
   */
  useEffect(() => {
    /**
     * Request phase.
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
     * Request settings for timer.
     */
    const requestTimer = async () => {
      try {
        const response = await apiService.get<GameSettings>(
          `/settings/${stompApi.getCode()}`,
        );
        setTimer(response.gameTimer);
      } catch (error) {
        console.error("Failed to fetch timer:", error);
      }
    };

    requestPhase();
    requestTimer();
  }, [gameApi, apiService]);

  return (
    <HorizontalFlex>
      <Display>{role.playerRole ?? "No Role"}</Display>
      <Display>{phase ?? "No Phase"}</Display>
      <Display>{timer !== null ? `${timer}s` : "No Timer"}</Display>
    </HorizontalFlex>
  );
};
