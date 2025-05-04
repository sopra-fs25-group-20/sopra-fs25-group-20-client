"use client";
import { ApplicationError } from "@/types/error";
import { getApiDomain } from "@/utils/domain";

export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = getApiDomain();
  }

  // Get default headers
  private getHeaders(withAuth: boolean): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    if (withAuth) {
      const token = globalThis.localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token.replace(/"/g, "")}`;
      }
    }

    return headers;
  }

  // Unified request
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    withAuth: boolean = true,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(withAuth);

    const options: RequestInit = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    return this.processResponse<T>(res);
  }

  // Process response and handle errors
  private async processResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      try {
        const errorInfo = await res.json();
        const reason = errorInfo?.reason || JSON.stringify(errorInfo) ||
          res.statusText;
        throw new ApplicationError(res.status, reason);
      } catch {
        throw new ApplicationError(res.status, res.statusText);
      }
    }
    const contentType = res.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      return res.json() as Promise<T>;
    } else if (contentType?.startsWith("image/")) {
      return res.blob() as Promise<T>;
    } else {
      return res.text() as unknown as Promise<T>; // fallback
    }
  }

  public get<T>(endpoint: string, withAuth: boolean = true): Promise<T> {
    return this.request("GET", endpoint, undefined, withAuth);
  }

  public post<T>(
    endpoint: string,
    data?: unknown,
    withAuth: boolean = false,
  ): Promise<T> {
    return this.request("POST", endpoint, data, withAuth);
  }

  public put<T>(
    endpoint: string,
    data: unknown,
    withAuth: boolean = true,
  ): Promise<T> {
    return this.request("PUT", endpoint, data, withAuth);
  }

  public delete<T>(endpoint: string, withAuth: boolean = true): Promise<T> {
    return this.request("DELETE", endpoint, undefined, withAuth);
  }
}
