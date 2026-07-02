import { RevealFx } from '@once-ui-system/core'
import type { AboutPageContent } from '@/modules/about/types'

export function AboutStandards({ standards }: { standards: AboutPageContent['standards'] }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
        <RevealFx translateY="16" fillWidth trigger={true}>
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">
              {standards.heading}
            </h2>
            {standards.paragraphs.map((p, i) => (
              <p key={i} className="text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
                {p}
              </p>
            ))}
            <div className="mt-2 flex flex-wrap gap-2">
              {standards.filmBrands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: 'var(--surface-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </RevealFx>

        <RevealFx translateY="16" fillWidth trigger={true} delay={0.1}>
          <div className="flex flex-col gap-3">
            {standards.materials.map((m) => (
              <div
                key={m.title}
                className="p-4 md:p-5"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
              >
                <p className="text-sm font-bold text-[var(--text-primary)]">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{m.description}</p>
              </div>
            ))}
          </div>
        </RevealFx>
      </div>
    </section>
  )
}