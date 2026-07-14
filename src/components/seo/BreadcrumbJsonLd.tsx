import type { BreadcrumbItem } from "@/components/UI/Breadcrumbs/Breadcrumbs";

/**
 * Структурированные данные BreadcrumbList для страницы. Принимает тот же
 * массив BreadcrumbItem, что и визуальный компонент Breadcrumbs — так путь
 * в JSON-LD и на экране всегда формируются из одного источника и не могут
 * разойтись.
 */
export function BreadcrumbJsonLd({
  siteUrl,
  items,
}: {
  siteUrl: string;
  items: BreadcrumbItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
      .filter((item) => item.href)
      .map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        item: `${siteUrl}${item.href}`,
      })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
