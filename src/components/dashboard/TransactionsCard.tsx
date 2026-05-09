'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Transaction } from '@/types';
import type { T } from '@/lib/i18n';
import AddTransactionModal from '@/components/modals/AddTransactionModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

type View = 'list' | 'calendar';

function formatISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDateDisplay(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Azi';
  return d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TransactionsCard({
  transactions,
  symbol,
  lang,
  t,
}: {
  transactions: Transaction[];
  symbol: string;
  lang: string;
  t: T;
}) {
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  });
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const txDates = useMemo(() => new Set(transactions.map((t) => t.transaction_date.slice(0, 10))), [transactions]);

  const dayTxs = useMemo(
    () =>
      transactions
        .filter((tx) => tx.transaction_date.slice(0, 10) === formatISO(selectedDate))
        .sort((a, b) => b.id - a.id),
    [transactions, selectedDate]
  );

  async function handleDelete() {
    if (deleteId === null) return;
    setLoading(true);
    await fetch(`/api/transactions/${deleteId}`, { method: 'DELETE' });
    setLoading(false);
    setDeleteId(null);
    router.refresh();
  }

  function renderCalendar() {
    const year = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatISO(new Date());
    const selectedStr = formatISO(selectedDate);
    const days = [];
    const offset = (firstDay + 6) % 7;

    for (let i = 0; i < offset; i++) days.push(<div key={`e${i}`} />);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedStr;
      const hasTx = txDates.has(dateStr);
      let cls = 'calendar-day';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';
      if (hasTx) cls += ' has-trans';
      days.push(
        <div
          key={d}
          className={cls}
          onClick={() => { setSelectedDate(new Date(dateStr + 'T00:00:00')); setView('list'); }}
        >
          {d}
        </div>
      );
    }
    return days;
  }

  return (
    <>
      <div className="card transactions-card">
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <span className="card-title">{t.ledger}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }}
            >
              <ion-icon name="chevron-back-outline" />
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '130px', textAlign: 'center' }}>
              {formatDateDisplay(selectedDate)}
            </span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }}
            >
              <ion-icon name="chevron-forward-outline" />
            </button>
            <div className="view-toggle">
              <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
                <ion-icon name="list-outline" />
              </button>
              <button className={`view-btn${view === 'calendar' ? ' active' : ''}`} onClick={() => setView('calendar')}>
                <ion-icon name="calendar-outline" />
              </button>
            </div>
            <button className="btn-view-all" onClick={() => setShowAdd(true)}>+</button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="transactions-list">
            {dayTxs.length === 0 ? (
              <div className="empty-day-state">{t.noTransactions}</div>
            ) : (
              dayTxs.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className={`transaction-icon ${tx.type === 'income' ? 't-icon-income' : 't-icon-expense'}`}>
                    <ion-icon name={tx.type === 'income' ? 'arrow-up-outline' : 'arrow-down-outline'} />
                  </div>
                  <div className="transaction-info">
                    <div className={`transaction-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{symbol}{Number(tx.amount).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="transaction-meta">{tx.title}</div>
                  </div>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', marginLeft: '0.5rem' }}
                    onClick={() => setDeleteId(tx.id)}
                  >
                    <ion-icon name="trash-outline" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="calendar-view active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth() - 1); setCalMonth(d); }}>
                <ion-icon name="chevron-back-outline" />
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {calMonth.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
              </span>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => { const d = new Date(calMonth); d.setMonth(d.getMonth() + 1); setCalMonth(d); }}>
                <ion-icon name="chevron-forward-outline" />
              </button>
            </div>
            <div className="calendar-header">
              {['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar-grid">{renderCalendar()}</div>
          </div>
        )}
      </div>

      {showAdd && <AddTransactionModal t={t} onClose={() => setShowAdd(false)} />}
      {deleteId !== null && (
        <ConfirmDeleteModal t={t} loading={loading} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      )}
    </>
  );
}
