import { ActiveUser, RealtimeNotification, ServerEvent } from './protocol';
import type { MathQuestion } from '@/lib/types';

type Controller = ReadableStreamDefaultController<Uint8Array>;

interface Connection {
  controller: Controller;
  closed: boolean;
}

interface UserEntry {
  sessionId: string;
  displayName: string;
  joinedAt: number;
  connections: Set<Connection>;
}

const encoder = new TextEncoder();

function encodeEvent(event: ServerEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function safeEnqueue(connection: Connection, chunk: Uint8Array) {
  if (connection.closed) return;
  try {
    connection.controller.enqueue(chunk);
  } catch {
    connection.closed = true;
  }
}

class PresenceBus {
  private users = new Map<string, UserEntry>();

  private snapshot(): ActiveUser[] {
    return Array.from(this.users.values())
      .map(({ sessionId, displayName, joinedAt }) => ({ sessionId, displayName, joinedAt }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
  }

  private broadcast(event: ServerEvent, except?: Connection) {
    const chunk = encodeEvent(event);
    for (const entry of this.users.values()) {
      for (const connection of entry.connections) {
        if (connection === except) continue;
        safeEnqueue(connection, chunk);
      }
    }
  }

  private sendTo(connection: Connection, event: ServerEvent) {
    safeEnqueue(connection, encodeEvent(event));
  }

  subscribe(
    sessionId: string,
    displayName: string,
    controller: Controller
  ): { connection: Connection; unsubscribe: () => void } {
    const connection: Connection = { controller, closed: false };
    const now = Date.now();

    const existing = this.users.get(sessionId);
    if (existing) {
      existing.connections.add(connection);
      if (existing.displayName !== displayName) {
        existing.displayName = displayName;
        this.broadcast({ type: 'users_updated', users: this.snapshot() });
      }
    } else {
      this.users.set(sessionId, {
        sessionId,
        displayName,
        joinedAt: now,
        connections: new Set([connection]),
      });
      this.broadcast({ type: 'users_updated', users: this.snapshot() });
    }

    this.sendTo(connection, { type: 'welcome', users: this.snapshot() });

    const unsubscribe = () => {
      connection.closed = true;
      const entry = this.users.get(sessionId);
      if (!entry) return;
      entry.connections.delete(connection);
      if (entry.connections.size === 0) {
        this.users.delete(sessionId);
        this.broadcast({ type: 'users_updated', users: this.snapshot() });
      }
    };

    return { connection, unsubscribe };
  }

  rename(sessionId: string, displayName: string): boolean {
    const entry = this.users.get(sessionId);
    if (!entry || entry.displayName === displayName) return false;
    entry.displayName = displayName;
    this.broadcast({ type: 'users_updated', users: this.snapshot() });
    return true;
  }

  share(
    fromSessionId: string,
    to: string[],
    question: MathQuestion
  ): { deliveredTo: string[]; fromName: string | null } {
    const sender = this.users.get(fromSessionId);
    if (!sender) return { deliveredTo: [], fromName: null };

    const deliveredTo: string[] = [];
    const baseNotification: Omit<RealtimeNotification, 'id'> = {
      fromSessionId,
      fromName: sender.displayName,
      question,
      receivedAt: Date.now(),
    };

    for (const targetId of to) {
      if (targetId === fromSessionId) continue;
      const target = this.users.get(targetId);
      if (!target) continue;
      const notification: RealtimeNotification = {
        ...baseNotification,
        id: `${baseNotification.receivedAt}-${targetId}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      };
      const event: ServerEvent = { type: 'shared', notification };
      const chunk = encodeEvent(event);
      let delivered = false;
      for (const connection of target.connections) {
        safeEnqueue(connection, chunk);
        if (!connection.closed) delivered = true;
      }
      if (delivered) deliveredTo.push(targetId);
    }

    return { deliveredTo, fromName: sender.displayName };
  }

  list(): ActiveUser[] {
    return this.snapshot();
  }
}

const globalForBus = globalThis as unknown as { __realtimeBus?: PresenceBus };

export const presenceBus: PresenceBus = globalForBus.__realtimeBus ?? new PresenceBus();
if (process.env.NODE_ENV !== 'production') {
  globalForBus.__realtimeBus = presenceBus;
}

export { encodeEvent };
