import process from "process";
import { isProduction } from "@/utils/environment";

export function getApiDomain(): string {
  const prodUrl = process.env.BACKEND_URL ||
    "https://backend.spyquest.whtvr.ch/";
  const devUrl = "http://localhost:8080";
  return isProduction() ? prodUrl : devUrl;
}
