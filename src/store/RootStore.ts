// store/RootStore.ts
import { SearchStore } from './searchStore';

export class RootStore {
  searchStore: SearchStore;

  constructor() {
    this.searchStore = new SearchStore(this);
  }
}

export const rootStore = new RootStore();