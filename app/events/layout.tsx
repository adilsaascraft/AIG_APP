'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show HomeNavbar only on /events (not nested routes)
  const showNavbar = pathname === '/events';

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
