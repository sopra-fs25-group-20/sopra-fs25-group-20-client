"use client";
import { ChatMessage } from "@/types/chatMessage";
import { stompApi } from "./stompApi";

type MessageHandler = (data: ChatMessage) => void;

export class ChatAPI {
  private messageHandlers: MessageHandler[] = [];

  constructor() {
    stompApi.subscribe<ChatMessage>(
      `/topic/chat/${stompApi.getCode()}`,
      [(data) => this.handleMessage(data)],
    );
  }

  private handleMessage(data: ChatMessage) {
    this.messageHandlers.forEach((handler) => handler(data));
  }

  send(message: string) {
    stompApi.send(`/app/chat`, JSON.stringify({ message }));
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}
