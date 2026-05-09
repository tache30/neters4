import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getWishlist, addWishlistItem } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getWishlist(Number(session.user.id));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { item_name, price } = await req.json();
  const parsedPrice = parseFloat(price);
  if (
    !item_name ||
    typeof item_name !== 'string' ||
    !item_name.trim() ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice <= 0
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  await addWishlistItem(Number(session.user.id), {
    item_name: item_name.trim(),
    price: parsedPrice,
  });
  return NextResponse.json({ ok: true });
}
