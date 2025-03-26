import { Client, IMessage } from "@stomp/stompjs";
import { getChatWebsocketDomain } from "@/utils/domain";
import { ChatMessage, isChatMessage } from "@/types/chatMessage";

type MessageHandler = (data: ChatMessage) => void;

export class Chat {
  private client: Client;
  private messageHandlers: MessageHandler[] = [];
  private connected: boolean = false;

  constructor() {
    const brokerURL = getChatWebsocketDomain();

    this.client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      debug: (str) => console.debug(`[STOMP] ${str}`),
    });

    this.client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    this.client.onWebSocketClose = () => {
      console.log("WebSocket disconnected.");
      this.connected = false;
    };

    this.client.onConnect = () => {
      console.log("STOMP connected.");
      this.connected = true;

      // Call each registered message handler when receiving a message from backend
      this.client.subscribe(`/topic/chat`, (message: IMessage) => {
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

  // Connect to backend using 'nickname' and game room 'code' in header
  connect(nickname: string, code: string) {
    if (this.connected || this.client.active) return;

    this.client.connectHeaders = {
      nickname,
      code,
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
      this.connected = false;
    }
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
