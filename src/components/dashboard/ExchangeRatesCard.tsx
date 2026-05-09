import type { T } from '@/lib/i18n';

export default function ExchangeRatesCard({
  eurRon,
  usdRon,
  t,
}: {
  eurRon: number;
  usdRon: number;
  t: T;
}) {
  return (
    <div className="card assets-card" style={{ height: 'auto' }}>
      <div className="card-header">
        <span className="card-title">{t.marketInsights}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          {t.exchangeRates}
        </p>
        <div className="exchange-rate">
          <span>🇪🇺</span>
          <span>EUR / RON</span>
          <span style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>
            {eurRon.toFixed(4)}
          </span>
          <span className="rate-trend trend-up">↑</span>
        </div>
        <div className="exchange-rate">
          <span>🇺🇸</span>
          <span>USD / RON</span>
          <span style={{ marginLeft: 'auto', color: 'var(--accent-green)' }}>
            {usdRon.toFixed(4)}
          </span>
          <span className="rate-trend trend-up">↑</span>
        </div>
      </div>
    </div>
  );
}
