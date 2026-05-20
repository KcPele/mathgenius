'use client';

import { useEffect } from 'react';
import { realtimeClient } from './client';
import { useIdentityStore } from '@/lib/stores/identity';
import { useRealtimeStore } from '@/lib/stores/realtime';

export function useRealtime() {
  const sessionId = useIdentityStore((s) => s.sessionId);
  const displayName = useIdentityStore((s) => s.displayName);
  const hydrated = useIdentityStore((s) => s.hydrated);

  const setStatus = useRealtimeStore((s) => s.setStatus);
  const setUsers = useRealtimeStore((s) => s.setUsers);
  const addNotification = useRealtimeStore((s) => s.addNotification);

  useEffect(() => {
    const offEvent = realtimeClient.onEvent((event) => {
      switch (event.type) {
        case 'welcome':
        case 'users_updated':
          setUsers(event.users);
          break;
        case 'shared':
          addNotification(event.notification);
          break;
        case 'share_ack':
        case 'error':
          break;
      }
    });
    const offStatus = realtimeClient.onStatus(setStatus);
    return () => {
      offEvent();
      offStatus();
    };
  }, [setStatus, setUsers, addNotification]);

  useEffect(() => {
    if (!hydrated) return;
    realtimeClient.connect({ sessionId, displayName });
    return () => {
      realtimeClient.disconnect();
    };
  }, [hydrated, sessionId, displayName]);
}
