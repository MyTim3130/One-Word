import { create } from "zustand";
const initialSettingsState = {
  time: 10,
  maxWords: 15,

    
};


const useSettingsStore = create((set) => ({
  settings: initialSettingsState,
  setSettings: (settings) => set({ settings }),
}));

export default useSettingsStore;
