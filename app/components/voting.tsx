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

export const Voting = () => {
  const gameApi = useGame();
  const apiService = useApi();
  const [votes, setVotes] = useState<GameVoteCast | null>(null);
  const [phase, setPhase] = useState<GamePhase | null>(null);
  const [target, setTarget] = useState<string | null>(null);

  const voteYes = () => {
    gameApi.sendVoteCast(true);
  };

  const voteNo = () => {
    gameApi.sendVoteCast(false);
  };

  const handleVoteInit = (vote: GameVoteInit) => {
    setTarget(vote.target);
  };

  const handleVoteCast = (votes: GameVoteCast) => {
    setVotes(votes);
  };

  const handlePhase = (phase: GamePhase) => {
    setPhase(phase);
  };

  useEffect(() => {
    const requestTarget = async () => {
      try {
        const response = await apiService.get<GameVoteInit>(
          `/game/vote/target/${stompApi.getCode()}`,
        );
        setTarget(response.target);
      } catch {
        setTarget(null);
      }
    };

    const requestVotes = async () => {
      try {
        const response = await apiService.get<GameVoteCast>(
          `/game/vote/state/${stompApi.getCode()}`,
        );
        setVotes(response);
      } catch {
        setVotes(null);
      }
    };

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

  if (phase !== GamePhase.VOTE) {
    return null;
  }

  return (
    <Frame hug={true}>
      <VerticalFlex hug={true}>
        <HorizontalFlex>
          Would you like to vote {target ?? "unknown"} out?
        </HorizontalFlex>
        <HorizontalFlex>
          <Button onClick={voteYes}>Yes ({votes?.numberVotesTrue ?? 0})</Button>
          <Button onClick={voteNo}>No ({votes?.numberVotesFalse ?? 0})</Button>
        </HorizontalFlex>
      </VerticalFlex>
    </Frame>
  );
};
