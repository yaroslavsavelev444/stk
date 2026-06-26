import React from 'react';
import type { Product } from '@/payload-types';

type Props = { product: Product };

export default function TabDescription({ product }: Props) {
  return (
    <p className="tab-content__text">
      {product.description || 'Описание отсутствует.'}
    </p>
  );
}