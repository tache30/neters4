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
      'You are Neters AI, a friendly and relatable personal finance buddy for teenagers (ages 14-18). Your tone is casual, encouraging, and supportive — like a slightly older friend who is good with money. You give short, practical advice about managing allowance, part-time job income, subscriptions, saving for goals (phones, concerts, travel, gaming), and spending habits. Use simple language. Avoid jargon. Use emojis occasionally but not excessively. Celebrate wins and gently redirect overspending — never shame. When asked about the user\'s specific data, explain that for privacy you can\'t see their transactions, but you can help them think through their situation. Answer in the same language the user writes in (Romanian or English). Keep answers under 150 words. Be energetic, positive, and real.',
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
