'use client';

import { Sparkles, Settings, User } from 'lucide-react';
import { useState } from 'react';
import type { MathQuestion } from '@/lib/types';
import { useIdentityStore } from '@/lib/stores/identity';
import { useRealtimeStore } from '@/lib/stores/realtime';
import SettingsModal from './realtime/SettingsModal';
import NotificationBell from './realtime/NotificationBell';

interface Props {
  onOpenSharedQuestion: (question: MathQuestion) => void;
}

export default function Header({ onOpenSharedQuestion }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const displayName = useIdentityStore((s) => s.displayName);
  const status = useRealtimeStore((s) => s.status);
  const userCount = useRealtimeStore((s) => s.users.length);

  return (
    <header className="rounded-3xl bg-mint border-2 border-foreground px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-pop-lg">
      <div className="flex items-center gap-3 min-w-0">
        <Mascot />
        <span className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
          StarGirl
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <PresenceBadge status={status} count={userCount} />

        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-canvas border-2 border-foreground text-sm font-semibold shadow-pop-sm hover:-translate-y-0.5 transition-transform max-w-[180px]"
          aria-label="Open settings"
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{displayName}</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-canvas border-2 border-foreground shadow-pop-sm"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <NotificationBell onOpenQuestion={onOpenSharedQuestion} />

        <span className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground text-canvas text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Tutor
        </span>
      </div>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}

function PresenceBadge({ status, count }: { status: string; count: number }) {
  const tone =
    status === 'open'
      ? 'bg-pop-green'
      : status === 'connecting'
      ? 'bg-pop-yellow'
      : 'bg-pop-pink';
  return (
    <span
      className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${tone} border-2 border-foreground text-xs font-bold shadow-pop-sm`}
      title={`Realtime: ${status}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: 'var(--color-foreground)' }}
        aria-hidden
      />
      {count} online
    </span>
  );
}

function Mascot() {
  return (
    <div
      className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-canvas border-2 border-foreground flex items-center justify-center shadow-pop"
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="w-7 h-7 sm:w-8 sm:h-8">
        <circle
          cx="20"
          cy="22"
          r="13"
          fill="var(--color-mascot)"
          stroke="var(--color-foreground)"
          strokeWidth="2"
        />
        <circle cx="15" cy="22" r="2" fill="var(--color-foreground)" />
        <circle cx="25" cy="22" r="2" fill="var(--color-foreground)" />
        <path
          d="M14 28 Q20 32 26 28"
          stroke="var(--color-foreground)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M10 14 L7 9 M30 14 L33 9"
          stroke="var(--color-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
