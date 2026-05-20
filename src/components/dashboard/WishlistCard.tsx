'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { WishlistItem } from '@/types';
import type { T } from '@/lib/i18n';
import AddWishlistModal from '@/components/modals/AddWishlistModal';
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';

export default function WishlistCard({
  items,
  netWorth,
  symbol,
  lang,
  t,
}: {
  items: WishlistItem[];
  netWorth: number;
  symbol: string;
  lang: string;
  t: T;
}) {
  const router = useRouter();
  const [manageMode, setManageMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<WishlistItem | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [batchConfirm, setBatchConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete() {
    if (deleteId === null) return;
    setLoading(true);
    setDeleteError(null);
    const res = await fetch(`/api/wishlist/${deleteId}`, { method: 'DELETE' });
    setLoading(false);
    if (!res.ok) { setDeleteError('Eroare la ștergere. Încearcă din nou.'); return; }
    setDeleteId(null);
    router.refresh();
  }

  async function handleBatchDelete() {
    setLoading(true);
    setDeleteError(null);
    const res = await fetch('/api/wishlist/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setLoading(false);
    if (!res.ok) { setDeleteError('Eroare la ștergere. Încearcă din nou.'); setBatchConfirm(false); return; }
    setSelected(new Set());
    setManageMode(false);
    setBatchConfirm(false);
    router.refresh();
  }

  return (
    <>
      <div className={`card tips-card wishlist-card${manageMode ? ' manage-mode' : ''}`}>
        <div className="card-header">
          <span className="card-title">{t.savingsObjectives}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-view-all btn-manage"
              onClick={() => { setManageMode(!manageMode); setSelected(new Set()); }}
            >
              {manageMode ? t.done : t.manage}
            </button>
            <button className="btn-view-all" onClick={() => setShowAdd(true)}>
              + {t.addItem}
            </button>
          </div>
        </div>

        {manageMode && selected.size > 0 && (
          <div id="batchDeleteBar" style={{ marginBottom: '1rem' }}>
            <button
              className="btn-danger"
              style={{ width: '100%', padding: '0.5rem' }}
              onClick={() => setBatchConfirm(true)}
            >
              {t.deleteSelected} ({selected.size})
            </button>
          </div>
        )}

        <div className="wishlist-container">
          {items.length === 0 ? (
            <div className="empty-day-state">{t.noItems}</div>
          ) : (
            items.map((item) => {
              const pct = Math.min(100, (netWorth / item.price) * 100);
              const remaining = Math.max(0, item.price - netWorth);
              return (
                <div key={item.id} className="wishlist-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {manageMode && (
                      <div className="wish-checkbox-wrapper" style={{ marginRight: '0.5rem' }}>
                        <input
                          type="checkbox"
                          className="wish-cb"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </div>
                    )}
                    <span style={{ fontWeight: 500, flex: 1 }}>{item.item_name}</span>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
                      {symbol}{Number(item.price).toLocaleString('ro-RO', { minimumFractionDigits: 2 })}
                    </span>
                    {!manageMode && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          onClick={() => setEditItem(item)}
                        >
                          <ion-icon name="pencil-outline" />
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
                          onClick={() => setDeleteId(item.id)}
                        >
                          <ion-icon name="trash-outline" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 100
                          ? 'linear-gradient(90deg, #00e5a0, #00b377)'
                          : 'linear-gradient(90deg, var(--accent-purple), #6366f1)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <span style={{ color: pct >= 100 ? 'var(--accent-green)' : 'inherit' }}>
                      {pct >= 100 ? '🎉 ' : ''}{pct.toFixed(0)}% {t.completed}
                    </span>
                    <span>{symbol}{remaining.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} {t.remaining}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showAdd && <AddWishlistModal t={t} onClose={() => setShowAdd(false)} />}
      {editItem && <AddWishlistModal t={t} editItem={editItem} onClose={() => setEditItem(undefined)} />}
      {deleteError && <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', padding: '0.5rem', textAlign: 'center' }}>{deleteError}</div>}
      {deleteId !== null && (
        <ConfirmDeleteModal t={t} loading={loading} onConfirm={handleDelete} onCancel={() => { setDeleteId(null); setDeleteError(null); }} />
      )}
      {batchConfirm && (
        <ConfirmDeleteModal t={t} loading={loading} onConfirm={handleBatchDelete} onCancel={() => { setBatchConfirm(false); setDeleteError(null); }} />
      )}
    </>
  );
}
