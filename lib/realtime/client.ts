import type { MathQuestion } from '@/lib/types';
import { ServerEvent, serverEventSchema } from './protocol';

type Listener = (event: ServerEvent) => void;
type StatusListener = (status: ConnectionStatus) => void;

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'closed';

interface ConnectOptions {
  sessionId: string;
  displayName: string;
}

class RealtimeClient {
  private source: EventSource | null = null;
  private retryAttempt = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private current: ConnectOptions | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private status: ConnectionStatus = 'idle';

  onEvent(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  connect(options: ConnectOptions) {
    if (typeof window === 'undefined') return;
    this.current = options;
    this.openSource();
  }

  disconnect() {
    this.current = null;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.source) {
      this.source.close();
      this.source = null;
    }
    this.setStatus('closed');
  }

  private openSource() {
    if (!this.current) return;
    if (this.source) this.source.close();

    this.setStatus('connecting');
    const params = new URLSearchParams({
      sessionId: this.current.sessionId,
      displayName: this.current.displayName,
    });
    const source = new EventSource(`/api/realtime/stream?${params.toString()}`);
    this.source = source;

    source.onopen = () => {
      this.retryAttempt = 0;
      this.setStatus('open');
    };

    source.onmessage = (msg) => {
      if (!msg.data) return;
      try {
        const parsed = serverEventSchema.safeParse(JSON.parse(msg.data));
        if (!parsed.success) return;
        for (const listener of this.listeners) listener(parsed.data);
      } catch {
        // ignore malformed payload
      }
    };

    source.onerror = () => {
      source.close();
      this.source = null;
      this.setStatus('closed');
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (!this.current) return;
    if (this.retryTimer) return;
    const attempt = Math.min(this.retryAttempt, 6);
    const base = Math.min(1000 * 2 ** attempt, 30_000);
    const delay = base + Math.floor(Math.random() * 500);
    this.retryAttempt += 1;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.openSource();
    }, delay);
  }

  private setStatus(status: ConnectionStatus) {
    if (this.status === status) return;
    this.status = status;
    for (const listener of this.statusListeners) listener(status);
  }
}

const globalForClient = globalThis as unknown as { __realtimeClient?: RealtimeClient };
export const realtimeClient: RealtimeClient =
  globalForClient.__realtimeClient ?? new RealtimeClient();
if (typeof window !== 'undefined') {
  globalForClient.__realtimeClient = realtimeClient;
}

export async function postShare(
  fromSessionId: string,
  to: string[],
  question: MathQuestion
): Promise<string[]> {
  const res = await fetch('/api/realtime/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromSessionId, to, question }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Share failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { deliveredTo: string[] };
  return data.deliveredTo;
}

export async function postRename(sessionId: string, displayName: string): Promise<boolean> {
  const res = await fetch('/api/realtime/rename', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, displayName }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Rename failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { updated: boolean };
  return data.updated;
}
