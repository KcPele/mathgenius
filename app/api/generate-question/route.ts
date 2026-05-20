import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_INSTRUCTION } from '@/lib/constants';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { difficulty, model } = await request.json();

    if (!model || typeof model !== 'string') {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Taitor',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: `Generate a ${difficulty} level question.` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `OpenRouter error ${response.status}: ${err}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? '';
    const question = JSON.parse(content);

    return NextResponse.json(question);
  } catch (err) {
    console.error('Generate question error:', err);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
