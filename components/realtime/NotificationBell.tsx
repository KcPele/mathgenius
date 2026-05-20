'use client';

import * as Popover from '@radix-ui/react-popover';
import { Bell, Mail, MailOpen } from 'lucide-react';
import { useState } from 'react';
import { useRealtimeStore, useNotificationsView, useUnreadCount } from '@/lib/stores/realtime';
import type { MathQuestion } from '@/lib/types';

interface Props {
  onOpenQuestion: (question: MathQuestion) => void;
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleString();
}

export default function NotificationBell({ onOpenQuestion }: Props) {
  const [open, setOpen] = useState(false);
  const unread = useUnreadCount();
  const notifications = useNotificationsView();
  const markRead = useRealtimeStore((s) => s.markRead);
  const markAllRead = useRealtimeStore((s) => s.markAllRead);

  const handleOpen = (notificationId: string, question: MathQuestion) => {
    markRead(notificationId);
    onOpenQuestion(question);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-canvas border-2 border-foreground shadow-pop-sm hover:-translate-y-0.5 transition-transform"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-pop-pink border-2 border-foreground text-[10px] font-bold text-foreground">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[min(92vw,360px)] rounded-2xl bg-canvas border-2 border-foreground shadow-pop-lg p-0 overflow-hidden"
        >
          <div className="px-4 py-3 flex items-center justify-between border-b-2 border-foreground/15">
            <p className="font-display text-base">Notifications</p>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold tracking-wide text-neutral-500 hover:text-foreground"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-neutral-500">
                Nothing yet. Shared problems will appear here.
              </div>
            ) : (
              <ul className="divide-y divide-foreground/10">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleOpen(n.id, n.question)}
                      className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-paper transition-colors ${
                        n.read ? 'opacity-70' : ''
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-canvas border-2 border-foreground flex items-center justify-center">
                        {n.read ? (
                          <MailOpen className="w-3.5 h-3.5" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {n.fromName}
                          </span>
                          <span className="text-[10px] text-neutral-500 shrink-0">
                            {formatTime(n.receivedAt)}
                          </span>
                        </span>
                        <span className="block text-xs text-neutral-500 truncate">
                          {n.question.topic}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
