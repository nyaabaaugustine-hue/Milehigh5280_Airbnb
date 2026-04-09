// POST /api/ai/interpret
// Input:  { message: string, conversationHistory?: Array<{role, content}> }
// Output: AIInterpretResponse (structured JSON — NO execution happens here)

import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/lib/ai/tools';
import type { AIInterpretResponse } from '@/lib/ai/types';

// Uses the Anthropic API directly via fetch (no SDK needed)
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a safe fallback when API key is not set
      const fallback: AIInterpretResponse = {
        intent:                  'API key not configured',
        action:                  'updateContent',
        data:                    { key: '', value: '', section: '' },
        risk_level:              'low',
        requires_confirmation:   true,
        message_to_user:         '⚠️ ANTHROPIC_API_KEY is not set. Add it to your .env.local file to enable AI features.',
        clarification_needed:    false,
        clarification_question:  null as unknown as string,
      };
      return NextResponse.json(fallback);
    }

    // Build messages array for the Anthropic API
    const messages = [
      // Include prior conversation for context (last 10 exchanges max)
      ...conversationHistory.slice(-20).map((m: { role: string; content: string }) => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      // Current user message
      { role: 'user', content: message },
    ];

    const response = await fetch(ANTHROPIC_API_URL, {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 1024,
        system:     buildSystemPrompt(),
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[AI Interpret] Anthropic error:', err);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const rawText: string = data.content?.[0]?.text ?? '{}';

    // Strip markdown code fences if present
    const clean = rawText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

    let parsed: AIInterpretResponse;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // AI returned non-JSON — wrap it
      parsed = {
        intent:                 'Could not parse intent',
        action:                 null as unknown as AIInterpretResponse['action'],
        data:                   {} as AIInterpretResponse['data'],
        risk_level:             'low',
        requires_confirmation:  true,
        message_to_user:        rawText,
        clarification_needed:   false,
        clarification_question: null as unknown as string,
      };
    }

    return NextResponse.json(parsed);

  } catch (err: unknown) {
    console.error('[AI Interpret] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
