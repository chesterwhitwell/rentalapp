import { signOutAction } from '@/app/actions';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { getMemberships } from '@/lib/auth/organisation';
import { requireUser } from '@/lib/auth/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const memberships = await getMemberships();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b bg-white px-6">
          <div>
            <p className="text-sm font-medium">{memberships[0]?.organisations?.name ?? 'Organisation'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit">Sign out</Button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
