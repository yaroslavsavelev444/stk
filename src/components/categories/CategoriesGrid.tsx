import { Suspense } from 'react';
import { getCachedCategories } from '@/services/payload/categories';
import { CategoryCard } from './CategoryCard';
import { CategoryGridSkeleton } from './CategoryGridSkeleton';

// Паттерны колонок и высоты (как на скриншоте)
const GRID_PATTERNS = [
  { col: 'lg:col-span-8', row: 'lg:row-span-2', aspect: 'aspect-[4/3]' },  // первая — широкая и высокая
  { col: 'lg:col-span-4', row: 'lg:row-span-1', aspect: 'aspect-[4/3]' },
  { col: 'lg:col-span-4', row: 'lg:row-span-1', aspect: 'aspect-[4/3]' },
  { col: 'lg:col-span-4', row: 'lg:row-span-1', aspect: 'aspect-[4/3]' },
  { col: 'lg:col-span-4', row: 'lg:row-span-1', aspect: 'aspect-[4/3]' },
  { col: 'lg:col-span-4', row: 'lg:row-span-1', aspect: 'aspect-[4/3]' },
  // Можно добавить ещё паттерны, если категорий больше 6
];

function getGridClasses(index: number, total: number): string {
  if (total === 1) return 'col-span-12 row-span-1';
  const base = 'col-span-12 md:col-span-6';
  const pattern = GRID_PATTERNS[index % GRID_PATTERNS.length];
  return `${base} ${pattern.col} ${pattern.row}`;
}

function getAspectClass(index: number, total: number): string {
  if (total === 1) return 'aspect-[4/3]';
  const pattern = GRID_PATTERNS[index % GRID_PATTERNS.length];
  return pattern.aspect;
}

function getSizes(index: number): string {
  if (index === 0) {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw';
  }
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

function getLoading(index: number): 'lazy' | 'eager' {
  return index < 2 ? 'eager' : 'lazy';
}

async function CategoriesGridContent() {
  const categories = await getCachedCategories();

  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-text-secondary py-12">
        Категории пока не добавлены
      </p>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-auto">
      {categories.map((category, index) => {
        const total = categories.length;
        return (
          <CategoryCard
            key={category.id}
            category={category}
            className={`
              ${getGridClasses(index, total)}
              ${getAspectClass(index , total)}
            `}
            sizes={getSizes(index)}
            loading={getLoading(index)}
          />
        );
      })}
    </div>
  );
}

export function CategoriesGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoriesGridContent />
      </Suspense>
    </section>
  );
}