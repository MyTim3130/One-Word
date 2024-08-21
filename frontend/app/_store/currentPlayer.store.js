import { create } from "zustand";
const initialCurrentPlayerState = "";


const useCurrentPlayerStore = create((set) => ({
  currentPlayer: initialCurrentPlayerState,
  setCurrentPlayer: (currentPlayer) => set({ currentPlayer }),	
}));

export default useCurrentPlayerStore;
