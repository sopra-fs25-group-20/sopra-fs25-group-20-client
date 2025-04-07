"use client";
import { useEffect, useRef, useState } from "react";
import { Box } from "@/components/Box";
import { FaBan } from "react-icons/fa";
import { stompApi } from "@/api/stompApi";
import { GameAPI } from "@/api/gameAPI";
import { Player } from "@/types/player";

export const PlayerOverview = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const apiRef = useRef<GameAPI | null>(null);

  const currentNickname = stompApi.getNickname();
  const adminNickname =
    typeof window !== "undefined"
      ? localStorage.getItem("roomAdmin")
      : null;
  const isAdmin = currentNickname === adminNickname;

  useEffect(() => {
    if (!apiRef.current) {
      apiRef.current = new GameAPI();
    }

    apiRef.current.onPlayers((players) => {
      setPlayers(players);
    });
  }, []);

  const handleKick = (nickname: string) => {
    if (!apiRef.current) return;
    if (nickname === currentNickname) return; // don't allow self-kick
    apiRef.current.sendKickPlayer(nickname);
  };

  return (
    <Box className="card-box player-overview">
      {players.map((player, index) => {
        const isYou = player.nickname === currentNickname;

        return (
          <div
            key={index}
            className="d-flex justify-between align-items-center mb-2"
          >
            <div className="d-flex align-items-center gap-2">
              <div
                className="player-color"
                style={{ backgroundColor: player.color }}
              />
              <div
                className={`player-name ${isYou ? "you" : ""}`}
                style={{ color: player.color }}
              >
                {player.nickname}
              </div>
            </div>
            {isAdmin && !isYou && (
              <FaBan
                className="ban-icon"
                color={player.color}
                style={{ cursor: "pointer" }}
                onClick={() => handleKick(player.nickname)}
              />
            )}
          </div>
        );
      })}
    </Box>
  );
};
