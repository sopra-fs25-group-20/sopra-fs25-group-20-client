import { getChatWebsocketDomain } from "@/utils/domain";
import { ChatMessage, isChatMessage } from "@/types/chatMessage";
type MessageHandler = (data: ChatMessage) => void;

export class Chat {
  private baseURL: string;
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];

  constructor() {
    this.baseURL = getChatWebsocketDomain();
  }

  connect(roomCode: string) {
    if (this.socket) return;

    this.socket = new WebSocket(this.baseURL);

    this.socket.onopen = () => {
      console.log("WebSocket connected.");
      this.socket?.send(JSON.stringify({ type: "join", message: roomCode }));
    };

    // Call each registered message handler when receiving a message from backend
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (isChatMessage(data)) {
          this.messageHandlers.forEach((handler) => handler(data));
        } else {
          console.warn("Invalid message format:", data);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket closed.");
      this.socket = null;
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  send(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "message", message: message }));
    } else {
      console.warn("WebSocket is not open. Message not sent.");
    }
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
