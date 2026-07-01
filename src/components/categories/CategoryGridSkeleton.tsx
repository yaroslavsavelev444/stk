/**
 * CategoryGridSkeleton
 * Плейсхолдер загрузки, зеркалящий реальную структуру карточки:
 * текстовый блок сверху + фото-зона снизу. Раскладка повторяет
 * CategoryCard 1:1, чтобы исключить визуальный "скачок" при гидратации.
 */

const SKELETON_COUNT = 6

function SkeletonCard() {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--border)]"
      style={{ borderRadius: 'var(--radius-xl)', background: 'var(--surface)' }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
        {/* Shimmer sweep по всей карточке */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            animation: 'skeleton-sweep 1.8s ease-in-out infinite',
          }}
        />

        {/* Зона фото снизу */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ top: '38%', background: 'var(--surface-secondary)' }}
        />

        {/* Плейсхолдеры заголовка и описания сверху */}
        <div className="absolute top-0 inset-x-0 flex flex-col gap-2 p-5 md:p-6">
          <div className="h-5 rounded-md" style={{ background: 'rgba(0,0,0,0.08)', width: '70%' }} />
          <div className="h-3.5 rounded-md" style={{ background: 'rgba(0,0,0,0.06)', width: '90%' }} />
          <div className="h-3.5 rounded-md" style={{ background: 'rgba(0,0,0,0.06)', width: '55%' }} />
        </div>
      </div>
    </div>
  )
}

export function CategoryGridSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeleton-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  )
}