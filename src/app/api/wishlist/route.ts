import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getWishlist, addWishlistItem } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getWishlist(Number(session.user.id));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { item_name, price } = await req.json();
  if (!item_name || !price) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  await addWishlistItem(Number(session.user.id), { item_name, price: parseFloat(price) });
  return NextResponse.json({ ok: true });
}
