import type { Transaction, DashboardChartData } from '@/types';

function formatLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatHour(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function buildChartData(transactions: Transaction[]): DashboardChartData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build daily closing balance map
  const dailyClosing: Map<string, number> = new Map();
  let runningBalance = 0;

  for (const t of transactions) {
    const dateKey = t.transaction_date.slice(0, 10);
    runningBalance += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
    dailyClosing.set(dateKey, runningBalance);
  }

  // Fill forward: build continuous daily series
  const allDates: string[] = [];
  const allBalances: number[] = [];

  if (dailyClosing.size > 0) {
    const sortedKeys = Array.from(dailyClosing.keys()).sort();
    const startDate = new Date(sortedKeys[0]);
    const endDate = new Date(today);
    let lastBalance = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      if (dailyClosing.has(key)) lastBalance = dailyClosing.get(key)!;
      allDates.push(formatLabel(new Date(d)));
      allBalances.push(lastBalance);
    }
  }

  // Month: last 30 days
  const monthLabels = allDates.slice(-30);
  const monthData = allBalances.slice(-30);

  // Week: last 7 days
  const weekLabels = allDates.slice(-7);
  const weekData = allBalances.slice(-7);

  // Day: today's transactions with timestamps
  const todayKey = today.toISOString().slice(0, 10);
  const todayTxs = transactions.filter((t) => t.transaction_date.slice(0, 10) === todayKey);

  const dayLabels: string[] = [];
  const dayData: number[] = [];

  if (todayTxs.length > 0) {
    const balanceBeforeToday = allBalances.length > 1 ? allBalances[allBalances.length - 2] : 0;
    let dayBalance = balanceBeforeToday;
    dayLabels.push('Start');
    dayData.push(dayBalance);

    for (const t of todayTxs) {
      dayBalance += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
      const time = formatHour(new Date(t.created_at));
      dayLabels.push(time);
      dayData.push(dayBalance);
    }
  } else {
    dayLabels.push(formatLabel(today));
    dayData.push(allBalances[allBalances.length - 1] ?? 0);
  }

  return {
    day: { labels: dayLabels, data: dayData },
    week: { labels: weekLabels, data: weekData },
    month: { labels: monthLabels, data: monthData },
  };
}

export function computeNetWorth(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount));
  }, 0);
}
