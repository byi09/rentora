'use client';

import { usePathname } from 'next/navigation';
import Footer from './ui/Footer';
import Header from './ui/Header';
import type { User } from '@supabase/supabase-js';

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

const excludeFooterPaths = ['/map'];

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="h-[100svh] bg-white">
      <Header user={user} />

      <main className="h-[calc(100%-64.8px)]">
        {children}
      </main>

      {/* Footer */}
      {!excludeFooterPaths.includes(pathname) && (
        <Footer />
      )}
    </div>
  );
};
