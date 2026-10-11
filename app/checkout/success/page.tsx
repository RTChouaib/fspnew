import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getSubscription } from '@/lib/progress';

export default async function CheckoutSuccessPage() {
  const userId = await getCurrentUserId();
  const subscription = userId ? await getSubscription(userId) : null;
  const active = subscription?.status === 'active' || subscription?.status === 'trial';
  return (
    <main className="wrap narrow" style={{ paddingTop: 64, paddingBottom: 64, textAlign: 'center' }}>
      <div className="eyebrow">Polar Checkout</div>
      <h1>{active ? 'Zahlung bestätigt' : 'Zahlung wird bestätigt'}</h1>
      <p>{active
        ? 'Dein Zugang ist aktiv. Du kannst jetzt mit dem Lernen beginnen.'
        : 'Deine Zahlung wurde möglicherweise abgeschlossen. Wir gleichen den Status sicher mit Polar ab. Bitte aktualisiere diese Seite in einigen Sekunden, falls dein Zugang noch nicht aktiv ist.'}</p>
      <p style={{ marginTop: 24 }}><Link href={active ? '/dashboard' : '/account'} className="btn btn-blue">{active ? 'Zum Lernen' : 'Zum Konto'}</Link></p>
      <p className="small-muted" style={{ marginTop: 12 }}>Der Zugang wird erst nach serverseitiger Prüfung der Polar-Benachrichtigung freigeschaltet.</p>
    </main>
  );
}
