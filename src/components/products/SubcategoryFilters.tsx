import Link from "next/link";
import { cn } from "@/utils/cn";

export interface SubcategoryFilterItem {
  id: string;
  name: string;
  count: number;
}

interface SubcategoryFiltersProps {
  items: SubcategoryFilterItem[];
  selectedIds: string[];
  categorySlug: string;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5L6.2 11.5L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildHref(categorySlug: string, selectedIds: string[], id: string | null) {
  // id === null → чип "Все" — всегда сбрасывает выбор.
  if (id === null) return `/catalog/${categorySlug}`;

  const isSelected = selectedIds.includes(id);
  const next = isSelected ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];

  if (next.length === 0) return `/catalog/${categorySlug}`;
  return `/catalog/${categorySlug}?sub=${next.map(encodeURIComponent).join(",")}`;
}

function FilterChip({
  href,
  label,
  count,
  isSelected,
}: {
  href: string;
  label: string;
  count?: number;
  isSelected: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={isSelected}
      className={cn(
        "group/chip relative flex shrink-0 items-center gap-2 rounded-full border py-2.5",
        "text-sm font-semibold whitespace-nowrap no-underline",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]",
        isSelected
          ? "border-transparent shadow-[0_4px_14px_-2px_var(--shadow-color)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary-200)] hover:text-[var(--text-primary)] hover:bg-white",
      )}
      // background и color заданы инлайном не для красоты: цвет ссылок задаёт
      // правило `a:not(.button)` из стилей once-ui, объявленное вне CSS-слоёв, а
      // утилиты Tailwind лежат в @layer utilities. Правила вне слоёв побеждают
      // любой слой независимо от специфичности, поэтому класс text-white здесь
      // молча не работал и текст оставался тёмным. Инлайн-стиль перебивает оба.
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
        ...(isSelected
          ? { background: "var(--primary)", color: "var(--text-inverse)" }
          : null),
      }}
    >
      {isSelected && <CheckIcon />}
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full text-xs font-bold leading-none",
            isSelected ? "bg-white/20 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-muted)]",
          )}
          style={{ paddingLeft: "0.375rem", paddingRight: "0.375rem", paddingTop: "0.125rem", paddingBottom: "0.125rem" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

/**
 * Фильтр подкатегорий: мультивыбор через query-параметр "sub" (список id,
 * порядок = порядок выбора пользователем — именно в этом порядке товары
 * потом группируются на странице, см. ProductsBySubcategory).
 *
 * На мобильных — горизонтальная прокрутка в один ряд (чипов может быть
 * много, а вертикальное место дороже); от sm: — обычный перенос строк.
 */
export function SubcategoryFilters({ items, selectedIds, categorySlug }: SubcategoryFiltersProps) {
  const allSelected = selectedIds.length === 0;

  return (
    <div
      className="flex w-full gap-2.5 overflow-x-auto sm:flex-wrap sm:overflow-visible"
      style={{ paddingInline: "1rem", paddingBottom: "0.25rem" }}
      role="group"
      aria-label="Фильтр по подкатегориям"
    >
      <FilterChip
        href={buildHref(categorySlug, selectedIds, null)}
        label="Все"
        isSelected={allSelected}
      />
      {items.map((item) => (
        <FilterChip
          key={item.id}
          href={buildHref(categorySlug, selectedIds, item.id)}
          label={item.name}
          count={item.count}
          isSelected={selectedIds.includes(item.id)}
        />
      ))}
    </div>
  );
}
