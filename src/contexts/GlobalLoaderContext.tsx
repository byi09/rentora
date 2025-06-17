"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalLoaderState {
  loading: boolean;
  show: () => void;
  hide: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderState | null>(null);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  const value: GlobalLoaderState = {
    loading,
    show: () => setLoading(true),
    hide: () => setLoading(false),
  };

  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const ctx = useContext(GlobalLoaderContext);
  if (!ctx) throw new Error('useGlobalLoader must be used within GlobalLoaderProvider');
  return ctx;
} 