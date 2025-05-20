"use client";

import { useGame } from "@/hooks/useGame";
import { Button } from "./Button";
import { Frame } from "./frame";
import { HorizontalFlex } from "./horizontalFlex";
import { VerticalFlex } from "./verticalFlex";
import { useEffect, useState } from "react";
import { GameVoteCast } from "@/types/gameVoteCast";
import { useApi } from "@/hooks/useApi";
import { GameVoteInit } from "@/types/gameVoteInit";
import { stompApi } from "@/api/stompApi";
import { GamePhase } from "@/types/gamePhase";
import { useCountdownTimer, formatTime } from "@/hooks/useCountdownTimer";

type Timer = {
  remainingSeconds: number;
};

type Props = {
  phase: GamePhase;
};

export const Voting = ({ phase }: Props) => {
  const gameApi = useGame();
  const apiService = useApi();
  const [votes, setVotes] = useState<GameVoteCast | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [rawTime, setRawTime] = useState<number | null>(null);
  const timeLeft = useCountdownTimer(rawTime);

  const voteYes = () => gameApi.sendVoteCast(true);
  const voteNo = () => gameApi.sendVoteCast(false);

  const handleVoteInit = (vote: GameVoteInit) => setTarget(vote.target);
  const handleVoteCast = (votes: GameVoteCast) => setVotes(votes);

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

    requestTarget();
    requestVotes();

    gameApi.onVoteCast(handleVoteCast);
    gameApi.onVoteInit(handleVoteInit);

    return () => {
      gameApi.removeVoteCastHandler(handleVoteCast);
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
          setRawTime(response.remainingSeconds);
        } catch (error) {
          console.error("Failed to fetch vote timer:", error);
        }
      };
      requestTimer();
    } else {
      setRawTime(null);
    }
  }, [phase, apiService]);

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
                ({timeLeft !== null ? formatTime(timeLeft) : "00:00"})
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
