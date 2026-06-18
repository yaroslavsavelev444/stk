// hooks/useSearch.ts
import { useEffect, useRef } from 'react';
import { useSearchStore } from '@/components/context/RootStoreContext';
import { reaction } from 'mobx';

export function useSearch() {
  const searchStore = useSearchStore();

  useEffect(() => {
    // Отписка от реакции при размонтировании
    const disposer = reaction(
      () => searchStore.query,
      async (query) => {
        if (!query.trim()) {
          searchStore.setResults([], []);
          return;
        }

        searchStore.setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          searchStore.setResults(data.categories || [], data.products || []);
        } catch (error) {
          console.error('Search fetch error:', error);
          searchStore.setResults([], []);
        } finally {
          searchStore.setLoading(false);
        }
      },
      { delay: 300 } // встроенный debounce от MobX
    );

    return () => disposer();
  }, [searchStore]);
}