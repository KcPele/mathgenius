import { NextRequest } from 'next/server';
import { z } from 'zod';
import { presenceBus } from '@/lib/realtime/server-bus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  sessionId: z.string().uuid(),
  displayName: z.string().min(1).max(40),
});

const HEARTBEAT_INTERVAL_MS = 25_000;
const HEARTBEAT_PAYLOAD = new TextEncoder().encode(': keep-alive\n\n');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parse = querySchema.safeParse({
    sessionId: searchParams.get('sessionId'),
    displayName: searchParams.get('displayName'),
  });
  if (!parse.success) {
    return new Response('Bad request', { status: 400 });
  }
  const { sessionId, displayName } = parse.data;

  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const { unsubscribe } = presenceBus.subscribe(sessionId, displayName, controller);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(HEARTBEAT_PAYLOAD);
        } catch {
          clearInterval(heartbeat);
        }
      }, HEARTBEAT_INTERVAL_MS);

      cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      if (request.signal.aborted) {
        cleanup();
      } else {
        request.signal.addEventListener('abort', cleanup, { once: true });
      }
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
