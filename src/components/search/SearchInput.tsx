// components/search/SearchInput.tsx
import { forwardRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { Icon } from '@once-ui-system/core';

export const SearchInput = observer(
  forwardRef<HTMLInputElement>(function SearchInputRef(props, ref) {
    const searchStore = useSearchStore();

    return (
      <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Icon name="search" className="w-5 h-5 text-gray-400 mr-3" />
        <input
          ref={ref}
          type="text"
          value={searchStore.query}
          onChange={(e) => searchStore.setQuery(e.target.value)}
          placeholder="Поиск товаров и категорий..."
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {searchStore.loading && (
          <div className="w-4 h-4 border-2 border-t-transparent border-primary-500 rounded-full animate-spin" />
        )}
      </div>
    );
  })
);