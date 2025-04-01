import { IMessage } from "@stomp/stompjs";
import { connect, disconnect, getStompClient } from "./stompConnection";
import { GameSettings } from "@/types/gameSettings";
import { GameVoteInit } from "@/types/gameVoteInit";
import { GamePhase } from "@/types/gamePhase";
import { Player } from "@/types/player";
import { GameVoteCast } from "@/types/gameVoteCast";

type GameVoteInitHandler = (data: GameVoteInit) => void;
type GameSettingsHandler = (data: GameSettings) => void;
type GamePhaseHandler = (phase: GamePhase) => void;
type GameVoteCastHandler = (vote: GameVoteCast) => void;
type PlayerHandler = (player: Player) => void;

export class Game {
  private client;
  private gameVoteInitHandlers: GameVoteInitHandler[] = [];
  private gameSettingsHandlers: GameSettingsHandler[] = [];
  private gamePhaseHandlers: GamePhaseHandler[] = [];
  private gameVoteCastHandlers: GameVoteCastHandler[] = [];
  private playerHandlers: PlayerHandler[] = [];
  private connected: boolean = false;

  constructor(nickname: string, code: string) {
    this.client = getStompClient(nickname, code);

    this.client.onConnect = () => {
      console.log("STOMP connected.");
      this.connected = true;
      this.subscribeToTopics(code);
    };
  }

  private subscribeToTopics(code: string) {
    this.subscribe(`/topic/vote/init/${code}`, this.gameVoteInitHandlers);
    this.subscribe(`/topic/vote/cast/${code}`, this.gameVoteCastHandlers);
    this.subscribe(`/topic/settings/${code}`, this.gameSettingsHandlers);
    this.subscribe(`/topic/phase/${code}`, this.gamePhaseHandlers, true);
    this.subscribe(`/topic/players/${code}`, this.playerHandlers);
  }

  private subscribe<T>(
    destination: string,
    handlers: ((data: T) => void)[],
    isEnum = false,
  ) {
    this.client.subscribe(destination, (message: IMessage) => {
      try {
        const body = isEnum
          ? JSON.parse(message.body) as T
          : message.body as unknown as T;
        handlers.forEach((handler) => handler(body));
      } catch (err) {
        console.error(`Failed to parse message from ${destination}:`, err);
      }
    });
  }

  connect() {
    if (!this.client.active) {
      connect(this.client);
    }
  }

  disconnect() {
    if (this.client.active) {
      disconnect(this.client);
      this.connected = false;
    }
  }

  // Check if STOMP (WebSocket) is connected
  private ensureConnected(): boolean {
    if (!this.connected) {
      console.warn("STOMP client not connected. Message not sent.");
      return false;
    }
    return true;
  }

  // Initiate a vote on another player
  sendVoteInit(gameVoteInit: GameVoteInit) {
    if (this.ensureConnected()) {
      this.client.publish({
        destination: `/app/vote/init`,
        body: JSON.stringify(gameVoteInit),
      });
    }
  }

  // Publish change in game settings
  sendSettings(gameSettings: GameSettings) {
    if (this.ensureConnected()) {
      this.client.publish({
        destination: `/app/settings`,
        body: JSON.stringify(gameSettings),
      });
    }
  }

  // Send your vote during the voting phase (yes: True, no: False)
  sendVoteCast(vote: boolean) {
    if (this.ensureConnected()) {
      this.client.publish({
        destination: `/app/vote/cast`,
        body: JSON.stringify({ vote }),
      });
    }
  }

  // Start the game
  sendStartGame() {
    if (this.ensureConnected()) {
      this.client.publish({
        destination: `/app/game/start`,
        body: JSON.stringify({ phase: GamePhase.GAME }),
      });
    }
  }

  // Kick a player
  sendKickPlayer(nickname: string) {
    if (this.ensureConnected()) {
      this.client.publish({
        destination: `/app/player/kick`,
        body: JSON.stringify({ nickname }),
      });
    }
  }

  // Register callback on reception of voting initialisation
  onVoteInit(handler: GameVoteInitHandler) {
    this.gameVoteInitHandlers.push(handler);
  }

  // Register callback on reception of game settings change
  onSettings(handler: GameSettingsHandler) {
    this.gameSettingsHandlers.push(handler);
  }

  // Register callback on reception of game phase change
  onPhase(handler: GamePhaseHandler) {
    this.gamePhaseHandlers.push(handler);
  }

  // Register callback on reception of changes in players
  onPlayers(handler: PlayerHandler) {
    this.playerHandlers.push(handler);
  }

  // Register callback on reception of new vote casts during voting phase (to display total votes)
  onVoteCast(handler: GameVoteCastHandler) {
    this.gameVoteCastHandlers.push(handler);
  }
}
