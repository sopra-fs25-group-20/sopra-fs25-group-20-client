import { GameAPI } from "@/api/gameAPI";
import { useMemo } from "react";

let gameInstance: GameAPI | null = null;

export const useGame = () => {
  return useMemo(() => {
    if (!gameInstance) {
      gameInstance = new GameAPI();
    }
    return gameInstance;
  }, []);
};
