"use client";
import { ApiService } from "@/api/apiService";
import { useMemo } from "react";

export const useApi = () => {
  return useMemo(() => new ApiService(), []);
};
