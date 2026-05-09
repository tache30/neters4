import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const systemMessage = {
    role: 'system',
    content:
      'You are an intelligent banking assistant for "Neters Banking". Your tone is professional, helpful, and concise. You are an expert in finance, budgeting, and investment. If asked about user data, explain that for security reasons you currently do not have access to their real-time transaction history.',
  };

  const sanitizedMessages = messages
    .filter((m) => m && typeof m.role === 'string' && typeof m.content === 'string')
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o',
      messages: [systemMessage, ...sanitizedMessages],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
