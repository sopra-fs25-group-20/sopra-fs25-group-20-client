import { Game } from "@/api/game";
import { useMemo } from "react";

export const useGame = (nickname: string, code: string) => {
  return useMemo(() => new Game(nickname, code), [nickname, code]);
};
