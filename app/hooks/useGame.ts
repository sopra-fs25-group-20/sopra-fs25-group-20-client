"use client";
import { GameAPI } from "@/api/gameAPI";
import { useMemo } from "react";

export const useGame = () => {
  return useMemo(() => new GameAPI(), []);
};
