import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateWishlistItem, deleteWishlistItem } from '@/lib/queries';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { item_name, price } = await req.json();
  await updateWishlistItem(Number(session.user.id), Number(id), { item_name, price: parseFloat(price) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deleteWishlistItem(Number(session.user.id), Number(id));
  return NextResponse.json({ ok: true });
}
