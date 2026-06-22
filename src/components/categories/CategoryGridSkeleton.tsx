export function CategoryGridSkeleton() {
  const items = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-auto">
      {items.map((index) => {
        let className = 'col-span-12 md:col-span-6';
        if (index === 0) {
          className += ' lg:col-span-8';
        } else {
          className += ' lg:col-span-4';
        }
        return (
          <div
            key={index}
            className={`${className} rounded-3xl bg-surface-secondary animate-pulse aspect-[4/3]`}
          />
        );
      })}
    </div>
  );
}