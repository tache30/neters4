import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { findUserByEmail, createUser, upsertUserSettings } from '@/lib/queries';

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'exists' }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  const userId = await createUser(username, email, passwordHash);
  await upsertUserSettings(userId);

  return NextResponse.json({ ok: true });
}
