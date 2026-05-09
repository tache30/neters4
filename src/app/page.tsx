import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect('/dashboard');

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-badge">✨ Personal Finance</div>
        <h1>Controlează-ți finanțele cu Neters</h1>
        <p>
          Urmărește veniturile și cheltuielile, gestionează obiective de economii,
          plăți recurente și primește sfaturi de la asistentul AI bancar.
        </p>
        <div className="hero-ctas">
          <Link href="/auth?mode=register" className="btn-primary">
            Începe Gratuit
          </Link>
          <Link href="/auth?mode=login" className="btn-secondary">
            Autentificare
          </Link>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-browser-mockup">
          <div className="demo-overlay" style={{ pointerEvents: 'none' }}>
            <div className="visitor-action-hint" style={{ pointerEvents: 'auto' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>👆 Demo — Neters Banking</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Creează un cont gratuit pentru a accesa dashboard-ul complet.
              </p>
              <Link href="/auth?mode=register" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                Creează Cont
              </Link>
            </div>
          </div>
          <div className="demo-content">
            <div className="sidebar">
              <div className="brand">🏦 neters</div>
              <ul className="nav-links">
                <li><a className="active">📊 Dashboard</a></li>
                <li><a>⚙️ Setări</a></li>
              </ul>
            </div>
            <div className="main-content" style={{ gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ minHeight: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Capital</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-green)', margin: '0.5rem 0' }}>$12,450.75</div>
                  <div style={{ height: '80px', background: 'linear-gradient(180deg,rgba(0,208,156,0.2),transparent)', borderRadius: '8px', marginTop: '1rem' }} />
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Obiective</div>
                  {[['MacBook Pro', 85], ['Vacanță', 42]].map(([name, pct]) => (
                    <div key={name as string} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span>{name as string}</span><span style={{ color: 'var(--accent-purple)' }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ height: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tranzacții</div>
                  {[['Salariu', '+$3,200', 'income'], ['Chirie', '-$800', 'expense'], ['Food', '-$120', 'expense']].map(([t, a, type]) => (
                    <div key={t as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #2a2a2a', fontSize: '0.8rem' }}>
                      <span>{t as string}</span>
                      <span style={{ color: type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>{a as string}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ height: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Curs Valutar</div>
                  <div className="exchange-rate" style={{ fontSize: '1.1rem' }}>🇪🇺 EUR/RON <span style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>4.9732</span></div>
                  <div className="exchange-rate" style={{ fontSize: '1.1rem' }}>🇺🇸 USD/RON <span style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>4.5821</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
