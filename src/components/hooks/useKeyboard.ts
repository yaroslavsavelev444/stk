// hooks/useKeyboard.ts

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
        searchStore.setActiveIndex((searchStore.activeIndex + 1) % total);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchStore.setActiveIndex(
          (searchStore.activeIndex - 1 + total) % total
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = searchStore.products[searchStore.activeIndex];
        if (!selected) return;

        const productSlug = selected.slug;
        if (!productSlug) return;

        // Получаем slug категории
        // Предполагается, что selected.category — объект с полем slug
        const categorySlug = (selected.category as { slug?: string })?.slug;

        if (categorySlug) {
          window.location.href = `/catalog/${categorySlug}/${productSlug}`;
        } else {
          // fallback – если категория не определена (например, в результатах поиска нет)
          // можно использовать /products/${productSlug} или не переходить
          console.warn('Категория не найдена для товара', selected);
          // По желанию: window.location.href = `/products/${productSlug}`;
        }
        searchStore.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchStore]);
}