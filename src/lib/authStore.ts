import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '../types/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserProfile) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'authora-auth',
    },
  ),
)
