'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions';

export function AccountActions({ isActive }: { isActive: boolean }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!confirm('Abo wirklich kündigen? Der Zugriff bleibt bis zum Ende der aktuellen Periode bestehen.')) {
      return;
    }
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch('/api/account/cancel', { method: 'POST' });
      if (!res.ok) {
        const bodyText = await res.text().catch(() => '');
        let message = '';
        try {
          message = JSON.parse(bodyText)?.error ?? '';
        } catch {
          message = bodyText;
        }
        throw new Error(
          message && !/^</.test(message)
            ? message
            : `Kündigung fehlgeschlagen (${res.status}). Bitte versuche es erneut oder kontaktiere den Support.`
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kündigung fehlgeschlagen. Bitte versuche es erneut oder kontaktiere den Support.');
    } finally {
      setCancelling(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <>
      {isActive ? (
        <button className="btn btn-danger-outline btn-block" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? 'Wird gekündigt…' : 'Abo kündigen'}
        </button>
      ) : (
        <Link href="/pricing" className="btn btn-blue btn-block">
          Abo abschließen
        </Link>
      )}
      {error && (
        <p style={{ color: 'var(--danger, #c0392b)', fontSize: 13.5, marginTop: 8 }}>{error}</p>
      )}
      <button className="btn btn-outline btn-block" style={{ marginTop: 10 }} onClick={handleLogout}>
        Abmelden
      </button>
    </>
  );
}
