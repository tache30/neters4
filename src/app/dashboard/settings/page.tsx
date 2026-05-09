import { auth } from '@/lib/auth';
import { getUserSettings, upsertUserSettings } from '@/lib/queries';
import SettingsForm from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  const userId = Number(session!.user.id);
  await upsertUserSettings(userId);
  const settings = await getUserSettings(userId);

  return (
    <>
      <div className="header">
        <h1>Setări</h1>
      </div>
      <SettingsForm
        defaultCurrency={settings.currency}
        defaultLanguage={settings.language}
        username={session!.user.name ?? ''}
      />
    </>
  );
}
