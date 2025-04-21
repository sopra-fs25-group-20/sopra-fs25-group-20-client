"use client";

import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { useEffect, useRef, useState } from "react";
import { GameSettings } from "@/types/gameSettings";
import { Role } from "@/types/role";

type Props = {
  role: Role;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const HUD = ({ role }: Props) => {
  const apiService = useApi();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        setTimeLeft(response.gameTimer);
      } catch (error) {
        console.error("Failed to fetch timer:", error);
      }
    };

    requestTimer();
  }, [apiService]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  return (
    <HorizontalFlex>
      <Display>{role.playerRole === "spy"
        ?
        <>
          You are the spy!
        </>
        : <>You are an innocent!</>}
      </Display>
      <Display className="hug">{timeLeft !== null ? formatTime(timeLeft) : "No Timer"}</Display>
    </HorizontalFlex>
  );
};
