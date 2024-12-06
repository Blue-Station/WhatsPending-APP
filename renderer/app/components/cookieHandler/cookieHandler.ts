'use server';

import { cookies } from 'next/headers';

export async function get(cookieName: string): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName).value;
}

export async function set(cookieName: string, value: string, expireDate?: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({ name: cookieName, value, expires: expireDate ?? (new Date(Date.now() + 34550000000)) });
}

export async function remove(cookieName: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
