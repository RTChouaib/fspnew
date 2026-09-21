'use client';

import { revokeAccessAction } from './actions';

export function RevokeButton({ email }: { email: string }) {
  return (
    <form
      action={revokeAccessAction}
      onSubmit={(e) => {
        if (!confirm(`Zugriff für ${email} wirklich entziehen?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="email" value={email} />
      <button type="submit" className="btn btn-sm btn-danger-outline">
        Entziehen
      </button>
    </form>
  );
}
