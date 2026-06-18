'use client';

import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';

export const Breadcrumbs = () => {
  const items = [
    { href: '/', title: 'Главная' },
    { title: 'Контакты' },
  ];

  return (
    <Breadcrumb
      items={items}
      itemRender={(route, params, routes, paths) => {
        const isLast = route === routes[routes.length - 1];
        return isLast ? (
          <span className="text-[var(--text-primary)] font-medium">{route.title}</span>
        ) : (
          <Link href={route.href || '#'} className="hover:text-[var(--primary)] transition-colors">
            {route.title}
          </Link>
        );
      }}
    />
  );
};