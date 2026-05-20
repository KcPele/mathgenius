'use client';

import { FormEvent, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useIdentityStore } from '@/lib/stores/identity';
import { useRealtimeStore } from '@/lib/stores/realtime';
import { postRename } from '@/lib/realtime/client';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <SettingsForm onDone={() => onOpenChange(false)} />}
    </Dialog>
  );
}

function SettingsForm({ onDone }: { onDone: () => void }) {
  const sessionId = useIdentityStore((s) => s.sessionId);
  const displayName = useIdentityStore((s) => s.displayName);
  const setDisplayName = useIdentityStore((s) => s.setDisplayName);
  const status = useRealtimeStore((s) => s.status);

  const [draft, setDraft] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (trimmed === displayName) {
      onDone();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      setDisplayName(trimmed);
      await postRename(sessionId, trimmed).catch(() => undefined);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save name');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <DialogContent
      title="Settings"
      description="Update how others see you in the share list. Your session ends when you close the tab."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
            Display name
          </span>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={40}
            placeholder="Your name"
            className="bg-canvas border-2 border-foreground rounded-2xl px-4 py-3 text-base focus:outline-none focus:shadow-pop"
          />
          <span className="text-xs text-neutral-500">Up to 40 characters.</span>
        </label>

        <div className="rounded-2xl border-2 border-foreground/15 bg-paper px-4 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">
              Session ID
            </p>
            <p className="font-mono text-xs text-foreground truncate">{sessionId}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-canvas border-2 border-foreground shadow-pop-sm hover:-translate-y-0.5 transition-transform"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          Connection:{' '}
          <span className="font-mono font-medium text-foreground">{status}</span>
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <DialogClose
            type="button"
            className="px-4 py-2 rounded-full border-2 border-foreground bg-canvas font-semibold text-sm shadow-pop-sm"
          >
            Cancel
          </DialogClose>
          <button
            type="submit"
            disabled={saving || !draft.trim()}
            className="px-5 py-2 rounded-full border-2 border-foreground bg-foreground text-canvas font-semibold text-sm shadow-pop hover:-translate-y-0.5 transition-transform disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </DialogContent>
  );
}
