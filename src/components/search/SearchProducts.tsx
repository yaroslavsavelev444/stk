// components/search/SearchProducts.tsx
// ИЗМЕНЕНИЯ:
// 1. Убран offset (categories больше нет)
// 2. activeIndex теперь напрямую соответствует индексу в массиве products
// 3. Добавлен индикатор загрузки
// 4. Заголовок секции убран (по ТЗ нет секций — только список товаров)

import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { SearchResultItem } from './SearchResultItem';

export const SearchProducts = observer(() => {
  const searchStore = useSearchStore();
  const { products, activeIndex, loading } = searchStore;

  // Состояние загрузки
  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-gray-400 animate-pulse">
        Поиск…
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <ul className="space-y-1">
      {products.map((prod, idx) => (
        <SearchResultItem
          key={prod.id}
          item={prod}
          isActive={activeIndex === idx}
          index={idx}
        />
      ))}
    </ul>
  );
});