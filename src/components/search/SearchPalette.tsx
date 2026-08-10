"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import { Modal } from "@once-ui-system/core";
import type { InputRef } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSearchStore } from "../context/RootStoreContext";
import { useKeyboard } from "../hooks/useKeyboard";
import { useSearch } from "../hooks/useSearch";
import { SearchEmpty } from "./SearchEmpty";
import { SearchInput } from "./SearchInput";
import { SearchProducts } from "./SearchProducts";

export const SearchPalette = observer(() => {
  const searchStore = useSearchStore();
  const inputRef = useRef<InputRef>(null);

  useSearch();
  // useKeyboard();

  useLayoutEffect(() => {
    if (!searchStore.isOpen) return;

    inputRef.current?.focus();
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

        <div className="p-5 max-h-[60vh] overflow-y-auto" data-lenis-prevent>
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
