import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AuthForm from '@/components/auth/AuthForm';

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const session = await auth();
  if (session) redirect('/dashboard');

  const { mode } = await searchParams;
  return <AuthForm defaultMode={mode} />;
}
