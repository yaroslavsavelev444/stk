// src/components/header/StickyHeader.tsx

import { Flex } from '@once-ui-system/core';
import { TopHeader } from './TopHeader';
import { Header } from './Header';

export const StickyHeader = () => {
  return (
    <Flex
      as="header"
      direction="column"
      fillWidth
      style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        zIndex: 1000,
        background: 'transparent',
      }}
    >
      <TopHeader />
      <Header />
    </Flex>
  );
};