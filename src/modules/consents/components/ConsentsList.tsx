// src/components/consents/ConsentsList.tsx
import { Suspense } from "react";
import { Reveal } from "@/components/UI/Reveal/Reveal";
import { getCachedConsents } from "@/services/payload/consents";
import { ConsentCard } from "./ConsentCard";
import { ConsentsListSkeleton } from "./ConsentsListSkeleton";

async function ConsentsListContent() {
  const consents = await getCachedConsents();

  if (!consents.length) {
    return (
      <p className="py-12 text-center text-[var(--text-secondary)]">
        Соглашения пока не добавлены
      </p>
    );
  }

  return (
    <div
      className="flex w-full flex-col gap-3"
      role="list"
      aria-label="Соглашения"
    >
      {consents.map((consent, index) => (
        <Reveal key={consent.id} translateY={12} fillWidth delay={index * 0.05}>
          <div role="listitem">
            <ConsentCard consent={consent} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ConsentsList() {
  return (
    <Suspense fallback={<ConsentsListSkeleton />}>
      <ConsentsListContent />
    </Suspense>
  );
}
