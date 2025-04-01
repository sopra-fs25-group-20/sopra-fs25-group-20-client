import { IMessage } from "@stomp/stompjs";
import { connect, disconnect, getStompClient } from "./stompConnection";
import { GameSettings } from "@/types/gameSettings";
import { GameVoteInit } from "@/types/gameVoteInit";

type VoteHandler = (data: GameVoteInit) => void;
type SettingsHandler = (data: GameSettings) => void;

export class Game {
  private client;
  private voteHandlers: VoteHandler[] = [];
  private settingsHandlers: SettingsHandler[] = [];
  private connected: boolean = false;

  constructor(nickname: string, code: string) {
    this.client = getStompClient(nickname, code);

    this.client.onConnect = () => {
      console.log("STOMP connected.");
      this.connected = true;
      this.client.subscribe(`/topic/vote/init/${code}`, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body);
          this.voteHandlers.forEach((handler) => handler(body));
        } catch (err) {
          console.error("Failed to parse vote message:", err);
        }
      });

      this.client.subscribe(`/topic/settings/${code}`, (message: IMessage) => {
        try {
          const body = JSON.parse(message.body);
          this.settingsHandlers.forEach((handler) => handler(body));
        } catch (err) {
          console.error("Failed to parse settings message:", err);
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

  // Initiate a vote on another player
  startVote(gameVote: GameVoteInit) {
    if (!this.connected) {
      console.warn("STOMP client not connected. Vote not sent.");
      return;
    }
    this.client.publish({
      destination: `/app/vote/init`,
      body: JSON.stringify(gameVote),
    });
  }

  // Publish change in game settings
  sendSettings(gameSettings: GameSettings) {
    if (!this.connected) {
      console.warn("STOMP client not connected. Settings not sent.");
      return;
    }
    this.client.publish({
      destination: `/app/settings`,
      body: JSON.stringify(gameSettings),
    });
  }

  // Register callback on reception of votes
  onVote(handler: VoteHandler) {
    this.voteHandlers.push(handler);
  }

  // Register callback on reception of settings
  onSettings(handler: SettingsHandler) {
    this.settingsHandlers.push(handler);
  }
}
