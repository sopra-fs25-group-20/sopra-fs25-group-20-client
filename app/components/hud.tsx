"use client";

import { Display } from "./display";
import { HorizontalFlex } from "./horizontalFlex";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";
import { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { Button } from "./Button";
import { VerticalFlex } from "./verticalFlex";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { Tooltip } from "./Tooltip";
import { useCountdownTimer, formatTime } from "@/hooks/useCountdownTimer";

type Props = {
  role: Role;
};

type Timer = {
  remainingSeconds: number;
};

export const HUD = ({ role }: Props) => {
  const gameApi = useGame();
  const apiService = useApi();

  const [rawTime, setRawTime] = useState<number | null>(null);
  const timeLeft = useCountdownTimer(rawTime);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handlePhase = (phase: GamePhase) => {
    setPhase(phase);
  };

  useEffect(() => {
    const requestTimer = async () => {
      try {
        const response = await apiService.get<Timer>(
          `/game/timer/${stompApi.getCode()}?phase=GAME`
        );
        setRawTime(response.remainingSeconds);
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
                You are an <span style={{ color: "limegreen" }}>innocent</span>{" "}
                !
              </div>
            )}
          </Display>
          <Tooltip tip="Remaining time until the round ends">
            <Display className="hug">
              {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
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
