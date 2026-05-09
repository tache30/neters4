import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getRecurring, addRecurring } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getRecurring(Number(session.user.id));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, amount, due_date, frequency } = await req.json();
  const parsedAmount = parseFloat(amount);
  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim() ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    !due_date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(due_date) ||
    !['monthly', 'weekly', 'yearly'].includes(frequency)
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  await addRecurring(Number(session.user.id), {
    title: title.trim(),
    amount: parsedAmount,
    due_date,
    frequency,
  });
  return NextResponse.json({ ok: true });
}
