'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthForm({ defaultMode = 'login' }: { defaultMode?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(
    defaultMode === 'register' ? 'register' : 'login'
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError('Email sau parolă incorectă.');
    } else {
      router.push('/dashboard');
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: fd.get('username'),
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setLoading(false);
      setError(data.error === 'exists' ? 'Email-ul există deja.' : 'Eroare la înregistrare.');
      return;
    }
    await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    });
    setLoading(false);
    router.push('/dashboard?welcome=1');
  }

  return (
    <div className="auth-overlay" style={{ display: 'flex' }}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{mode === 'login' ? '🏦 Neters Banking' : '✨ Cont Nou'}</h2>
          <p>
            {mode === 'login' ? 'Autentifică-te în contul tău' : 'Creează-ți contul gratuit'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required placeholder="email@exemplu.com" />
            </div>
            <div className="form-group">
              <label>Parolă</label>
              <input name="password" type="password" required placeholder="••••••••" />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Nu ai cont?{' '}
              <button className="auth-toggle-btn" type="button" onClick={() => { setMode('register'); setError(''); }}>
                Înregistrează-te
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nume utilizator</label>
              <input name="username" type="text" required placeholder="Ion Popescu" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required placeholder="email@exemplu.com" />
            </div>
            <div className="form-group">
              <label>Parolă</label>
              <input name="password" type="password" required placeholder="••••••••" minLength={6} />
            </div>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Se înregistrează...' : 'Creează Cont'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Ai deja cont?{' '}
              <button className="auth-toggle-btn" type="button" onClick={() => { setMode('login'); setError(''); }}>
                Autentifică-te
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
