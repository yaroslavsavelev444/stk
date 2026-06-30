// modules/products/templates/product-info.tsx

'use client';
import React from 'react';
import type { Product } from '@/payload-types';
import AttributeGroup from '../components/AttributeGroup';
import ProductDocuments from '../components/ProductDocuments';

type ProductInfoProps = {
  product: Product;
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const isNew = product.badges?.includes('new') ?? false;

  const attributes =
    product.attributes?.filter((attr) => attr.values && attr.values.length > 0) || [];

  return (
    <div id="product-info" className="flex flex-col gap-5 min-w-0">
      {/* Название */}
      <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-text-primary break-words hyphens-auto">
        {product.name}
      </h1>

      {/* Описание */}
      {product.description && (
        <p className="text-[0.9375rem] leading-relaxed text-text-secondary whitespace-pre-line break-words">
          {product.description}
        </p>
      )}

      {/* Бейджи – без изменений */}
      {product.badges && product.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {isNew && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-primary-light text-primary">
              Новинка
            </span>
          )}
          {product.badges.includes('hit') && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-accent-light text-accent">
              Хит
            </span>
          )}
          {product.badges.includes('sale') && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-danger-light text-danger">
              Акция
            </span>
          )}
          {product.badges.includes('gost') && (
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-success-light text-success">
              ГОСТ
            </span>
          )}
        </div>
      )}

      {/* Характеристики */}
      {attributes.length > 0 && (
        <div className="flex flex-col gap-5">
          {attributes.map((attr, idx) => (
            <AttributeGroup
              key={idx}
              title={attr.title || 'Атрибут'}
              values={attr.values!.map((v) => v.value)}
            />
          ))}
        </div>
      )}

      {/* Документы */}
      <ProductDocuments documents={product.documents} />
    </div>
  );
};

export default ProductInfo;