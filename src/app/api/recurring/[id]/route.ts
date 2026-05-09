import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteRecurring } from '@/lib/queries';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await deleteRecurring(Number(session.user.id), numId);
  return NextResponse.json({ ok: true });
}
