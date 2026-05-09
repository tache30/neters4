import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteAccount } from '@/lib/queries';

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteAccount(Number(session.user.id));
  return NextResponse.json({ ok: true });
}
