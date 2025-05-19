export type Summary = {
  roles: Record<string, string>;
  colors: Record<string, string>;
  highlightedImageIndex: number;
  spyGuessIndex: number;
  votedNickname: string | null;
  winnerRole: string;
};
