import { Account } from "./account";

export type Player = {
  nickname: string;
  color: string;
  admin: boolean;
  account: Account | null;
};

export function isPlayer(data: Player): data is Player {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.nickname === "string" &&
    typeof data.color === "string" &&
    typeof data.admin === "boolean" &&
    data.account !== null &&
    typeof data.account === "object"
  );
}
