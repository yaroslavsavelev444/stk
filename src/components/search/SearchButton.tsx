// components/search/SearchButton.tsx
'use client';

import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';
import { Button, Icon } from '@once-ui-system/core';

export const SearchButton = observer(() => {
  const searchStore = useSearchStore();

  return (
    <Button
      variant='secondary'
      onClick={() => searchStore.open()}
      aria-label="Поиск (⌘K)"
    >
      <Icon name="search" />
    </Button>
  );
});