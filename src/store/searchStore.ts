// store/SearchStore.ts
import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';
import type { Category, Product } from '@/types/payload-types';

export class SearchStore {
  isOpen = false;
  query = '';
  loading = false;
  categories: Category[] = [];
  products: (Product & { category?: Category })[] = [];
  activeIndex = -1;

  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  // Вычисляемое свойство – общее количество результатов
  get totalResults() {
    return this.categories.length + this.products.length;
  }

  open() {
    this.isOpen = true;
    this.activeIndex = -1;
  }

  close() {
    this.isOpen = false;
    this.reset();
  }

  setQuery(q: string) {
    this.query = q;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setResults(categories: Category[], products: (Product & { category?: Category })[]) {
    this.categories = categories;
    this.products = products;
    this.activeIndex = -1;
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  reset() {
    this.query = '';
    this.loading = false;
    this.categories = [];
    this.products = [];
    this.activeIndex = -1;
  }
}