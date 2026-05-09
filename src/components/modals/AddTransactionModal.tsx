'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { T } from '@/lib/i18n';

export default function AddTransactionModal({ t, onClose }: { t: T; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

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
        type: fd.get('type'),
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
            <label>{t.title}</label>
            <input name="title" type="text" required placeholder="ex: Salariu, Chirie..." />
          </div>
          <div className="form-group">
            <label>{t.amount}</label>
            <input name="amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>{t.date}</label>
            <input name="date" type="date" defaultValue={today} required />
          </div>
          <div className="form-group">
            <label>{t.type}</label>
            <select name="type">
              <option value="expense">{t.expense}</option>
              <option value="income">{t.income}</option>
            </select>
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
