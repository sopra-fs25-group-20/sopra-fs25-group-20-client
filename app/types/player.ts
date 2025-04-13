import { Account } from "./account";

export type Player = {
  nickname: string;
  color: string;
  account: Account | null;
};

export function isPlayer(data: Player): data is Player {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.nickname === "string" &&
    typeof data.color === "string" &&
    data.account !== null &&
    typeof data.account === "object"
  );
}
