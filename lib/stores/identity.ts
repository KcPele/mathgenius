'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface IdentityState {
  sessionId: string;
  displayName: string;
  hydrated: boolean;
  setDisplayName: (name: string) => void;
  setHydrated: () => void;
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return (
    Date.now().toString(16) +
    '-' +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2)
  );
}

function defaultDisplayName(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Guest-${suffix}`;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      sessionId: generateSessionId(),
      displayName: defaultDisplayName(),
      hydrated: false,
      setDisplayName: (name) => {
        const trimmed = name.trim().slice(0, 40);
        if (trimmed.length === 0) return;
        set({ displayName: trimmed });
      },
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'stargirl_identity',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        displayName: state.displayName,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
