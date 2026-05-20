'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomeScreen({ username }: { username: string }) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      router.replace('/dashboard');
    }, 3500);
    return () => clearTimeout(t);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="welcome-screen" onClick={() => { setVisible(false); router.replace('/dashboard'); }}>
      <div className="welcome-text">Hey, {username}! 👋</div>
      <div className="welcome-subtext" style={{ marginTop: '0.5rem' }}>
        Bine ai venit la Neters — locul unde banii tăi devin mai deștepți.
      </div>
      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(233,213,255,0.6)' }}>
        Adaugă prima tranzacție sau setează un obiectiv de economii. 🚀
      </div>
    </div>
  );
}
