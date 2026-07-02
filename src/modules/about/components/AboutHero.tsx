import { RevealFx } from '@once-ui-system/core'
import { ImagePlaceholder } from '@/components/UI/ImagePlaceholder'
import type { AboutPageContent } from '@/modules/about/types'

export function AboutHero({ hero }: { hero: AboutPageContent['hero'] }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <RevealFx translateY="16" fillWidth trigger={true}>
        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.08em] text-[var(--primary)]">
          {hero.eyebrow}
        </span>
      </RevealFx>

      <RevealFx translateY="16" fillWidth trigger={true} delay={0.08}>
        <h1 className="max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--text-primary)]">
          {hero.heading}
        </h1>
      </RevealFx>

      <RevealFx translateY="16" fillWidth trigger={true} delay={0.16}>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--text-secondary)]">{hero.lead}</p>
      </RevealFx>

      <RevealFx translateY="20" fillWidth trigger={true} delay={0.24}>
        <div className="mt-8 md:mt-10">
          <ImagePlaceholder alt={hero.heroImageAlt} aspect="aspect-[16/7]" />
        </div>
      </RevealFx>
    </section>
  )
}