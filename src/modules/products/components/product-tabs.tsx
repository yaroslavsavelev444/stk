'use client';

import React, { useState } from 'react';
import type { Product } from '@/payload-types';
import TabPanel from './TabPanel';
import TabDescription from './TabDescription';
import TabAttributes from './TabAttributes';
import TabDocuments from './TabDocuments';

type ProductTabsProps = {
  product: Product;
};

export default function ProductTabs({ product }: ProductTabsProps) {
  const [openTab, setOpenTab] = useState<string | null>(null);

  const toggleTab = (id: string) => {
    setOpenTab(prev => (prev === id ? null : id));
  };

  // Проверки наличия данных
  const hasDescription = Boolean(product.description);
  const hasAttributes =
    Array.isArray(product.attributes) &&
    product.attributes.some(attr => attr.values && attr.values.length > 0);
  const hasDocuments =
    Array.isArray(product.documents) && product.documents.length > 0;

  // Собираем доступные вкладки
  const tabs = [
    {
      id: 'description',
      label: 'Описание',
      available: hasDescription,
      content: <TabDescription product={product} />,
    },
    {
      id: 'attributes',
      label: 'Характеристики',
      available: hasAttributes,
      content: <TabAttributes product={product} />,
    },
    {
      id: 'documents',
      label: 'Документы',
      available: hasDocuments,
      content: <TabDocuments product={product} />,
    },
  ].filter(t => t.available);

  if (tabs.length === 0) return null;

  return (
    <div className="product-tabs" role="tablist" aria-label="Информация о товаре">
      {tabs.map(tab => (
        <TabPanel
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isOpen={openTab === tab.id}
          onToggle={toggleTab}
        >
          {tab.content}
        </TabPanel>
      ))}
      <style>{`
        .product-tabs {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--surface);
        }
        .product-tabs__item {
          border-bottom: 1px solid var(--border-light);
        }
        .product-tabs__item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}