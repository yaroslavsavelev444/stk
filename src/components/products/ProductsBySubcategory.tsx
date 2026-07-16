import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { Product, Subcategory } from "@/payload-types";
import { ProductsGrid } from "./ProductsGrid";

export interface ProductGroup {
  subcategory: Subcategory;
  items: Product[];
}

interface ProductsBySubcategoryProps {
  groups: ProductGroup[];
  /** Товары без подкатегории (или подкатегории вне текущего списка) — показываются последним блоком. */
  ungrouped: Product[];
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div
      className="mx-auto mb-6 flex w-full max-w-7xl items-center gap-3 md:mb-7"
      style={{ paddingInline: "1rem" }}
    >
      <span
        className="inline-block shrink-0 rounded-full"
        style={{ background: "var(--primary)", width: "4px", height: "1.5rem" }}
        aria-hidden="true"
      />
      <h2 className="text-xl font-bold leading-snug text-[var(--text-primary)] md:text-2xl">
        {title}
      </h2>
      <span
        className="rounded-full text-xs font-bold"
        style={{
          background: "var(--surface-secondary)",
          color: "var(--text-muted)",
          paddingLeft: "0.625rem",
          paddingRight: "0.625rem",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
        }}
      >
        {count}
      </span>
    </div>
  );
}

/**
 * Товары категории, сгруппированные по подкатегориям — с заголовком и
 * разделителем перед каждой группой (кроме первой). Переиспользует
 * ProductsGrid для самой сетки товаров, чтобы не дублировать вёрстку карточек.
 */
export function ProductsBySubcategory({ groups, ungrouped }: ProductsBySubcategoryProps) {
  const sections = [
    ...groups.map((group) => ({ key: group.subcategory.id, title: group.subcategory.name, items: group.items })),
    ...(ungrouped.length > 0 ? [{ key: "__ungrouped", title: "Другие товары", items: ungrouped }] : []),
  ];

  return (
    <div className="flex w-full flex-col">
      {sections.map((section, index) => (
        <Reveal key={section.key} translateY={16} fillWidth delay={Math.min(index * 0.06, 0.3)}>
          <section
            style={{
              paddingBottom: "1rem",
              ...(index > 0
                ? { borderTop: "1px solid var(--border-light)", paddingTop: "3rem" }
                : null),
            }}
          >
            <SectionHeading title={section.title} count={section.items.length} />
            <ProductsGrid products={section.items} total={section.items.length} />
          </section>
        </Reveal>
      ))}
    </div>
  );
}
