export type GameStart = {
  highlightedImage: number;
  role: string;
};

export function isGameStart(data: GameStart): data is GameStart {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.highlightedImage === "number" &&
    typeof data.role === "string"
  );
}
