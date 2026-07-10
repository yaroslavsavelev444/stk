import { Reveal } from "@/components/UI/Reveal/Reveal";

export function AboutCallout({ text }: { text: string }) {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <Reveal translateY={10} fillWidth>
        <blockquote
          className="relative text-center text-[1.0625rem] md:text-[1.1875rem] leading-relaxed text-[var(--text-primary)] px-6 py-8 md:px-10 md:py-10"
          style={{
            background: "var(--primary-light)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute left-5 top-3 text-5xl leading-none text-[var(--primary-200)] select-none"
          >
            “
          </span>
          {text}
        </blockquote>
      </Reveal>
    </section>
  );
}
