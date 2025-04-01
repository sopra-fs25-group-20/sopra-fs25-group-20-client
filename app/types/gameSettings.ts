export type GameSettings = {
  votingTimer: number;
  gameTimer: number;
  imageCount: number;
  imageRegion: string;
};

export function isSettings(data: GameSettings): data is GameSettings {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.votingTimer === "number" &&
    typeof data.gameTimer === "number" &&
    typeof data.imageCount === "number" &&
    typeof data.imageRegion === "string"
  );
}
