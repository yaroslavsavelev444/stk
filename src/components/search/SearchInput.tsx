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
      <div className="px-5 py-4 border-b border-black/5">
        <Input
          ref={ref}
          value={searchStore.query}
          onChange={(e) => searchStore.setQuery(e.target.value)}
          placeholder="Поиск товаров и категорий..."
          variant="borderless"
          className="flex-1 
                     bg-white/70 
                     hover:bg-white 
                     focus:bg-white 
                     text-[var(--text-primary)] 
                     placeholder:text-[var(--text-muted)]
                     text-lg
                     h-12
                     rounded-2xl
                     px-5
                     focus:shadow-none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          suffix={
            <span className={searchStore.loading ? 'block' : 'hidden'}>
              <LoadingOutlined className="text-[var(--text-muted)]" />
            </span>
          }
        />
      </div>
    );
  })
);