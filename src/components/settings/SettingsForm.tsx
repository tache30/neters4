'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const CURRENCIES = ['USD', 'EUR', 'RON', 'GBP', 'CHF', 'JPY', 'CAD'];
const LANGUAGES = [{ value: 'en', label: 'English' }, { value: 'ro', label: 'Română' }];

export default function SettingsForm({
  defaultCurrency,
  defaultLanguage,
  username,
}: {
  defaultCurrency: string;
  defaultLanguage: string;
  username: string;
}) {
  const router = useRouter();
  const [currency, setCurrency] = useState(defaultCurrency);
  const [language, setLanguage] = useState(defaultLanguage);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, language }),
    });
    setSaving(false);
    if (!res.ok) { setSaveError('Eroare. Încearcă din nou.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await fetch('/api/account', { method: 'DELETE' });
    if (!res.ok) { setDeleting(false); return; }
    await signOut({ redirectTo: '/' });
  }

  return (
    <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Profil</h2>
        <div className="form-group">
          <label>Utilizator</label>
          <input type="text" value={username} disabled style={{ opacity: 0.6 }} />
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Preferințe</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Monedă</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Limbă</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          {saveError && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{saveError}</p>}
          <button className="btn-submit" type="submit" disabled={saving}>
            {saved ? '✓ Salvat!' : saving ? 'Se salvează...' : 'Salvează'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Cont</h2>
        <button
          className="btn-ghost"
          style={{ width: '100%', marginBottom: '1rem' }}
          onClick={() => signOut({ redirectTo: '/' })}
        >
          <ion-icon name="log-out-outline" /> Deconectare
        </button>
        {!confirmDelete ? (
          <button className="btn-danger" style={{ width: '100%' }} onClick={() => setConfirmDelete(true)}>
            <ion-icon name="trash-outline" /> Șterge Contul
          </button>
        ) : (
          <div style={{ border: '1px solid var(--accent-red)', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Această acțiune este ireversibilă. Toate datele vor fi șterse permanent.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>Anulează</button>
              <button className="btn-danger" style={{ flex: 1 }} disabled={deleting} onClick={handleDeleteAccount}>
                {deleting ? 'Se șterge...' : 'Confirm Ștergere'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
