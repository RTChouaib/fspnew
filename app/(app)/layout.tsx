import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getSubscription, canAccess } from '@/lib/progress';
import { AppNavigation } from '@/components/AppNavigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  const subscription = await getSubscription(userId);
  if (!canAccess(subscription, 'full')) redirect('/pricing?reason=paid');

  return (
    <div className="app-frame">
      <AppNavigation />
      <main className="app-main"><div className="app-content">{children}</div></main>
    </div>
  );
}
