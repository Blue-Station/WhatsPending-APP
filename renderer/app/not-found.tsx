import { redirect } from 'next/navigation.js';

export default function notFound(): void {
  // redirect to home page
  redirect('/home');
}
