'use client'

interface StatusPulseProps {
  state: 'idle' | 'success'
}

/**
 * Единственный анимированный элемент формы.
 * В состоянии idle — пульсирующая точка ("менеджер на связи"),
 * в состоянии success — превращается в статичный чекмарк.
 * Намеренно не используем декоративные доп.анимации больше нигде в форме.
 */
export function StatusPulse({ state }: StatusPulseProps) {
  if (state === 'success') {
    return (
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
      </span>
    )
  }

  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
    </span>
  )
}
