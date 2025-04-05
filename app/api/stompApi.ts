import { getStompBrokerDomain } from "@/utils/domain";
import { Client, IMessage } from "@stomp/stompjs";

class StompAPI {
  private client: Client | null;
  private isConnecting: boolean;

  constructor() {
    this.client = null;
    this.isConnecting = false;
  }

  buildBrokerURL(): string {
    const code: string = this.getCode();
    const nickname: string = this.getNickname();
    return `${getStompBrokerDomain()}?code=${code}&nickname=${nickname}`;
  }

  buildClient(): Client {
    return new Client({
      brokerURL: this.buildBrokerURL(),
      debug: (str) => console.debug(`[STOMP] ${str}`),
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        console.error("Details:", frame.body);
      },
      onWebSocketClose: () => {
        console.log("WebSocket disconnected.");
      },
    });
  }

  public getClient(): Client {
    if (!this.client) {
      this.client = this.buildClient();
    }
    return this.client;
  }

  async connect(): Promise<void> {
    const client = this.getClient();
    if (client.active || this.isConnecting) return;
    this.isConnecting = true;
    return new Promise((resolve) => {
      client.onConnect = () => {
        this.isConnecting = false;
        resolve();
      };
      client.activate();
    });
  }

  async ensureConnected(): Promise<void> {
    if (!this.client?.active && !this.isConnecting) {
      await this.connect();
    }
  }

  public async subscribe<T>(
    destination: string,
    handlers: ((data: T) => void)[],
  ): Promise<void> {
    await this.ensureConnected();
    const client = this.getClient();
    client.subscribe(destination, (message: IMessage) => {
      try {
        const body = JSON.parse(message.body) as T;
        handlers.forEach((handler) => handler(body));
      } catch (err) {
        console.error(`Failed to parse message from ${destination}:`, err);
      }
    });
  }

  public async send(destination: string, body: string): Promise<void> {
    await this.ensureConnected();
    const client = this.getClient();
    client.publish({ destination, body });
  }

  setNickname(nickname: string) {
    localStorage.setItem("clientNickname", nickname);
  }

  getNickname(): string {
    const nickname: string | null = localStorage.getItem("clientNickname");
    if (!nickname) {
      throw new Error("Nickname not set. Call setNickname(...) first.");
    }
    return nickname;
  }

  setCode(code: string) {
    localStorage.setItem("clientCode", code);
  }

  getCode(): string {
    const code: string | null = localStorage.getItem("clientCode");
    if (!code) {
      throw new Error("Code not set. Call setCode(...) first.");
    }
    return code;
  }
}

export const stompApi = new StompAPI();
