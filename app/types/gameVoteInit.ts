export type GameVoteInit = {
  target: string; // the player who is targeted by the vote
};

export function isGameVoteInit(data: GameVoteInit): data is GameVoteInit {
  return typeof data === "object" && data !== null &&
    typeof data.target === "string";
}
