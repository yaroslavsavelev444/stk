// components/search/SearchCategories.tsx
import { observer } from 'mobx-react-lite';
import { SearchResultItem } from './SearchResultItem';
import { useSearchStore } from '../context/RootStoreContext';

export const SearchCategories = observer(() => {
  const searchStore = useSearchStore();
  const { categories, activeIndex } = searchStore;

  if (categories.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Категории
      </h3>
      <ul className="space-y-1">
        {categories.map((cat, idx) => (
          <SearchResultItem
            key={cat.id}
            item={cat}
            isActive={activeIndex === idx}
            index={idx}
          />
        ))}
      </ul>
    </div>
  );
});