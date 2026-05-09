import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSettings, updateSettings } from '@/lib/queries';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getUserSettings(Number(session.user.id));
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { currency, language } = await req.json();
  await updateSettings(Number(session.user.id), currency, language);
  return NextResponse.json({ ok: true });
}
