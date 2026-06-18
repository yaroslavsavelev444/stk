'use client';

import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { useSearch } from '../hooks/useSearch';
import { useKeyboard } from '../hooks/useKeyboard';
import { Modal } from '@once-ui-system/core';
import { SearchInput } from './SearchInput';
import { SearchCategories } from './SearchCategories';
import { SearchProducts } from './SearchProducts';
import { SearchEmpty } from './SearchEmpty';
import type { InputRef } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, EnterOutlined, XOutlined, } from '@ant-design/icons';

export const SearchPalette = observer(() => {
  const searchStore = useSearchStore();
  const inputRef = useRef<InputRef>(null);

  useSearch();
  useKeyboard();

  useEffect(() => {
    if (searchStore.isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [searchStore.isOpen]);

  return (
    <Modal
      isOpen={searchStore.isOpen}
      onClose={() => searchStore.close()}
      backdrop={<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />}
      title={null}
    >
      <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-white/10">
        <SearchInput ref={inputRef} />
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <SearchCategories />
          <SearchProducts />
          <SearchEmpty />
        </div>
        <div className="px-4 py-2 border-t border-white/20 dark:border-white/5 text-xs text-gray-400/60 dark:text-gray-500/60 flex items-center justify-between backdrop-blur-sm bg-white/5">
          <span className="flex items-center gap-1.5">
            <ArrowUpOutlined className="w-3 h-3" />
            <ArrowDownOutlined className="w-3 h-3" />
            <span className="ml-1 opacity-70">навигация</span>
          </span>
          <span className="flex items-center gap-1.5">
            <EnterOutlined className="w-3 h-3" />
            <span className="ml-1 opacity-70">выбор</span>
          </span>
          <span className="flex items-center gap-1.5">
            <XOutlined className="w-3 h-3" />
            <span className="ml-1 opacity-70">закрыть</span>
          </span>
        </div>
      </div>
    </Modal>
  );
});