'use client';

import { Breadcrumb } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbsProps {
  /** Массив элементов хлебных крошек */
  items: ItemType[];
  /** Дополнительный CSS-класс для контейнера */
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <Breadcrumb
      className={className}
      items={items}
      itemRender={(route, params, routes) => {
        const isLast = route === routes[routes.length - 1];
        return isLast ? (
          <span className="text-[var(--text-primary)] font-medium">
            {route.title}
          </span>
        ) : (
          <Link
            href={route.href || '#'}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {route.title}
          </Link>
        );
      }}
    />
  );
};