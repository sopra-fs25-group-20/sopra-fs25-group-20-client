"use client";

import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { useEffect, useState } from "react";
import { GameSettings } from "@/types/gameSettings";
import { Role } from "@/types/role";

type Props = {
  role: Role;
};

export const HUD = ({ role }: Props) => {
  const apiService = useApi();
  const [timer, setTimer] = useState<number | null>(null);

  /**
   * Register handlers in game api and request initial values.
   */
  useEffect(() => {
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

    requestTimer();
  }, [apiService]);

  return (
    <HorizontalFlex>
      <Display>{role.playerRole === "spy"
        ?
        <>
          You are the spy!
        </>
        : <>You are an innocent!</>}
      </Display>
      <Display className="hug">{timer !== null ? `${timer}s` : "No Timer"}</Display>
    </HorizontalFlex>
  );
};
