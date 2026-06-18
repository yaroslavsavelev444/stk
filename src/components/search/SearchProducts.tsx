// components/search/SearchProducts.tsx
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { SearchResultItem } from './SearchResultItem';

export const SearchProducts = observer(() => {
  const searchStore = useSearchStore();
  const { categories, products, activeIndex } = searchStore;
  const offset = categories.length;

  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Товары
      </h3>
      <ul className="space-y-1">
        {products.map((prod, idx) => (
          <SearchResultItem
            key={prod.id}
            item={prod}
            isActive={activeIndex === offset + idx}
            index={offset + idx}
          />
        ))}
      </ul>
    </div>
  );
});