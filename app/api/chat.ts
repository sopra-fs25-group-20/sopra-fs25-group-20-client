import { IMessage } from "@stomp/stompjs";
import { ChatMessage, isChatMessage } from "@/types/chatMessage";
import { connect, disconnect, getStompClient } from "./stompConnection";

type MessageHandler = (data: ChatMessage) => void;

export class Chat {
  private client;
  private messageHandlers: MessageHandler[] = [];
  private connected: boolean = false;

  constructor(nickname: string, code: string) {
    this.client = getStompClient(nickname, code);

    this.client.onConnect = () => {
      console.log("STOMP connected.");
      this.connected = true;

      // Call each registered message handler when receiving a message from backend
      this.client.subscribe(`/topic/chat/${code}`, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body);
          if (isChatMessage(body)) {
            this.messageHandlers.forEach((handler) => handler(body));
          } else {
            console.warn("Invalid chat message:", body);
          }
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      });
    };
  }

  connect() {
    connect(this.client);
  }

  disconnect() {
    disconnect(this.client);
    this.connected = false;
  }

  send(message: string) {
    if (!this.connected) {
      console.warn("STOMP client not connected. Message not sent.");
      return;
    }

    this.client.publish({
      destination: `/app/chat`,
      body: JSON.stringify({ message }),
    });
  }

  // Interface for other functions to register a function that handles the incoming data
  // when a message is being received from the backend.
  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}
