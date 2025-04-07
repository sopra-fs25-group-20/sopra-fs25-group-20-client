import { useEffect, useRef } from "react";
import { stompApi } from "@/api/stompApi";

type Player = {
  nickname: string;
  color: string;
};

type PlayerHandler = (players: Player[]) => void;

interface GameMessage {
  players?: Player[];
  [key: string]: any;
}

export const usePlayers = () => {
  const handlers = useRef<PlayerHandler[]>([]);

  const onPlayers = (callback: PlayerHandler) => {
    handlers.current.push(callback);
  };

  const removePlayersHandler = (callback: PlayerHandler) => {
    handlers.current = handlers.current.filter((h) => h !== callback);
  };

  useEffect(() => {
    stompApi.subscribe<GameMessage>(`/topic/players/${stompApi.getCode()}`, [
      (message) => {
        console.log("[WS] Incoming message:", message);
        const players = message.players;
        if (players) {
          console.log("[WS] Updating players:", players);
          handlers.current.forEach((cb) => cb(players));
        }
      },
    ]);
  }, []);

  return {
    onPlayers,
    removePlayersHandler,
  };
};
