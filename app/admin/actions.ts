'use server';

import { revalidatePath } from 'next/cache';
import { adminGrantAccess, adminRevokeAccess } from '@/lib/admin';

export async function grantAccessAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const days = Number(formData.get('days') ?? 0);
  await adminGrantAccess(email, days);
  revalidatePath('/admin');
}

export async function revokeAccessAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  await adminRevokeAccess(email);
  revalidatePath('/admin');
}
