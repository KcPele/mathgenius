'use client';

import { useMemo, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Users, SendHorizonal } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useIdentityStore } from '@/lib/stores/identity';
import { useRealtimeStore } from '@/lib/stores/realtime';
import { postShare } from '@/lib/realtime/client';
import type { MathQuestion } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: MathQuestion | null;
}

export default function ShareModal({ open, onOpenChange, question }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <ShareForm
          question={question}
          onDone={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}

function ShareForm({
  question,
  onDone,
}: {
  question: MathQuestion | null;
  onDone: () => void;
}) {
  const sessionId = useIdentityStore((s) => s.sessionId);
  const users = useRealtimeStore((s) => s.users);
  const status = useRealtimeStore((s) => s.status);

  const others = useMemo(
    () => users.filter((u) => u.sessionId !== sessionId),
    [users, sessionId]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = async () => {
    if (!question || selected.size === 0) return;
    setSending(true);
    setError(null);
    setResultMsg(null);
    try {
      const targets = Array.from(selected);
      const delivered = await postShare(sessionId, targets, question);
      const missed = targets.length - delivered.length;
      setResultMsg(
        missed > 0
          ? `Delivered to ${delivered.length} · ${missed} offline`
          : `Delivered to ${delivered.length}`
      );
      setSelected(new Set());
      setTimeout(onDone, 1100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Share failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <DialogContent
      title="Share this problem"
      description="Pick anyone who is online right now. They get it instantly."
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>Active now ({others.length})</span>
        </div>

        {status !== 'open' && (
          <p className="text-xs text-amber-700 bg-pop-yellow/40 border-2 border-foreground/15 rounded-xl px-3 py-2">
            Connection: <span className="font-mono">{status}</span>. Sharing needs an open connection.
          </p>
        )}

        {others.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6 text-center">
            No one else is online. Open the app in another browser/tab to test it.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {others.map((user) => {
              const isOn = selected.has(user.sessionId);
              return (
                <li key={user.sessionId}>
                  <label
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-colors ${
                      isOn
                        ? 'bg-pop-yellow border-foreground shadow-pop-sm'
                        : 'bg-canvas border-foreground/30 hover:border-foreground'
                    }`}
                  >
                    <Checkbox.Root
                      checked={isOn}
                      onCheckedChange={() => toggle(user.sessionId)}
                      className="w-5 h-5 rounded-md border-2 border-foreground bg-canvas flex items-center justify-center data-[state=checked]:bg-foreground data-[state=checked]:text-canvas"
                    >
                      <Checkbox.Indicator>
                        <Check className="w-3.5 h-3.5" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {user.displayName}
                      </p>
                      <p className="font-mono text-[10px] text-neutral-500 truncate">
                        {user.sessionId.slice(0, 8)}
                      </p>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {resultMsg && <p className="text-sm text-foreground">{resultMsg}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <DialogClose
            type="button"
            className="px-4 py-2 rounded-full border-2 border-foreground bg-canvas font-semibold text-sm shadow-pop-sm"
          >
            Cancel
          </DialogClose>
          <button
            type="button"
            onClick={handleShare}
            disabled={sending || selected.size === 0 || !question || status !== 'open'}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-foreground bg-foreground text-canvas font-semibold text-sm shadow-pop hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            <SendHorizonal className="w-4 h-4" />
            {sending ? 'Sending…' : `Share (${selected.size})`}
          </button>
        </div>
      </div>
    </DialogContent>
  );
}
