// store/SearchStore.ts
// ИЗМЕНЕНИЯ:
// 1. Убран массив `categories` — поиск теперь только по товарам
// 2. `setResults` принимает один массив вместо двух
// 3. `totalResults` считает только products.length
// 4. Тип продукта вынесен в отдельный интерфейс для ясности

import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';
import type { Category, Product } from '@/payload-types';

// Продукт с обязательно подгруженной категорией (depth: 1 в API)
export type ProductWithCategory = Product & {
  category?: Pick<Category, 'id' | 'name' | 'slug'> | string;
};

export class SearchStore {
  isOpen = false;
  query = '';
  loading = false;
  products: ProductWithCategory[] = [];
  activeIndex = -1;

  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  // Вычисляемое свойство — только товары
  get totalResults(): number {
    return this.products.length;
  }

  open(): void {
    this.isOpen = true;
    this.activeIndex = -1;
  }

  close(): void {
    this.isOpen = false;
    this.reset();
  }

  setQuery(q: string): void {
    this.query = q;
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  // Упрощённый setResults — только товары
  setResults(products: ProductWithCategory[]): void {
    this.products = products;
    this.activeIndex = -1;
  }

  setActiveIndex(index: number): void {
    this.activeIndex = index;
  }

  reset(): void {
    this.query = '';
    this.loading = false;
    this.products = [];
    this.activeIndex = -1;
  }
}