import { Chat } from "@/api/chat";
import { useMemo } from "react";

export const useChat = (nickname: string, code: string) => {
  return useMemo(() => new Chat(nickname, code), [nickname, code]);
};
