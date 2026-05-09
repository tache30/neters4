'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RecurringPayment } from '@/types';
import type { T } from '@/lib/i18n';
import AddRecurringModal from '@/components/modals/AddRecurringModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

export default function RecurringCard({
  payments,
  symbol,
  t,
}: {
  payments: RecurringPayment[];
  symbol: string;
  t: T;
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (deleteId === null) return;
    setLoading(true);
    setDeleteError(null);
    const res = await fetch(`/api/recurring/${deleteId}`, { method: 'DELETE' });
    setLoading(false);
    if (!res.ok) { setDeleteError('Eroare la ștergere. Încearcă din nou.'); return; }
    setDeleteId(null);
    router.refresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  }

  return (
    <>
      <div className="card recurring-card">
        <div className="card-header">
          <span className="card-title">{t.recurringPayments}</span>
          <button className="btn-view-all" onClick={() => setShowAdd(true)}>+ {t.addItem}</button>
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
          {payments.length === 0 ? (
            <div className="empty-day-state">{t.noRecurring}</div>
          ) : (
            payments.map((p) => (
              <div key={p.id} className="recurring-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <div className="transaction-icon">
                    <ion-icon name="repeat-outline" style={{ color: 'var(--accent-purple)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {t.due}: {formatDate(p.due_date)} ({t[p.frequency as keyof T] as string ?? p.frequency})
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--accent-red)', fontWeight: 600, marginRight: '0.75rem' }}>
                  -{symbol}{Number(p.amount).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                </span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
                  onClick={() => setDeleteId(p.id)}
                >
                  <ion-icon name="trash-outline" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdd && <AddRecurringModal t={t} onClose={() => setShowAdd(false)} />}
      {deleteError && <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', padding: '0.5rem', textAlign: 'center' }}>{deleteError}</div>}
      {deleteId !== null && (
        <ConfirmDeleteModal t={t} loading={loading} onConfirm={handleDelete} onCancel={() => { setDeleteId(null); setDeleteError(null); }} />
      )}
    </>
  );
}
