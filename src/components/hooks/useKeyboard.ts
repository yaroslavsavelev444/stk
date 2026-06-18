// hooks/useKeyboard.ts
import { useEffect } from 'react';
import { useSearchStore } from '@/components/context/RootStoreContext';
import { runInAction } from 'mobx';

export function useKeyboard() {
  const searchStore = useSearchStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Открыть/закрыть по Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchStore.isOpen ? searchStore.close() : searchStore.open();
        return;
      }

      if (!searchStore.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        searchStore.close();
        return;
      }

      const total = searchStore.totalResults;
      if (total === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        runInAction(() => {
          searchStore.activeIndex = (searchStore.activeIndex + 1) % total;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        runInAction(() => {
          searchStore.activeIndex = (searchStore.activeIndex - 1 + total) % total;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const allItems = [...searchStore.categories, ...searchStore.products];
        const selected = allItems[searchStore.activeIndex];
        if (selected) {
          const type = 'category' in selected ? 'product' : 'category';
          window.location.href = `/${type}s/${selected.slug}`;
          searchStore.close();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchStore]);
}