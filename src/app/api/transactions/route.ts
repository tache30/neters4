import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTransactions, addTransaction } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getTransactions(Number(session.user.id));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, amount, date, type } = await req.json();
  if (!title || !amount || !date || !['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await addTransaction(Number(session.user.id), { title, amount: parseFloat(amount), date, type });
  return NextResponse.json({ ok: true });
}
