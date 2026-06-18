'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { useSearch } from '../hooks/useSearch';
import { useKeyboard } from '../hooks/useKeyboard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from './SearchInput';
import { SearchCategories } from './SearchCategories';
import { SearchProducts } from './SearchProducts';
import { SearchEmpty } from './SearchEmpty';
import { RemoveScroll } from 'react-remove-scroll'; 

export const SearchPalette = observer(() => {
  const searchStore = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useSearch();
  useKeyboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchStore.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchStore.isOpen]);

  // Если портальный корень ещё не готов – ничего не рендерим
  if (!mounted) return null;

  // Получаем портальный корень (создадим его чуть ниже)
  const portalRoot = document.getElementById('modal-root');
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {searchStore.isOpen && (
        // Оверлей – position fixed, занимает весь экран, но pointer-events: none,
        // чтобы клики сквозь него не блокировали, но на сам оверлей вешаем обработчик
        <motion.div
          className="fixed inset-0 z-[99999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Затемнение – pointer-events-auto, чтобы перехватывать клик для закрытия */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={() => searchStore.close()}
          />

          {/* Блокировка скролла всей страницы (react-remove-scroll) */}
          <RemoveScroll enabled={searchStore.isOpen} removeScrollBar={false}>
            {/* Сам диалог – абсолютное позиционирование, 20vh от верха, центрирование по горизонтали */}
            <div className="absolute left-1/2 top-[20vh] -translate-x-1/2 w-full max-w-2xl pointer-events-auto p-4">
              <motion.div
                className={`
                  w-full 
                  rounded-2xl 
                  overflow-hidden 
                  shadow-2xl
                  /* Liquid glass effect */
                  bg-gradient-to-br from-white/30 to-white/10 
                  dark:from-white/15 dark:to-white/5
                  backdrop-blur-xl
                  border border-white/30 
                  dark:border-white/10
                  /* fallback для браузеров без backdrop-filter */
                  bg-white/80 dark:bg-gray-900/80
                  [@supports(backdrop-filter:blur(0px))]:bg-white/20 
                  dark:[@supports(backdrop-filter:blur(0px))]:bg-white/10
                `}
                initial={{ scale: 0.95, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <SearchInput ref={inputRef} />
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <SearchCategories />
                  <SearchProducts />
                  <SearchEmpty />
                </div>
                <div className="px-4 py-2 border-t border-white/20 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 flex justify-between backdrop-blur-sm bg-white/5">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white/20 dark:bg-white/10 rounded">↑↓</kbd> навигация
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white/20 dark:bg-white/10 rounded">Enter</kbd> переход
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white/20 dark:bg-white/10 rounded">Esc</kbd> закрыть
                  </span>
                </div>
              </motion.div>
            </div>
          </RemoveScroll>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
});