import { NextRequest, NextResponse } from 'next/server';
import { presenceBus } from '@/lib/realtime/server-bus';
import { sharePayloadSchema } from '@/lib/realtime/protocol';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = sharePayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Bad request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { fromSessionId, to, question } = parsed.data;
  const { deliveredTo, fromName } = presenceBus.share(fromSessionId, to, question);

  if (fromName === null) {
    return NextResponse.json({ error: 'Sender not connected' }, { status: 409 });
  }

  return NextResponse.json({ deliveredTo });
}
