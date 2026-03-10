import Link from 'next/link';
import { Home, Building2, Repeat, ArrowLeftRight, Folder, BarChart3, Settings } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/obligations', label: 'Obligations', icon: Repeat },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/documents', label: 'Documents', icon: Folder },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">Rental Finance</h2>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
