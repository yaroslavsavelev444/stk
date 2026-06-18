import { forwardRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const SearchInput = observer(
  forwardRef<InputRef>(function SearchInputRef(props, ref) {
    const searchStore = useSearchStore();

    return (
      <div className="flex items-center px-4 py-3 border-b border-black/40 dark:border-white/30">
        <Input
          ref={ref}
          value={searchStore.query}
          onChange={(e) => searchStore.setQuery(e.target.value)}
          placeholder="Поиск товаров и категорий..."
          variant="borderless"
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:shadow-none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          suffix={
            searchStore.loading ? (
              <LoadingOutlined className="text-[var(--text-muted)]" />
            ) : null
          }
        />
      </div>
    );
  })
);