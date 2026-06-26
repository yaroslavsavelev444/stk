// hooks/useKeyboard.ts
// ИЗМЕНЕНИЯ:
// 1. Навигация теперь только по products (categories убраны)
// 2. Исправлена инверсная логика определения типа элемента при Enter
// 3. URL исправлен: /products/<slug> вместо случайного /${type}s/
// 4. runInAction заменён на вызов setActiveIndex — MobX action уже настроен в store

import { useEffect } from 'react';
import { useSearchStore } from '@/components/context/RootStoreContext';

export function useKeyboard(): void {
  const searchStore = useSearchStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Открыть / закрыть по Cmd+K / Ctrl+K
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
        // Циклическая навигация вниз
        searchStore.setActiveIndex((searchStore.activeIndex + 1) % total);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Циклическая навигация вверх
        searchStore.setActiveIndex(
          (searchStore.activeIndex - 1 + total) % total
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = searchStore.products[searchStore.activeIndex];
        if (!selected) return;

        // Все элементы теперь — товары, URL всегда /products/<slug>
        const slug = selected.slug;
        if (slug) {
          window.location.href = `/products/${slug}`;
        }
        searchStore.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchStore]);
}