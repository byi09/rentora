'use client';

import { usePathname } from 'next/navigation';
import Footer from './ui/Footer';
import Header from './ui/Header';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

const excludeFooterPaths = ['/map'];

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="h-[100svh] bg-white overflow-x-hidden">
      <Header user={user} />

      {/* Page transition wrapper */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {!excludeFooterPaths.includes(pathname) && <Footer />}
    </div>
  );
};
