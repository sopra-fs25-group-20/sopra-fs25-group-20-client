import { Client } from "@stomp/stompjs";
import { getStompBrokerDomain } from "@/utils/domain";

let client: Client | null = null;

export const getStompClient = (nickname: string, code: string) => {
  if (!client) {
    client = new Client({
      brokerURL: `${getStompBrokerDomain()}?code=${
        encodeURIComponent(code)
      }&nickname=${encodeURIComponent(nickname)}`,
      reconnectDelay: 5000,
      debug: (str) => console.debug(`[STOMP] ${str}`),
    });

    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    client.onWebSocketClose = () => {
      console.log("WebSocket disconnected.");
    };
  }
  return client;
};

export const connect = (client: Client) => {
  if (!client.active) {
    client.activate();
  }
};

export const disconnect = (client: Client) => {
  if (client.active) {
    client.deactivate();
  }
};
