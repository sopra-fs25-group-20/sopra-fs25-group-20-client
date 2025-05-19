import { create } from "zustand";
import { Player } from "@/types/player";

interface PlayersState {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export const usePlayersStore = create<PlayersState>((set) => ({
  players: [],
  setPlayers: (players) => set({ players }),
}));
