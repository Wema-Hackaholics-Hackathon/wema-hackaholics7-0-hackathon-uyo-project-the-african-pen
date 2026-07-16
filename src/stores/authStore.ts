import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  country: string
  school: string
  cohortId: string
  level: number
  xp: number
  streak: number
  isPremium: boolean
  trialExpired: boolean
  onboardingComplete: boolean
  rank: number
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  updateXP: (xp: number) => void
  updateStreak: (streak: number) => void
  setIsPremium: (isPremium: boolean) => void
  setOnboardingComplete: (complete: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Seed default user to match mock UI data and prevent immediate redirect on dev load
      user: {
        id: "1",
        name: "Johnfavour",
        email: "johnfavour@laplume.africa",
        country: "🇳🇬 Nigeria",
        school: "La Plume High School",
        cohortId: "cohort_1",
        level: 3,
        xp: 680,
        streak: 12,
        isPremium: false,
        trialExpired: false,
        onboardingComplete: true,
        rank: 4
      },
      token: "mock-development-token",
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      logout: () => set({ 
        user: null, 
        token: null 
      }),
      
      updateXP: (xp) => set((state) => ({
        user: state.user 
          ? { ...state.user, xp: typeof xp === 'function' ? (xp as any)(state.user.xp) : xp } 
          : null
      })),
      
      updateStreak: (streak) => set((state) => ({
        user: state.user 
          ? { ...state.user, streak: typeof streak === 'function' ? (streak as any)(state.user.streak) : streak } 
          : null
      })),

      setIsPremium: (isPremium) => set((state) => ({
        user: state.user
          ? { ...state.user, isPremium }
          : null
      })),

      setOnboardingComplete: (onboardingComplete) => set((state) => ({
        user: state.user
          ? { ...state.user, onboardingComplete }
          : null
      })),
    }),
    {
      name: 'laplume-auth',
    }
  )
)
