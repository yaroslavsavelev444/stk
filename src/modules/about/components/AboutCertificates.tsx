import { RevealFx } from '@once-ui-system/core'
import { ImagePlaceholder } from '@/components/UI/ImagePlaceholder'
import type { AboutCertificateItem } from '@/modules/about/types'

interface AboutCertificatesProps {
  heading: string
  subheading: string
  items: AboutCertificateItem[]
}

export function AboutCertificates({ heading, subheading, items }: AboutCertificatesProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <RevealFx translateY="16" fillWidth trigger={true}>
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-bold text-[var(--text-primary)]">{heading}</h2>
          <p className="max-w-xl text-[var(--text-secondary)]">{subheading}</p>
        </div>
      </RevealFx>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
        {items.map((cert, index) => (
          <RevealFx key={`${cert.title}-${cert.issuer}`} translateY="16" trigger={true} delay={index * 0.05}>
            <div className="w-[220px] shrink-0 snap-start">
              <ImagePlaceholder alt={cert.title} aspect="aspect-[3/4]" />
              <div className="mt-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{cert.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
              </div>
            </div>
          </RevealFx>
        ))}
      </div>
    </section>
  )
}