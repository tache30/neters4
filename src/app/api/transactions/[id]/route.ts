import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteTransaction } from '@/lib/queries';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deleteTransaction(Number(session.user.id), Number(id));
  return NextResponse.json({ ok: true });
}
