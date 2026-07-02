interface ImagePlaceholderProps {
  alt: string
  aspect?: string
  rounded?: string
  className?: string
}

/**
 * Заглушка под фото/иллюстрацию. Держит ровно тот аспект и объём
 * пространства, который позже займёт реальное изображение (next/image),
 * чтобы замена не ломала вёрстку. Никаких видео — только статичные заглушки.
 */
export function ImagePlaceholder({
  alt,
  aspect = 'aspect-[4/3]',
  rounded = 'var(--radius-lg)',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${aspect} ${className}`}
      style={{
        borderRadius: rounded,
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border)',
      }}
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--border-light) 0px, var(--border-light) 2px, transparent 2px, transparent 14px)',
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--text-muted)" strokeWidth="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" stroke="var(--text-muted)" strokeWidth="1.5" />
          <path
            d="M21 15l-5-5-4 4-2-2-5 5"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium leading-snug text-[var(--text-muted)]">{alt}</span>
      </div>
    </div>
  )
}