import { Reveal } from "@/components/UI/Reveal/Reveal";
import type { AboutTimelineEvent } from "@/modules/about/types";

interface AboutTimelineProps {
  heading: string;
  subheading: string;
  events: AboutTimelineEvent[];
}

export function AboutTimeline({
  heading,
  subheading,
  events,
}: AboutTimelineProps) {
  return (
    <section className="about-timeline w-full max-w-5xl mx-auto px-4 sm:px-6">
      <Reveal translateY={16} fillWidth>
        <div className="flex flex-col items-center text-center gap-3 mb-12 md:mb-16">
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[var(--text-primary)]">
            {heading}
          </h2>
          <p className="max-w-xl text-[var(--text-secondary)]">{subheading}</p>
        </div>
      </Reveal>

      <div className="about-timeline__track">
        <span className="about-timeline__line" aria-hidden="true" />

        {events.map((event, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <div
              key={event.year}
              className={`about-timeline__item about-timeline__item--${side}`}
            >
              <span className="about-timeline__dot" aria-hidden="true" />
              <Reveal translateY={20} fillWidth delay={index * 0.05}>
                <div className="about-timeline__card">
                  <span className="about-timeline__year">{event.year}</span>
                  <h3 className="about-timeline__title">{event.title}</h3>
                  <p className="about-timeline__desc">{event.description}</p>
                  {event.highlight && (
                    <span className="about-timeline__highlight">
                      {event.highlight}
                    </span>
                  )}
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      <style>{`
        .about-timeline__track {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding: 0.5rem 0 0.5rem 2.25rem;
        }
        .about-timeline__line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0.5rem;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary), var(--border));
        }
        .about-timeline__item {
          position: relative;
        }
        .about-timeline__dot {
          position: absolute;
          left: -2.25rem;
          top: 0.4rem;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .about-timeline__card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
        }
        .about-timeline__year {
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--primary);
          background: var(--primary-light);
          padding: 2px 10px;
          border-radius: 999px;
          margin-bottom: 0.5rem;
        }
        .about-timeline__title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.375rem;
        }
        .about-timeline__desc {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
        }
        .about-timeline__highlight {
          display: inline-block;
          margin-top: 0.625rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent);
        }

        @media (min-width: 900px) {
          .about-timeline__track {
            padding-left: 0;
          }
          .about-timeline__line {
            left: 50%;
            transform: translateX(-50%);
          }
          .about-timeline__item {
            width: calc(50% - 2.5rem);
          }
          .about-timeline__item--left {
            margin-right: auto;
          }
          .about-timeline__item--right {
            margin-left: auto;
          }
          .about-timeline__dot {
            left: auto;
            top: 1.25rem;
          }
          .about-timeline__item--left .about-timeline__dot {
            right: -2.9rem;
          }
          .about-timeline__item--right .about-timeline__dot {
            left: -2.9rem;
          }
        }
      `}</style>
    </section>
  );
}
