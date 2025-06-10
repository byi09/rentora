'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Footer from './ui/Footer';
import Header from './ui/Header';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const excludeFooterPaths = ['/map'];

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Don't show header on auth pages unless user is authenticated
  const isAuthPage = pathname?.includes('/sign-') || pathname?.includes('/auth');
  const showHeader = !isAuthPage || user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header user={user} />}
      <main className={showHeader ? 'pt-16' : ''}>
        {children}
      </main>
      {/* Footer */}
      {!excludeFooterPaths.includes(pathname) && <Footer />}
    </div>
  );
}
