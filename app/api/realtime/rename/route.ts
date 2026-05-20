import { NextRequest, NextResponse } from 'next/server';
import { presenceBus } from '@/lib/realtime/server-bus';
import { renamePayloadSchema } from '@/lib/realtime/protocol';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = renamePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Bad request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sessionId, displayName } = parsed.data;
  const updated = presenceBus.rename(sessionId, displayName);

  return NextResponse.json({ updated });
}
