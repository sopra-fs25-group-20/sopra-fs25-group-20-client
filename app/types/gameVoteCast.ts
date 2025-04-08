export type GameVoteCast = {
  numberVotesTrue: number;
  numberVotesFalse: number;
};

export function isGameVoteCast(data: GameVoteCast): data is GameVoteCast {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.numberVotesTrue === "number" &&
    typeof data.numberVotesFalse === "number"
  );
}
