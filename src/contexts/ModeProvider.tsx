import React, { createContext, useContext, useState, ReactNode, useEffect, useTransition } from 'react';

interface ModeContextType {
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  toggleMode: (mode: string) => void;
}

// Create the context with an initial undefined value
const ModeContext = createContext<ModeContextType | undefined>(undefined);

// ModeProvider component that will provide the mode context to its children
export function ModeProvider({ children }: { readonly children: ReactNode }) {
  // Default to dark so the server renders real, indexable HTML instead of a
  // loader. The effect below reconciles with the stored or system preference
  // right after hydration (light-theme users see one dark frame at most).
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [, startTransition] = useTransition();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setMode('light');
    }
  }, []);

  const toggleMode = (mode: string) => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    startTransition(() => {
      setMode(newMode);
    });
    localStorage.setItem('theme', newMode);
  }

  return (
      <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
        {children}
      </ModeContext.Provider>
  )
}

// Custom hook to use the mode context
export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
