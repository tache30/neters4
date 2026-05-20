import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null };
  }
}

export const TRANSACTION_CATEGORIES = [
  { key: 'allowance',     emoji: '💰', type: 'income'   },
  { key: 'partTimeJob',   emoji: '💼', type: 'income'   },
  { key: 'gift',          emoji: '🎁', type: 'income'   },
  { key: 'food',          emoji: '🍕', type: 'expense'  },
  { key: 'gaming',        emoji: '🎮', type: 'expense'  },
  { key: 'fashion',       emoji: '👕', type: 'expense'  },
  { key: 'streaming',     emoji: '🎵', type: 'expense'  },
  { key: 'transport',     emoji: '🚌', type: 'expense'  },
  { key: 'school',        emoji: '📚', type: 'expense'  },
  { key: 'entertainment', emoji: '🎬', type: 'expense'  },
  { key: 'other',         emoji: '📦', type: 'both'     },
] as const;

export type CategoryKey = typeof TRANSACTION_CATEGORIES[number]['key'];

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  transaction_date: string;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  item_name: string;
  price: number;
  created_at: string;
}

export interface RecurringPayment {
  id: number;
  title: string;
  amount: number;
  due_date: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  status: 'active' | 'paused' | 'completed';
}

export interface UserSettings {
  currency: string;
  language: 'en' | 'ro';
}

export interface ExchangeRates {
  eurRon: number;
  usdRon: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardChartData {
  day: ChartData;
  week: ChartData;
  month: ChartData;
}
