import { ChatAPI } from "@/api/chatAPI";
import { useMemo } from "react";

export const useChat = () => {
  return useMemo(() => new ChatAPI(), []);
};
