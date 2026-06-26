import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import type { ProductWithCategory } from '@/store/searchStore';

interface Props {
  item: ProductWithCategory;
  isActive: boolean;
  index: number;
}

export const SearchResultItem = observer(({ item, isActive, index }: Props) => {
  const searchStore = useSearchStore();

  const categoryName =
    typeof item.category === 'object' && item.category !== null
      ? item.category.name
      : null;

  const handleClick = (): void => {
    if (!item.slug) return;
    window.location.href = `/products/${item.slug}`;
    searchStore.close();
  };

  return (
    <li
      onMouseEnter={() => searchStore.setActiveIndex(index)}
      onClick={handleClick}
      className={`
        grid grid-cols-[1fr_auto] gap-2 px-3 py-2 rounded-lg cursor-pointer
        transition-colors duration-150
        ${
          isActive
            ? 'bg-blue-100 dark:bg-primary-900/40' // яркий фон для активного состояния
            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <span className="text-black break-words min-w-0">{item.name}</span>
      {categoryName && (
        <span className="text-black text-right break-words">{categoryName}</span>
      )}
    </li>
  );
});