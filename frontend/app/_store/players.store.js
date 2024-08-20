import { create } from "zustand";
const initialPlayersState = [];


const usePlayersStore = create((set) => ({
  players: initialPlayersState,
  setPlayers: (players) => set({ players }),	
}));

export default usePlayersStore;
