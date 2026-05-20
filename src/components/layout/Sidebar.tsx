'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand">
        <ion-icon name="flash-outline" />
        neters
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
            <ion-icon name="home-outline" />
            Acasă
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className={pathname === '/dashboard/settings' ? 'active' : ''}>
            <ion-icon name="person-outline" />
            Profil
          </Link>
        </li>
      </ul>
      <div className="get-pro">
        <h3>⚡ Neters</h3>
        <p>Banii tăi, pe limba ta. 💪</p>
      </div>
    </aside>
  );
}
