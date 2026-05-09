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
    }, 3000);
    return () => clearTimeout(t);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="welcome-screen" onClick={() => { setVisible(false); router.replace('/dashboard'); }}>
      <div className="welcome-text">Bun venit, {username}! 👋</div>
      <div className="welcome-subtext">Contul tău este pregătit.</div>
    </div>
  );
}
