"use client";
import { Player } from "@/types/player";
import { getStompBrokerDomain } from "@/utils/domain";
import { Client, IMessage } from "@stomp/stompjs";

class StompAPI {
  private client: Client | null;
  private code: string | null;
  private nickname: string | null;
  private connectPromise: Promise<void> | null = null;
  private roomAdmin: string;
  private adminListeners: (() => void)[] = [];

  private subscriptions: Array<{
    destination: string;
    callback: (message: IMessage) => void;
  }> = [];

  constructor() {
    this.client = null;
    this.code = null;
    this.nickname = null;
    this.roomAdmin = "";
  }

  buildBrokerURL(): string {
    const code: string = this.getCode();
    const nickname: string = this.getNickname();
    const token = localStorage.getItem("token");
    let url = `${getStompBrokerDomain()}?code=${code}&nickname=${nickname}`;
    if (token) {
      url += `&token=${token.replace(/"/g, "")}`;
    }
    return url;
  }

  buildClient(): Client {
    return new Client({
      brokerURL: this.buildBrokerURL(),
      debug: (str) => console.debug(`[STOMP] ${str}`),
      reconnectDelay: 1000,
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
        this.subscriptions.forEach((s) =>
          client.subscribe(s.destination, s.callback)
        );
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

    const cb = (message: IMessage) => {
      try {
        const body = JSON.parse(message.body) as T;
        handlers.forEach((h) => h(body));
      } catch (err) {
        console.error(`Failed to parse message from ${destination}:`, err);
      }
    };

    client.subscribe(destination, cb);
    this.subscriptions.push({ destination, callback: cb });
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

  setRoomAdmin(players: Player[]) {
    for (const player of players) {
      if (player.admin && player.nickname === this.getNickname()) {
        this.roomAdmin = player.nickname;
        console.warn("You are the admin.");
        this.notifyAdminListeners();
        break;
      }
    }
  }

  isRoomAdmin() {
    return this.getNickname() === this.roomAdmin;
  }

  addAdminListener(listener: () => void) {
    this.adminListeners.push(listener);
  }

  removeAdminListener(listener: () => void) {
    this.adminListeners = this.adminListeners.filter((l) => l !== listener);
  }

  private notifyAdminListeners() {
    this.adminListeners.forEach((l) => l());
  }
}

export const stompApi = new StompAPI();
