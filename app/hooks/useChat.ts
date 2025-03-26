import { Chat } from "@/api/chat";
import { useMemo } from "react";

export const useChat = () => {
  return useMemo(() => new Chat(), []);
};
