import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTransactions, addTransaction } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getTransactions(Number(session.user.id));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, amount, date, type } = await req.json();
  const parsedAmount = parseFloat(amount);

  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim() ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    !date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !['income', 'expense'].includes(type)
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await addTransaction(Number(session.user.id), {
    title: title.trim(),
    amount: parsedAmount,
    date,
    type,
  });
  return NextResponse.json({ ok: true });
}
