interface CatalogSectionHeadingProps {
  title: string;
  count: number;
}

/** Заголовок группы товаров (подкатегории) внутри страницы категории. */
export function CatalogSectionHeading({
  title,
  count,
}: CatalogSectionHeadingProps) {
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
