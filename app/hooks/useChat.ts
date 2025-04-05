import { ChatAPI } from "@/api/chatAPI";
import { useMemo } from "react";

let chatInstance: ChatAPI | null = null;

export const useChat = () => {
  return useMemo(() => {
    if (!chatInstance) {
      chatInstance = new ChatAPI();
    }
    return chatInstance;
  }, []);
};
