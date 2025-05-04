export type GameVoteInit = {
  target: string;
};

export function isGameVoteInit(data: GameVoteInit): data is GameVoteInit {
  return typeof data === "object" && data !== null &&
    typeof data.target === "string";
}
