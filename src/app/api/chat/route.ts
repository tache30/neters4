import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content:
      'You are an intelligent banking assistant for "Neters Banking". Your tone is professional, helpful, and concise. You are an expert in finance, budgeting, and investment. If asked about user data, explain that for security reasons you currently do not have access to their real-time transaction history.',
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
