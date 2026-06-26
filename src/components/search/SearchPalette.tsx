'use client';

import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { Modal } from '@once-ui-system/core';
import { SearchInput } from './SearchInput';
import { SearchProducts } from './SearchProducts';
import { SearchEmpty } from './SearchEmpty';
import type { InputRef } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EnterOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useSearch } from '../hooks/useSearch';
import { useKeyboard } from '../hooks/useKeyboard';

export const SearchPalette = observer(() => {
  const searchStore = useSearchStore();
  const inputRef = useRef<InputRef>(null);

  useSearch();
  useKeyboard();

  useEffect(() => {
    if (searchStore.isOpen) {
      // Фокусируем только если инпут ещё не в фокусе
      const inputElement = inputRef.current?.input;
      if (inputElement && document.activeElement !== inputElement) {
        setTimeout(() => inputElement.focus(), 0);
      }
    }
  }, [searchStore.isOpen]);

  return (
    <Modal
      isOpen={searchStore.isOpen}
      onClose={() => searchStore.close()}
      backdrop={<div className="fixed inset-0 bg-black/30 backdrop-blur-md" />}
      title={null}
    >
      <div
        className="
          search-palette-wrapper w-full max-w-2xl mx-auto rounded-3xl overflow-hidden
          shadow-2xl bg-white/95 backdrop-blur-2xl border border-white/60
        "
      >
        <SearchInput ref={inputRef} />

        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <SearchProducts />
          <SearchEmpty />
        </div>

        <div className="px-5 py-3 border-t border-black/5 text-xs text-gray-400 flex items-center justify-between bg-white/70">
          <span className="flex items-center gap-1.5">
            <ArrowUpOutlined className="w-3 h-3" />
            <ArrowDownOutlined className="w-3 h-3" />
            <span className="ml-1">навигация</span>
          </span>
          <span className="flex items-center gap-1.5">
            <EnterOutlined className="w-3 h-3" />
            <span>выбор</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CloseOutlined className="w-3 h-3" />
            <span>закрыть</span>
          </span>
        </div>
      </div>
    </Modal>
  );
});