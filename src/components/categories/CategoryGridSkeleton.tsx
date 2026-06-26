/**
 * CategoryGridSkeleton
 * Loading placeholder that mirrors the Bento grid structure.
 * Uses the same grid system as the real grid so the layout shift is minimal.
 */

const SKELETON_CELLS = [
  'col-span-12 md:col-span-6 lg:col-span-8 lg:row-span-2',
  'col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-1',
  'col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-1',
  'col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-1',
  'col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-1',
  'col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-1',
]

function SkeletonCard({ className }: { className: string }) {
  return (
    <div
      className={`${className} animate-pulse`}
      style={{
        borderRadius: 'var(--radius-xl)',
        background: 'var(--surface-secondary)',
      }}
    >
      <div className="w-full h-full relative overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            animation: 'skeleton-sweep 1.8s ease-in-out infinite',
          }}
        />
        {/* Bottom text placeholder */}
        <div className="absolute bottom-5 left-5 right-5 space-y-2">
          <div
            className="h-4 rounded-md"
            style={{ background: 'rgba(0,0,0,0.08)', width: '60%' }}
          />
          <div
            className="h-6 rounded-md"
            style={{ background: 'rgba(0,0,0,0.12)', width: '85%' }}
          />
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
      <div className="grid grid-cols-12 auto-rows-[200px] gap-3 md:gap-4 lg:gap-5">
        {SKELETON_CELLS.map((cls, i) => (
          <SkeletonCard key={i} className={cls} />
        ))}
      </div>
    </>
  )
}