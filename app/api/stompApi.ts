"use client";
import { getStompBrokerDomain } from "@/utils/domain";
import { Client, IMessage } from "@stomp/stompjs";

class StompAPI {
  private client: Client | null;
  private code: string | null;
  private nickname: string | null;
  private connectPromise: Promise<void> | null = null;
  private roomAdmin: string;

  constructor() {
    this.client = null;
    this.code = null;
    this.nickname = null;
    this.roomAdmin = "";
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
        console.warn("WebSocket disconnected.");
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
    if (client.connected) {
      return;
    }
    if (this.connectPromise) {
      return this.connectPromise;
    }
    this.connectPromise = new Promise<void>((resolve, reject) => {
      client.onConnect = () => {
        console.warn("Websocket connected.");
        resolve();
      };
      client.onStompError = (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        console.error("Details:", frame.body);
        reject(frame);
      };
      client.activate();
    }).finally(() => {
      this.connectPromise = null;
    });
    return this.connectPromise;
  }

  public disconnect(): void {
    if (this.client) {
      if (this.client.active) {
        this.client.deactivate();
      }
      this.client = null;
    }
  }

  async ensureConnected(): Promise<void> {
    const client = this.getClient();
    if (!client.connected) {
      await this.connect();
    }
  }

  public async subscribe<T>(
    destination: string,
    handlers: ((data: T) => void)[],
  ): Promise<void> {
    const client = this.getClient();
    await this.ensureConnected();
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
    const client = this.getClient();
    await this.ensureConnected();
    client.publish({ destination, body });
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
    localStorage.setItem("clientNickname", nickname);
  }

  getNickname(): string {
    if (!this.nickname) {
      this.nickname = localStorage.getItem("clientNickname");
      if (!this.nickname) {
        throw new Error("Nickname not set. Call setNickname(...) first.");
      }
      console.warn("Loaded nickname and code from local storage.");
    }
    return this.nickname;
  }

  setCode(code: string) {
    this.code = code;
    localStorage.setItem("clientCode", code);
  }

  getCode(): string {
    if (!this.code) {
      this.code = localStorage.getItem("clientCode");
      if (!this.code) {
        throw new Error("Code not set. Call setCode(...) first.");
      }
    }
    return this.code;
  }

  setRoomAdmin(nickname: string) {
    this.roomAdmin = nickname;
  }

  public getRoomAdmin(): string | null {
    return this.roomAdmin ?? null;
  }
  

  /**
   * Check if the current 'owner' of this STOMP connection is also the room admin.
   */
  isRoomAdmin() {
    return this.getNickname() === this.roomAdmin;
  }
}

export const stompApi = new StompAPI();
