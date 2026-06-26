import React from 'react';
import type { Product } from '@/payload-types';
import AttributeGroup from './AttributeGroup';

type Props = { product: Product };

export default function TabAttributes({ product }: Props) {
  const attributes = product.attributes || [];
  const filtered = attributes.filter(attr => attr.values && attr.values.length > 0);

  if (filtered.length === 0) {
    return <p className="text-[var(--text-muted)] text-sm">Характеристики отсутствуют.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {filtered.map((attr, idx) => (
        <AttributeGroup
          key={idx}
          title={attr.title || 'Атрибут'}
          values={attr.values!.map(v => v.value)}
        />
      ))}
    </div>
  );
}