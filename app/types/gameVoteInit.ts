export type GameVoteInit = {
  nicknameInitiated: string; // the player who initiated the voting
  nicknameTargeted: string; // the player who is targeted by the vote
};

export function isGameVoteInit(data: GameVoteInit): data is GameVoteInit {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.nicknameInitiated === "string" &&
    typeof data.nicknameTargeted === "string"
  );
}
