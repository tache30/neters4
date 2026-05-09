'use client';
import type { T } from '@/lib/i18n';

export default function ConfirmDeleteModal({
  t,
  onConfirm,
  onCancel,
  loading,
}: {
  t: T;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-content">
        <h2 style={{ marginBottom: '0.5rem' }}>{t.confirmDelete}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t.confirmDeleteMsg}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-ghost" onClick={onCancel} style={{ flex: 1 }}>{t.cancel}</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading} style={{ flex: 1 }}>
            {loading ? '...' : t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
