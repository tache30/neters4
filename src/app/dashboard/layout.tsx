import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import ChatDrawer from '@/components/chat/ChatDrawer';
import { getUserSettings } from '@/lib/queries';
import { getT } from '@/lib/i18n';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/auth');

  const settings = await getUserSettings(Number(session.user.id));
  const t = getT(settings.language);

  return (
    <>
      <Sidebar />
      <main className="main-content">{children}</main>
      <ChatDrawer t={t} />
    </>
  );
}
