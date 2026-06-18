// components/ModalRoot.tsx
'use client';

import { useEffect, useState } from 'react';

export const ModalRoot = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
    return () => {
      root.remove();
    };
  }, []);

  return null;
};