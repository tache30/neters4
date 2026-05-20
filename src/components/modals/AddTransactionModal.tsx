'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { T } from '@/lib/i18n';
import { TRANSACTION_CATEGORIES } from '@/types';

type TxType = 'income' | 'expense';

export default function AddTransactionModal({ t, onClose }: { t: T; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txType, setTxType] = useState<TxType>('expense');
  const [category, setCategory] = useState('other');
  const today = new Date().toISOString().slice(0, 10);

  const visibleCategories = TRANSACTION_CATEGORIES.filter(
    (c) => c.type === txType || c.type === 'both'
  );

  function handleTypeChange(newType: TxType) {
    setTxType(newType);
    setCategory('other');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: fd.get('title'),
        amount: fd.get('amount'),
        date: fd.get('date'),
        type: txType,
        category,
      }),
    });
    setLoading(false);
    if (!res.ok) { setError('Eroare. Încearcă din nou.'); return; }
    onClose();
    router.refresh();
  }

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}><ion-icon name="close-outline" /></button>
        <h2 style={{ marginBottom: '1.5rem' }}>{t.newTransaction}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.type}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: txType === 'expense' ? 'var(--accent-red)' : 'var(--border-color)',
                  background: txType === 'expense' ? 'rgba(255,77,77,0.12)' : 'transparent',
                  color: txType === 'expense' ? 'var(--accent-red)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {t.expense}
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: txType === 'income' ? 'var(--accent-green)' : 'var(--border-color)',
                  background: txType === 'income' ? 'rgba(0,229,160,0.12)' : 'transparent',
                  color: txType === 'income' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {t.income}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{t.category}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {visibleCategories.map((cat) => {
                const labelKey = cat.key as keyof T;
                const label = t[labelKey] as string ?? cat.key;
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    style={{
                      padding: '0.45rem 0.3rem',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--accent-purple)' : 'var(--border-color)',
                      background: isSelected ? 'rgba(176,96,255,0.15)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? 'var(--accent-purple)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 400,
                      textAlign: 'center',
                      lineHeight: 1.3,
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>{t.title}</label>
            <input name="title" type="text" required placeholder="ex: Burger King, Spotify, H&M..." />
          </div>
          <div className="form-group">
            <label>{t.amount}</label>
            <input name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>{t.date}</label>
            <input name="date" type="date" defaultValue={today} required />
          </div>
          {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? '...' : t.save}
          </button>
        </form>
      </div>
    </div>
  );
}
