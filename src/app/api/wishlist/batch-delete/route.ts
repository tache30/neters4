import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { batchDeleteWishlist } from '@/lib/queries';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const validIds = ids
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 100);
  if (validIds.length === 0) {
    return NextResponse.json({ error: 'No valid ids' }, { status: 400 });
  }
  await batchDeleteWishlist(Number(session.user.id), validIds);
  return NextResponse.json({ ok: true });
}
