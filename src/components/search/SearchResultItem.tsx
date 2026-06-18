// components/search/SearchResultItem.tsx
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { Category, Product } from '@/payload-types';

type SearchItem = Category | (Product & { category?: Category });

interface Props {
  item: SearchItem;
  isActive: boolean;
  index: number;
}

export const SearchResultItem = observer(({ item, isActive, index }: Props) => {
  const searchStore = useSearchStore();
  const isCategory = 'category' in item;
  const name = item.name;
  const slug = item.slug;
  const categoryName = isCategory ? (item as Product).category?.name : null;

  const handleClick = () => {
    const type = isCategory ? 'product' : 'category';
    window.location.href = `/${type}s/${slug}`;
    searchStore.close();
  };

  return (
    <li
      onMouseEnter={() => searchStore.setActiveIndex(index)}
      onClick={handleClick}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
        ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
        transition-colors duration-150
      `}
    >
      <div>
        <span className="text-gray-800 dark:text-gray-200">{name}</span>
        {categoryName && (
          <span className="ml-2 text-sm text-gray-400">· {categoryName}</span>
        )}
      </div>
      <span className="text-xs text-gray-400">
        {isCategory ? '📦' : '📁'}
      </span>
    </li>
  );
});