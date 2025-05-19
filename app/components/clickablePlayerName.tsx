"use client";
import { Player } from "@/types/player";

type Props = {
  player: Player;
  className?: string;
};

export const ClickablePlayerName = ({ player, className = "" }: Props) => {
  if (player.account && player.account.username) {
    return (
      <a
        href={`/profile/${player.account.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`player-link ${className}`}
      >
        {player.nickname}
      </a>
    );
  }

  return (
    <div className={className}>
      {player.nickname}
    </div>
  );
};
