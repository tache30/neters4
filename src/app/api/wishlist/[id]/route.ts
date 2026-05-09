import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateWishlistItem, deleteWishlistItem } from '@/lib/queries';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
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
  await updateWishlistItem(Number(session.user.id), numId, {
    item_name: item_name.trim(),
    price: parsedPrice,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await deleteWishlistItem(Number(session.user.id), numId);
  return NextResponse.json({ ok: true });
}
