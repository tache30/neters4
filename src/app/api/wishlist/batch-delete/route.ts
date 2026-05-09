import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { batchDeleteWishlist } from '@/lib/queries';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { ids } = await req.json();
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  await batchDeleteWishlist(Number(session.user.id), ids.map(Number));
  return NextResponse.json({ ok: true });
}
