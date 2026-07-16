/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

// Configure localforage database
localforage.config({
  name: "LaPlumeAfrica",
  storeName: "app_state"
});

// Custom storage adapter using localforage (IndexedDB fallback to WebSQL/localStorage)
const localForageStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await localforage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

interface AppState {
  currentView: string;
  userXP: number;
  userStreak: number;
  registeredName: string;
  isPremium: boolean;
  
  setCurrentView: (view: string) => void;
  gainXP: (amount: number) => void;
  incrementStreak: () => void;
  setRegisteredName: (name: string) => void;
  setIsPremium: (isPremium: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: "landing",
      userXP: 680,
      userStreak: 12,
      registeredName: "Johnfavour",
      isPremium: false,

      setCurrentView: (view) => set({ currentView: view }),
      gainXP: (amount) => set((state) => ({ userXP: state.userXP + amount })),
      incrementStreak: () => set((state) => ({ userStreak: state.userStreak + 1 })),
      setRegisteredName: (name) => set({ registeredName: name }),
      setIsPremium: (premium) => set({ isPremium: premium }),
    }),
    {
      name: "la-plume-app-store",
      storage: createJSONStorage(() => localForageStorage),
    }
  )
);
