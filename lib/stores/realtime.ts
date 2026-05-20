'use client';

import { create } from 'zustand';
import type { ActiveUser, RealtimeNotification } from '@/lib/realtime/protocol';
import type { ConnectionStatus } from '@/lib/realtime/client';

interface RealtimeState {
  status: ConnectionStatus;
  users: ActiveUser[];
  notifications: RealtimeNotification[];
  setStatus: (status: ConnectionStatus) => void;
  setUsers: (users: ActiveUser[]) => void;
  addNotification: (notification: RealtimeNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
}

interface NotificationView extends RealtimeNotification {
  read: boolean;
}

// We store read-state in a Map keyed by notification id so it survives reorderings.
const readMap = new Map<string, boolean>();

function withRead(notifications: RealtimeNotification[]): NotificationView[] {
  return notifications.map((n) => ({ ...n, read: readMap.get(n.id) ?? false }));
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  status: 'idle',
  users: [],
  notifications: [],
  setStatus: (status) => set({ status }),
  setUsers: (users) => set({ users }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    })),
  markRead: (id) => {
    readMap.set(id, true);
    set((state) => ({ notifications: [...state.notifications] }));
  },
  markAllRead: () => {
    set((state) => {
      for (const n of state.notifications) readMap.set(n.id, true);
      return { notifications: [...state.notifications] };
    });
  },
  reset: () => {
    readMap.clear();
    set({ status: 'idle', users: [], notifications: [] });
  },
}));

export function useNotificationsView(): NotificationView[] {
  return withRead(useRealtimeStore((s) => s.notifications));
}

export function useUnreadCount(): number {
  return useRealtimeStore((s) => s.notifications.filter((n) => !readMap.get(n.id)).length);
}
