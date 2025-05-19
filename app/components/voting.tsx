"use client";

import { useGame } from "@/hooks/useGame";
import { Button } from "./Button";
import { Frame } from "./frame";
import { HorizontalFlex } from "./horizontalFlex";
import { VerticalFlex } from "./verticalFlex";
import { useEffect, useRef, useState } from "react";
import { GameVoteCast } from "@/types/gameVoteCast";
import { useApi } from "@/hooks/useApi";
import { GameVoteInit } from "@/types/gameVoteInit";
import { stompApi } from "@/api/stompApi";
import { GamePhase } from "@/types/gamePhase";

type Timer = {
  remainingSeconds: number;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const Voting = () => {
  const gameApi = useGame();
  const apiService = useApi();
  const [votes, setVotes] = useState<GameVoteCast | null>(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const voteYes = () => gameApi.sendVoteCast(true);
  const voteNo = () => gameApi.sendVoteCast(false);

  const handleVoteInit = (vote: GameVoteInit) => {
    setTarget(vote.target);
  };

  const handleVoteCast = (votes: GameVoteCast) => {
    setVotes(votes);
  };

  const handlePhase = (newPhase: GamePhase) => {
    setPhase(newPhase);
  };

  useEffect(() => {
    const requestTarget = async () => {
      try {
        const response = await apiService.get<GameVoteInit>(
          `/game/vote/target/${stompApi.getCode()}`
        );
        setTarget(response.target);
      } catch {
        setTarget(null);
      }
    };

    const requestVotes = async () => {
      try {
        const response = await apiService.get<GameVoteCast>(
          `/game/vote/state/${stompApi.getCode()}`
        );
        setVotes(response);
      } catch {
        setVotes(null);
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

    requestPhase();
    requestTarget();
    requestVotes();

    gameApi.onVoteCast(handleVoteCast);
    gameApi.onPhase(handlePhase);
    gameApi.onVoteInit(handleVoteInit);

    return () => {
      gameApi.removeVoteCastHandler(handleVoteCast);
      gameApi.removePhaseHanlder(handlePhase);
      gameApi.removeVoteInitHandler(handleVoteInit);
    };
  }, [apiService, gameApi]);

  useEffect(() => {
    if (phase === GamePhase.VOTE) {
      const requestTimer = async () => {
        try {
          const response = await apiService.get<Timer>(
            `/game/timer/${stompApi.getCode()}?phase=VOTE`
          );
          setTimeLeft(response.remainingSeconds);
        } catch (error) {
          console.error("Failed to fetch vote timer:", error);
        }
      };
      requestTimer();
    }
  }, [phase, apiService]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const startTime = Date.now();
    const expectedEnd = startTime + timeLeft * 1000;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((expectedEnd - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  if (phase !== GamePhase.VOTE) {
    return null;
  }

  return (
    <Frame hug={true}>
      <VerticalFlex hug={true}>
        <HorizontalFlex>
          <HorizontalFlex>
            <span>
              Would you like to vote {target ?? "unknown"} out?{" "}
              <span className="votingTimer">
                ({timeLeft !== null ? formatTime(timeLeft) : "No Timer"})
              </span>
            </span>
          </HorizontalFlex>
        </HorizontalFlex>
        <HorizontalFlex>
          <Button onClick={voteYes}>Yes ({votes?.numberVotesTrue ?? 0})</Button>
          <Button onClick={voteNo}>No ({votes?.numberVotesFalse ?? 0})</Button>
        </HorizontalFlex>
      </VerticalFlex>
    </Frame>
  );
};
