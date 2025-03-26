import process from "process";
import { isProduction } from "@/utils/environment";

export function getApiDomain(): string {
  const prodUrl = process.env.BACKEND_URL ||
    "https://backend.spyquest.whtvr.ch/";
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}

export function getStompBrokerDomain(): string {
  const prodUrl = process.env.BROKER_URL ||
    "wss://backend.spyquest.whtvr.ch:8080/ws";
  const devUrl = "ws://localhost:8080/ws";
  return isProduction() ? prodUrl : devUrl;
}
