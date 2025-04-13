"use client";
import { stompApi } from "./stompApi";
import { GameSettings } from "@/types/gameSettings";
import { GameVoteInit } from "@/types/gameVoteInit";
import { GamePhase } from "@/types/gamePhase";
import { Player } from "@/types/player";
import { GameVoteCast } from "@/types/gameVoteCast";
import { GameStart } from "@/types/gameStart";

type GameVoteInitHandler = (data: GameVoteInit) => void;
type GameSettingsHandler = (data: GameSettings) => void;
type GamePhaseHandler = (phase: GamePhase) => void;
type GameVoteCastHandler = (vote: GameVoteCast) => void;
type PlayerHandler = (players: Player[]) => void;
type GameStartHandler = (data: GameStart) => void;

export class GameAPI {
  private gameVoteInitHandlers: GameVoteInitHandler[] = [];
  private gameSettingsHandlers: GameSettingsHandler[] = [];
  private gamePhaseHandlers: GamePhaseHandler[] = [];
  private gameVoteCastHandlers: GameVoteCastHandler[] = [];
  private playerHandlers: PlayerHandler[] = [];
  private gameStartHandlers: GameStartHandler[] = [];
  private gamePhase: GamePhase;

  constructor() {
    const code = stompApi.getCode();
    this.subscribeToTopics(code);
    this.gamePhase = GamePhase.LOBBY;
  }

  private subscribeToTopics(code: string) {
    stompApi.subscribe<GameVoteInit>(`/topic/vote/init/${code}`, [
      (data) => this.handleVoteInit(data),
    ]);
    stompApi.subscribe<GameVoteCast>(`/topic/vote/cast/${code}`, [
      (data) => this.handleVoteCast(data),
    ]);
    stompApi.subscribe<GameSettings>(`/topic/settings/${code}`, [
      (data) => this.handleSettings(data),
    ]);
    stompApi.subscribe<GamePhase>(`/topic/phase/${code}`, [
      (data) => this.handlePhase(data),
    ]);
    stompApi.subscribe<{ players: Player[] }>(`/topic/players/${code}`, [
      (data) => this.handlePlayers(data),
    ]);
    stompApi.subscribe<GameStart>(`/user/queue/game/start${code}`, [
      (data) => this.handleGameStart(data),
    ]);
  }

  private handleVoteInit(data: GameVoteInit) {
    this.gameVoteInitHandlers.forEach((handler) => handler(data));
  }

  private handleVoteCast(data: GameVoteCast) {
    this.gameVoteCastHandlers.forEach((handler) => handler(data));
  }

  private handleSettings(data: GameSettings) {
    this.gameSettingsHandlers.forEach((handler) => handler(data));
  }

  private handlePhase(data: GamePhase) {
    this.gamePhase = data;
    this.gamePhaseHandlers.forEach((handler) => handler(data));
  }

  private handlePlayers(data: { players: Player[] }) {
    if (Array.isArray(data.players)) {
      this.playerHandlers.forEach((handler) => handler(data.players));
    }
  }

  private handleGameStart(data: GameStart) {
    this.gameStartHandlers.forEach((handler) => handler(data));
  }

  sendVoteInit(gameVoteInit: GameVoteInit) {
    stompApi.send(`/app/vote/init`, JSON.stringify(gameVoteInit));
  }

  sendSettings(gameSettings: GameSettings) {
    stompApi.send(`/app/settings`, JSON.stringify(gameSettings));
  }

  sendVoteCast(vote: boolean) {
    stompApi.send(`/app/vote/cast`, JSON.stringify(vote));
  }

  sendStartGame() {
    stompApi.send(`/app/game/start`, JSON.stringify(GamePhase.GAME));
  }

  sendKickPlayer(nickname: string) {
    stompApi.send(`/app/player/kick`, JSON.stringify(nickname));
  }

  sendGuess(imageId: number) {
    stompApi.send(`/app/settings`, JSON.stringify(imageId));
  }

  onVoteInit(handler: GameVoteInitHandler) {
    this.gameVoteInitHandlers.push(handler);
  }

  onSettings(handler: GameSettingsHandler) {
    this.gameSettingsHandlers.push(handler);
  }

  onPhase(handler: GamePhaseHandler) {
    this.gamePhaseHandlers.push(handler);
  }

  onPlayers(handler: PlayerHandler) {
    this.playerHandlers.push(handler);
  }

  onGameStart(handler: GameStartHandler) {
    this.gameStartHandlers.push(handler);
  }

  removePlayersHandler(callback: PlayerHandler) {
    this.playerHandlers = this.playerHandlers.filter((h) => h !== callback);
  }

  onVoteCast(handler: GameVoteCastHandler) {
    this.gameVoteCastHandlers.push(handler);
  }

  getGamePhase() {
    return this.gamePhase;
  }
}
