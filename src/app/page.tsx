import { redirect } from 'next/navigation';

// The root URL redirects to the waitlist — update once the marketing site is ready.
export default function Home() {
  redirect('/waitlist');
}
