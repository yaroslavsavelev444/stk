// hooks/useSearch.ts
// ИЗМЕНЕНИЯ:
// 1. setResults теперь принимает один аргумент (только products)
// 2. Задержка debounce оставлена 300 мс — оптимальный баланс
// 3. Добавлена проверка: если запрос стал невалидным пока шёл fetch — результат игнорируется
//    (решает race condition при быстром вводе)
// 4. При ошибке fetch — сбрасываем результаты и логируем

import { useEffect } from 'react';
import { reaction } from 'mobx';
import { useSearchStore } from '@/components/context/RootStoreContext';
import type { ProductWithCategory } from '@/store/searchStore';

export function useSearch(): void {
  const searchStore = useSearchStore();

  useEffect(() => {
    const disposer = reaction(
      () => searchStore.query,
      async (query) => {
        // Пустой запрос — очищаем результаты без запроса к серверу
        if (!query.trim()) {
          searchStore.setResults([]);
          return;
        }

        searchStore.setLoading(true);

        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`,
            {
              // Отменяем запрос если компонент размонтировался
              // (AbortController не нужен здесь — reaction сам чист,
              //  но race condition обрабатываем через проверку query ниже)
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const data: { products: ProductWithCategory[] } = await res.json();

          // Race condition guard: если за время запроса query изменился —
          // игнорируем устаревший ответ
          if (searchStore.query !== query) return;

          searchStore.setResults(data.products ?? []);
        } catch (error) {
          console.error('[useSearch] Fetch error:', error);
          // При ошибке сбрасываем, не показываем "мусор"
          if (searchStore.query === query) {
            searchStore.setResults([]);
          }
        } finally {
          // Убираем лоадер только если это всё ещё актуальный запрос
          if (searchStore.query === query) {
            searchStore.setLoading(false);
          }
        }
      },
      {
        delay: 300, // встроенный debounce MobX reaction
        fireImmediately: false,
      }
    );

    return () => disposer();
  }, [searchStore]); // searchStore — стабильная ссылка из контекста
}