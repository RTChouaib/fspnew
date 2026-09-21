import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionAdminEmail, listUsersForAdmin } from '@/lib/admin';
import { grantAccessAction } from './actions';
import { RevokeButton } from './RevokeButton';

function formatDate(d: Date | null) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(d);
}

export default async function AdminPage() {
  const adminEmail = await getSessionAdminEmail();
  if (!adminEmail) redirect('/login');

  const users = await listUsersForAdmin();

  return (
    <div className="wrap narrow" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="eyebrow">Angemeldet als {adminEmail}</div>
      <h2>Admin</h2>
      <p className="small-muted">Zugriff manuell vergeben oder entziehen — z. B. für Tests oder Support.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>Zugriff vergeben</h3>
        <form action={grantAccessAction} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: '1 1 220px', marginBottom: 0 }}>
            <label htmlFor="email">E-Mail-Adresse</label>
            <input id="email" name="email" type="email" placeholder="name@beispiel.de" required />
          </div>
          <div className="field" style={{ width: 140, marginBottom: 0 }}>
            <label htmlFor="days">Tage</label>
            <input id="days" name="days" type="number" min={1} defaultValue={365} required />
          </div>
          <button type="submit" className="btn btn-blue" style={{ height: 46 }}>
            Vergeben
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: 36, fontSize: 16 }}>Alle Nutzer ({users.length})</h3>
      <div className="card-flat" style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '10px 14px' }}>E-Mail</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px' }}>Plan</th>
              <th style={{ padding: '10px 14px' }}>Läuft bis</th>
              <th style={{ padding: '10px 14px' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: (typeof users)[number]) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px' }}>{u.email}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span className="badge">{u.subscription?.status ?? 'free'}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>{u.subscription?.plan ?? '—'}</td>
                <td style={{ padding: '10px 14px' }}>{formatDate(u.subscription?.currentPeriodEnd ?? null)}</td>
                <td style={{ padding: '10px 14px' }}>
                  {u.subscription?.status === 'active' && <RevokeButton email={u.email} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="small-muted" style={{ marginTop: 24 }}>
        <Link href="/dashboard">Zurück zur App</Link>
      </p>
    </div>
  );
}
