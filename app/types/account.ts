export type Account = {
  userId: number;
  username: string;
  wins: number;
  defeats: number;
  games: number;
  current_streak: number;
  highest_streak: number;
};

export function isAccount(data: Account): data is Account {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.userId === "number" &&
    typeof data.username === "string" &&
    typeof data.wins === "number" &&
    typeof data.defeats === "number" &&
    typeof data.games === "number" &&
    typeof data.current_streak === "number" &&
    typeof data.highest_streak === "number"
  );
}
