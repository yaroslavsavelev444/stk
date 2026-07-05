// src/services/payload/consents.ts
import { unstable_cache } from "next/cache";
import type { Where } from "payload";
import type { Consent } from "@/payload-types";
import { getPayloadInstance } from "./getPayload";

async function fetchConsents(): Promise<Consent[]> {
  const payload = await getPayloadInstance();
  const where: Where = { isPublished: { equals: true } };
  const result = await payload.find({
    collection: "consents",
    where,
    sort: "order",
    depth: 0,
    limit: 200,
  });
  return result.docs as unknown as Consent[];
}

export const getCachedConsents =
  process.env.NODE_ENV === "development"
    ? fetchConsents
    : unstable_cache(fetchConsents, ["consents-all"], {
        tags: ["consents"],
        revalidate: false,
      });

async function fetchConsentBySlug(slug: string): Promise<Consent | null> {
  const payload = await getPayloadInstance();
  const where: Where = {
    slug: { equals: slug },
    isPublished: { equals: true },
  };
  const result = await payload.find({
    collection: "consents",
    where,
    limit: 1,
    depth: 0,
  });
  return (result.docs[0] || null) as unknown as Consent | null;
}

export const getCachedConsentBySlug = (slug: string) =>
  process.env.NODE_ENV === "development"
    ? () => fetchConsentBySlug(slug)
    : unstable_cache(() => fetchConsentBySlug(slug), [`consent-${slug}`], {
        tags: ["consents"],
        revalidate: false,
      });
