'use client';
import { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';
import type { DashboardChartData } from '@/types';
import type { T } from '@/lib/i18n';
import AddTransactionModal from '@/components/modals/AddTransactionModal';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

type Period = 'day' | 'week' | 'month';

export default function NetWorthCard({
  netWorth,
  chartData,
  currency,
  symbol,
  lang,
  t,
}: {
  netWorth: number;
  chartData: DashboardChartData;
  currency: string;
  symbol: string;
  lang: string;
  t: T;
}) {
  const [period, setPeriod] = useState<Period>('month');
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef<ChartJS<'line'>>(null);

  const current = chartData[period];

  const getGradient = () => {
    const chart = chartRef.current;
    if (!chart) return 'rgba(0,208,156,0.3)';
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0,208,156,0.4)');
    gradient.addColorStop(1, 'rgba(0,208,156,0)');
    return gradient;
  };

  const data = {
    labels: current.labels,
    datasets: [
      {
        data: current.data,
        borderColor: '#00d09c',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        backgroundColor: () => getGradient(),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const isPositive = netWorth >= 0;

  return (
    <>
      <div className="card net-worth-card">
        <div>
          <div className="card-header">
            <span className="card-title">{t.totalCapital}</span>
            <div className="chart-controls">
              {(['day', 'week', 'month'] as Period[]).map((p) => (
                <button
                  key={p}
                  className={`period-btn${period === p ? ' active' : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {t[p]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {isPositive ? '' : '-'}{symbol}{Math.abs(netWorth).toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currency}</span>
          </div>
        </div>
        <div style={{ height: '120px', marginTop: '1rem' }}>
          <Line ref={chartRef} data={data} options={options} />
        </div>
        <button className="btn-add" style={{ marginTop: '1rem', width: 'fit-content' }} onClick={() => setShowModal(true)}>
          <ion-icon name="add-outline" /> {t.addTransaction}
        </button>
      </div>
      {showModal && <AddTransactionModal t={t} onClose={() => setShowModal(false)} />}
    </>
  );
}
