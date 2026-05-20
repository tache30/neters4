import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from './db';
import type {
  Transaction,
  WishlistItem,
  RecurringPayment,
  UserSettings,
  ExchangeRates,
} from '@/types';

function toDate(v: unknown): string {
  return v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10);
}
function toDatetime(v: unknown): string {
  return v instanceof Date ? v.toISOString() : String(v);
}

// ─── Settings ────────────────────────────────────────────────────────────────

let _settingsColumnEnsured = false;
async function ensureSettingsColumn() {
  if (_settingsColumnEnsured) return;
  await pool.execute(`
    ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS user_id INT UNSIGNED NOT NULL DEFAULT 0
  `).catch(() => {});
  _settingsColumnEnsured = true;
}

export async function upsertUserSettings(userId: number): Promise<void> {
  await ensureSettingsColumn();
  await pool.execute(
    "INSERT IGNORE INTO settings (user_id, setting_key, setting_value) VALUES (?, 'currency', 'USD'), (?, 'language', 'en')",
    [userId, userId]
  );
}

export async function getUserSettings(userId: number): Promise<UserSettings> {
  await ensureSettingsColumn();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT setting_key, setting_value FROM settings WHERE user_id = ?',
    [userId]
  );
  const map: Record<string, string> = {};
  for (const row of rows) map[row.setting_key] = row.setting_value;
  return {
    currency: map['currency'] ?? 'USD',
    language: (map['language'] ?? 'en') as 'en' | 'ro',
  };
}

export async function updateSettings(
  userId: number,
  currency: string,
  language: string
): Promise<void> {
  await pool.execute(
    "UPDATE settings SET setting_value = ? WHERE setting_key = 'currency' AND user_id = ?",
    [currency, userId]
  );
  await pool.execute(
    "UPDATE settings SET setting_value = ? WHERE setting_key = 'language' AND user_id = ?",
    [language, userId]
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────

let _categoryColumnEnsured = false;
async function ensureCategoryColumn() {
  if (_categoryColumnEnsured) return;
  await pool.execute(`
    ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'other'
  `).catch(() => {});
  _categoryColumnEnsured = true;
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  await ensureCategoryColumn();
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, title, amount, transaction_date, type, category, created_at FROM transactions WHERE user_id = ? ORDER BY transaction_date ASC, id ASC',
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    amount: r.amount,
    transaction_date: toDate(r.transaction_date),
    type: r.type,
    category: r.category ?? 'other',
    created_at: toDatetime(r.created_at),
  })) as Transaction[];
}

export async function addTransaction(
  userId: number,
  data: { title: string; amount: number; date: string; type: 'income' | 'expense'; category?: string }
): Promise<void> {
  await ensureCategoryColumn();
  await pool.execute(
    'INSERT INTO transactions (user_id, title, amount, transaction_date, type, category) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, data.title, data.amount, data.date, data.type, data.category ?? 'other']
  );
}

export async function deleteTransaction(userId: number, id: number): Promise<void> {
  await pool.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function getWishlist(userId: number): Promise<WishlistItem[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, item_name, price, created_at FROM wishlist WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    item_name: r.item_name,
    price: r.price,
    created_at: toDatetime(r.created_at),
  })) as WishlistItem[];
}

export async function addWishlistItem(
  userId: number,
  data: { item_name: string; price: number }
): Promise<void> {
  await pool.execute('INSERT INTO wishlist (user_id, item_name, price) VALUES (?, ?, ?)', [
    userId,
    data.item_name,
    data.price,
  ]);
}

export async function updateWishlistItem(
  userId: number,
  id: number,
  data: { item_name: string; price: number }
): Promise<void> {
  await pool.execute(
    'UPDATE wishlist SET item_name = ?, price = ? WHERE id = ? AND user_id = ?',
    [data.item_name, data.price, id, userId]
  );
}

export async function deleteWishlistItem(userId: number, id: number): Promise<void> {
  await pool.execute('DELETE FROM wishlist WHERE id = ? AND user_id = ?', [id, userId]);
}

export async function batchDeleteWishlist(userId: number, ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await pool.execute(`DELETE FROM wishlist WHERE id IN (${placeholders}) AND user_id = ?`, [
    ...ids,
    userId,
  ]);
}

// ─── Recurring Payments ───────────────────────────────────────────────────────

export async function getRecurring(userId: number): Promise<RecurringPayment[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, title, amount, due_date, frequency, status FROM recurring_payments WHERE user_id = ? AND status = 'active' ORDER BY due_date ASC",
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    amount: r.amount,
    due_date: toDate(r.due_date),
    frequency: r.frequency,
    status: r.status,
  })) as RecurringPayment[];
}

export async function addRecurring(
  userId: number,
  data: { title: string; amount: number; due_date: string; frequency: string }
): Promise<void> {
  await pool.execute(
    'INSERT INTO recurring_payments (user_id, title, amount, due_date, frequency) VALUES (?, ?, ?, ?, ?)',
    [userId, data.title, data.amount, data.due_date, data.frequency]
  );
}

export async function deleteRecurring(userId: number, id: number): Promise<void> {
  await pool.execute('DELETE FROM recurring_payments WHERE id = ? AND user_id = ?', [id, userId]);
}

// ─── Exchange Rates ───────────────────────────────────────────────────────────

async function fetchRate(from: string, to: string): Promise<number> {
  const pair = `${from.toUpperCase()}_${to.toUpperCase()}`;
  const TWELVE_HOURS = 43200;

  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT rate, last_updated FROM exchange_rates WHERE currency_pair = ?',
    [pair]
  );

  if (rows.length > 0) {
    const age = (Date.now() - new Date(rows[0].last_updated).getTime()) / 1000;
    if (age < TWELVE_HOURS) return parseFloat(rows[0].rate);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`, {
      signal: controller.signal,
    });
    if (res.ok) {
      const json = await res.json();
      const rate: number = json?.rates?.[to.toUpperCase()];
      if (rate) {
        await pool.execute(
          'INSERT INTO exchange_rates (currency_pair, rate, last_updated) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE rate = ?, last_updated = CURRENT_TIMESTAMP',
          [pair, rate, rate]
        );
        return rate;
      }
    }
  } catch {
    // timeout or network error — fall through to cached/fallback value
  } finally {
    clearTimeout(timer);
  }

  if (rows.length > 0) return parseFloat(rows[0].rate);

  const fallbacks: Record<string, number> = { EUR_RON: 4.97, USD_RON: 4.58 };
  return fallbacks[pair] ?? 1.0;
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  const [eurRon, usdRon] = await Promise.all([fetchRate('EUR', 'RON'), fetchRate('USD', 'RON')]);
  return { eurRon, usdRon };
}

// ─── Account ──────────────────────────────────────────────────────────────────

export async function deleteAccount(userId: number): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM transactions WHERE user_id = ?', [userId]);
    await conn.execute('DELETE FROM wishlist WHERE user_id = ?', [userId]);
    await conn.execute('DELETE FROM recurring_payments WHERE user_id = ?', [userId]);
    await conn.execute('DELETE FROM settings WHERE user_id = ?', [userId]);
    await conn.execute('DELETE FROM users WHERE id = ?', [userId]);
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// ─── Users (for auth) ─────────────────────────────────────────────────────────

export async function findUserByEmail(
  email: string
): Promise<{ id: number; username: string; email: string; password_hash: string } | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, username, email, password_hash FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0
    ? (rows[0] as { id: number; username: string; email: string; password_hash: string })
    : null;
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
  return result.insertId;
}
