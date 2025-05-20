"use client";
import { stompApi } from "@/api/stompApi";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { Player } from "@/types/player";
import { useEffect } from "react";
import { FaBan } from "react-icons/fa";
import { Frame } from "./frame";
import { OverflowContainer } from "./overflowContainer";
import { Button } from "./Button";
import { useIsRoomAdmin } from "@/hooks/isRoomAdmin";
import { ClickablePlayerName } from "./clickablePlayerName";
import { useRouter } from "next/navigation";

type Props = {
  phase: GamePhase;
  players: Player[];
};

export const PlayerOverview = ({ phase, players }: Props) => {
  const router = useRouter();
  const isRoomAdmin = useIsRoomAdmin();
  const gameApi = useGame();

  // If you are not present, it means you have been kicked. Route back to '/'
  useEffect(() => {
    if (!players.length) return;
    const nickname = stompApi.getNickname();
    const isPresent = players.some((player) => player.nickname === nickname);
    if (!isPresent) {
      router.push("/");
    }
  }, [players, router]);

  const nickname = stompApi.getNickname();
  const selfPlayer = players.find((p) => p.nickname === nickname);
  const otherPlayers = players.filter((p) => p.nickname !== nickname);

  const getAction = (player: Player) => {
    if (!phase || nickname === player.nickname) return null;

    switch (phase) {
      case GamePhase.LOBBY:
      case GamePhase.SUMMARY:
        return isRoomAdmin ? (
          <div className="action">
            <FaBan
              className="ban-icon"
              color={player.color}
              onClick={() => gameApi.sendKickPlayer(player.nickname)}
            />
          </div>
        ) : null;
      case GamePhase.GAME:
        return (
          <Button
            onClick={() => gameApi.sendVoteInit({ target: player.nickname })}
            className="hug"
          >
            Vote Out
          </Button>
        );
      default:
        return null;
    }
  };

  const getProfileCard = (player: Player) => {
    const isSelf = nickname === player.nickname;
    const profileClass = isSelf ? "you" : "other";
    return (
      <div className={`profile ${profileClass}`}>
        <div
          className={`icon ${profileClass}`}
          style={{ background: player.color }}
        ></div>
        <div
          className={`player ${profileClass}`}
          style={{ color: player.color }}
        >
          <ClickablePlayerName className="name" player={player} />
          <div className="stats">
            {player.account ? `${player.account.wins} Wins` : "Guest"}
            {player.admin && " (Admin)"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Frame className="overview">
      {selfPlayer && (
        <div className="profile-card">
          {getProfileCard(selfPlayer)}
          {getAction(selfPlayer)}
        </div>
      )}
      <OverflowContainer>
        {otherPlayers.map((player) => (
          <div key={player.nickname} className="profile-card">
            {getProfileCard(player)}
            {getAction(player)}
          </div>
        ))}
      </OverflowContainer>
    </Frame>
  );
};
