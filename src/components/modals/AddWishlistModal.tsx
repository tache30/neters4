'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { T } from '@/lib/i18n';
import type { WishlistItem } from '@/types';

export default function AddWishlistModal({
  t,
  onClose,
  editItem,
}: {
  t: T;
  onClose: () => void;
  editItem?: WishlistItem;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = { item_name: fd.get('item_name'), price: fd.get('price') };

    const res = editItem
      ? await fetch(`/api/wishlist/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
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
        <h2 style={{ marginBottom: '1.5rem' }}>{editItem ? t.editObjective : t.defineObjective}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.itemName}</label>
            <input name="item_name" type="text" required defaultValue={editItem?.item_name} placeholder="ex: Laptop, Vacanță..." />
          </div>
          <div className="form-group">
            <label>{t.targetPrice}</label>
            <input name="price" type="number" step="0.01" min="0.01" required defaultValue={editItem?.price} placeholder="0.00" />
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
