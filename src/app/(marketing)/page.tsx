import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold">Rental Finance Manager</h1>
      <p className="mt-4 text-muted-foreground">
        Track properties, obligations, transactions, and documents in one secure place.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </main>
  );
}
