"use client";

import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { useEffect, useRef, useState } from "react";
import { GameSettings } from "@/types/gameSettings";
import { Role } from "@/types/role";
import { Button } from "./Button";
import { VerticalFlex } from "./verticalFlex";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { Tooltip } from "./Tooltip";

type Props = {
  role: Role;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const HUD = ({ role }: Props) => {
  const gameApi = useGame();
  const apiService = useApi();

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles receptions of change in phase ("lobby", "game", "vote" or "summary").
   */
  const handlePhase = (phase: GamePhase) => {
    setPhase(phase);
  };

  /**
   * Register handlers in game api and request initial values.
   */
  useEffect(() => {
    const requestTimer = async () => {
      try {
        const response = await apiService.get<GameSettings>(
          `/settings/${stompApi.getCode()}`
        );
        setTimeLeft(response.gameTimer);
      } catch (error) {
        console.error("Failed to fetch timer:", error);
      }
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

    requestTimer();
    requestPhase();
    gameApi.onPhase(handlePhase);

    return () => {
      gameApi.removePhaseHanlder(handlePhase);
    };
  }, [apiService, gameApi]);

  /**
   * Countdown
   */
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

  /**
   * Chose help text based on phase and role.
   */
  const helpText = (() => {
    if (phase === GamePhase.VOTE) {
      return 'Do you think this player is the spy? Click "Yes" to vote them out, or "No" to keep them in. If most players vote "Yes", the round will end.';
    }
    if (role.playerRole === "spy") {
      return "Use the chat on the left to gather clues and figure out which image is the target — but don't reveal you're the spy. When you're ready, select an image and click \"Guess\" to make your guess and end the round.";
    }
    return 'The highlighted photo below is the target image the spy is trying to guess. Use the chat on the left to question others and identify the spy. When you\'re confident, click "Vote Out" on the suspected player to start the vote.';
  })();

  return (
    <VerticalFlex hug>
      <HorizontalFlex>
        <div className="hud">
          <Display className="hug">
            {role.playerRole === "spy" ? (
              <div className="text">
                You are the <span style={{ color: "#f87171" }}>spy</span> !
              </div>
            ) : (
              <div className="text">
                You are an <span style={{ color: "limegreen" }}>innocent</span>!
              </div>
            )}
          </Display>
          <Tooltip tip="Remaining time until the round ends">
            <Display className="hug">
              {timeLeft !== null ? formatTime(timeLeft) : "No Timer"}
            </Display>
          </Tooltip>
        </div>
        <Button className="hug" onClick={() => setShowHelp((prev) => !prev)}>
          {showHelp ? "Hide Help" : "Show Help"}
        </Button>
      </HorizontalFlex>
      {showHelp && (
        <HorizontalFlex>
          <Display className="text">{helpText}</Display>
        </HorizontalFlex>
      )}
    </VerticalFlex>
  );
};
