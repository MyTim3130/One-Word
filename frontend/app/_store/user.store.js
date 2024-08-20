import { create } from "zustand";
const initialUserState = {
  name: "",
    id: "",
    socket: "",
    host: false,
    words: [],
    
};


const useUserStore = create((set) => ({
  user: initialUserState,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
