import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  getUserSettings,
  getTransactions,
  getWishlist,
  getRecurring,
  getExchangeRates,
  upsertUserSettings,
} from '@/lib/queries';
import { buildChartData, computeNetWorth } from '@/lib/chartUtils';
import { getT } from '@/lib/i18n';
import NetWorthCard from '@/components/dashboard/NetWorthCard';
import WishlistCard from '@/components/dashboard/WishlistCard';
import RecurringCard from '@/components/dashboard/RecurringCard';
import ExchangeRatesCard from '@/components/dashboard/ExchangeRatesCard';
import TransactionsCard from '@/components/dashboard/TransactionsCard';
import WelcomeScreen from '@/components/dashboard/WelcomeScreen';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth');
  const userId = Number(session.user.id);

  await upsertUserSettings(userId);

  const [settings, transactions, wishlist, recurring, rates] = await Promise.all([
    getUserSettings(userId),
    getTransactions(userId),
    getWishlist(userId),
    getRecurring(userId),
    getExchangeRates(),
  ]);

  const netWorth = computeNetWorth(transactions);
  const chartData = buildChartData(transactions);
  const t = getT(settings.language);
  const { welcome } = await searchParams;

  const currencies: Record<string, string> = {
    USD: '$', EUR: '€', RON: 'lei', GBP: '£', CHF: 'CHF', JPY: '¥', CAD: 'C$',
  };
  const symbol = currencies[settings.currency] ?? settings.currency;

  return (
    <>
      {welcome === '1' && <WelcomeScreen username={session!.user.name ?? ''} />}

      <div className="header">
        <h1>{t.dashboard}</h1>
      </div>

      <div className="dashboard-grid">
        <NetWorthCard
          netWorth={netWorth}
          chartData={chartData}
          currency={settings.currency}
          symbol={symbol}
          lang={settings.language}
          t={t}
        />
        <WishlistCard
          items={wishlist}
          netWorth={netWorth}
          symbol={symbol}
          lang={settings.language}
          t={t}
        />
      </div>

      <div className="bottom-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RecurringCard payments={recurring} symbol={symbol} t={t} />
          <ExchangeRatesCard eurRon={rates.eurRon} usdRon={rates.usdRon} t={t} />
        </div>
        <TransactionsCard
          transactions={transactions}
          symbol={symbol}
          lang={settings.language}
          t={t}
        />
      </div>
    </>
  );
}
