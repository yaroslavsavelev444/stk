// context/RootStoreContext.tsx
'use client';

import { createContext, ReactNode, useContext } from 'react';
import { RootStore, rootStore } from '@/store/RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};

// Хук для получения всего RootStore
export const useRootStore = (): RootStore => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return context;
};

// Специализированные хуки для каждого стора (рекомендуемый подход)
export const useSearchStore = () => useRootStore().searchStore;
// export const useAuthStore = () => useRootStore().authStore;
// export const useUiStore = () => useRootStore().uiStore;