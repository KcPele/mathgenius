import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_INSTRUCTION } from '@/lib/constants';

const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { difficulty, model, provider } = await request.json();

    let apiUrl: string;
    let apiKey: string;
    let headers: Record<string, string>;
    let body: object;

    if (provider === 'openrouter') {
      apiKey = process.env.OPENROUTER_API_KEY || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: 'OpenRouter API key not configured' },
          { status: 500 }
        );
      }
      apiUrl = OPENROUTER_API_URL;
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      };
      body = {
        model,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: `Generate a ${difficulty} level question.` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      };
    } else {
      apiKey = process.env.ZAI_API_KEY || '';
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Z.AI API key not configured' },
          { status: 500 }
        );
      }
      apiUrl = ZAI_API_URL;
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      };
      body = {
        model,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: `Generate a ${difficulty} level question.` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `API error ${response.status}: ${err}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content: string = data.choices[0].message.content;
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
