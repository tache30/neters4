import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { findUserByEmail, createUser, upsertUserSettings } from '@/lib/queries';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (
    !username ||
    typeof username !== 'string' ||
    !username.trim() ||
    !email ||
    !EMAIL_RE.test(email) ||
    !password ||
    typeof password !== 'string' ||
    password.length < 6
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'exists' }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  const userId = await createUser(username.trim(), email, passwordHash);
  await upsertUserSettings(userId);

  return NextResponse.json({ ok: true });
}
