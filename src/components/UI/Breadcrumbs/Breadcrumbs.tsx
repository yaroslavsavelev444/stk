"use client";

import { Breadcrumb } from "antd";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import Link from "next/link";
import React from "react";

/**
 * Единый формат данных для хлебных крошек на всём сайте. Каждая страница
 * сама формирует этот массив (обычно 2-4 элемента: главная, промежуточные
 * разделы, текущая страница) и передаёт его сюда — единственному месту,
 * которое знает, как их отрисовать.
 *
 * href у последнего элемента не обязателен для отображения (последний
 * элемент всегда рендерится как текст, а не ссылка), но стоит указывать
 * его всегда: тот же массив используется для JSON-LD BreadcrumbList
 * (см. components/seo/BreadcrumbJsonLd), которому нужен путь и последнего,
 * текущего элемента тоже.
 */
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
}) => {
  const antItems: ItemType[] = items.map((item) => ({
    title: item.title,
    href: item.href,
  }));

  return (
    <nav
      aria-label="Хлебные крошки"
      className={`flex w-full justify-start${className ? ` ${className}` : ""}`}
    >
      <Breadcrumb
        items={antItems}
        itemRender={(route, _params, routes) => {
          const isLast = route === routes[routes.length - 1];
          return isLast ? (
            <span className="text-[var(--text-primary)] font-medium">
              {route.title}
            </span>
          ) : (
            <Link
              href={route.href || "#"}
              className="hover:text-[var(--primary)] transition-colors"
            >
              {route.title}
            </Link>
          );
        }}
      />
    </nav>
  );
};
