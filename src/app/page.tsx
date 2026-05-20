import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect('/dashboard');

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-badge">🚀 Finance pentru generația Z</div>
        <h1>Banii tăi, regulile tale</h1>
        <p>
          Urmărește buzunarul, economisește pentru ce vrei cu adevărat
          și află cum funcționează banii — fără complicații.
        </p>
        <div className="hero-ctas">
          <Link href="/auth?mode=register" className="btn-primary">
            Încearcă gratuit
          </Link>
          <Link href="/auth?mode=login" className="btn-secondary">
            Autentificare
          </Link>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <div className="feature-title">Economisește pentru ce contează</div>
          <div className="feature-desc">Adaugă obiective — telefon, concert, trip — și urmărește progresul în timp real.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <div className="feature-title">Controlează abonamentele</div>
          <div className="feature-desc">Spotify, Netflix, game pass — știi exact cât cheltuiești pe lună.</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <div className="feature-title">Sfaturi financiare, instant</div>
          <div className="feature-desc">Asistentul AI îți explică banii pe limba ta — fără jargon bancar.</div>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-browser-mockup">
          <div className="demo-overlay" style={{ pointerEvents: 'none' }}>
            <div className="visitor-action-hint" style={{ pointerEvents: 'auto' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>👆 Demo — Neters</p>
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
              <div className="brand">⚡ neters</div>
              <ul className="nav-links">
                <li><a className="active">🏠 Acasă</a></li>
                <li><a>⚙️ Profil</a></li>
              </ul>
            </div>
            <div className="main-content" style={{ gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ minHeight: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Banii mei 💰</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-green)', margin: '0.5rem 0' }}>1,250 RON</div>
                  <div style={{ height: '80px', background: 'linear-gradient(180deg,rgba(0,229,160,0.2),transparent)', borderRadius: '8px', marginTop: '1rem' }} />
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Visele mele 🎯</div>
                  {[['iPhone 16', 34], ['Concert Coldplay', 78]].map(([name, pct]) => (
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
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Cheltuielile mele</div>
                  {[
                    ['💰 Buzunar', '+200 RON', 'income'],
                    ['🎵 Spotify', '-25 RON', 'expense'],
                    ['🍕 Mâncare', '-45 RON', 'expense'],
                    ['💼 Job Vară', '+500 RON', 'income'],
                  ].map(([label, amount, type]) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #2a2a2a', fontSize: '0.8rem' }}>
                      <span>{label as string}</span>
                      <span style={{ color: type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>{amount as string}</span>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ height: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Curs Valutar 🌍</div>
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
