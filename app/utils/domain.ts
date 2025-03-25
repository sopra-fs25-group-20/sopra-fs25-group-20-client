import process from "process";
import { isProduction } from "@/utils/environment";

export function getApiDomain(): string {
  const prodUrl = process.env.BACKEND_URL ||
    "https://backend.spyquest.whtvr.ch/";
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

export function getGameWebsocketDomain(): string {
  const prodUrl = process.env.BACKEND_URL ||
    "wss://backend.spyquest.whtvr.ch:8080/ws/game";
  const devUrl = "ws://localhost:8081";
  return isProduction() ? prodUrl : devUrl;
}

export function getChatWebsocketDomain(): string {
  const prodUrl = process.env.BACKEND_URL ||
    "wss://backend.spyquest.whtvr.ch:8080/ws/chat";
  const devUrl = "ws://localhost:8082";
  return isProduction() ? prodUrl : devUrl;
}
