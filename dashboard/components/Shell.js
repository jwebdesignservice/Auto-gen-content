'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icons';

const NAV = [
  { href: '/', label: 'Overview', icon: 'home' },
  { href: '/uploads', label: 'Uploads', icon: 'film' },
  { href: '/performance', label: 'Performance', icon: 'chart' },
  { href: '/library', label: 'Work Library', icon: 'layers' },
  { href: '/how-it-works', label: 'How It Works', icon: 'workflow' },
];

export default function Shell({ children }) {
  const path = usePathname();
  const isActive = (href) => (href === '/' ? path === '/' : path.startsWith(href));
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="Fast Launch" />
          <div>
            <div className="name">Fast Launch</div>
            <div className="sub">Content Engine</div>
          </div>
        </Link>
        <nav>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-link${isActive(n.href) ? ' active' : ''}`}>
              <Icon name={n.icon} />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">v0.1 · fastlaunchmvp.com</div>
      </aside>
      <main className="main">
        <div className="mobile-top">
          <img src="/logo.png" alt="" />
          <span className="name">Fast Launch</span>
        </div>
        {children}
      </main>
    </div>
  );
}
