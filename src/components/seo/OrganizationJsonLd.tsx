import type { Setting } from "@/payload-types";

export function OrganizationJsonLd({
  settings,
  siteUrl,
}: {
  settings: Setting | null;
  siteUrl: string;
}) {
  if (!settings) return null;

  const {
    companyName,
    logo,
    workingHours,
    contacts = [],
    socials = [],
  } = settings;

  const contactPoints = contacts
    .filter((c) => c.type === "phone" || c.type === "email")
    .map((c) => ({
      "@type": "ContactPoint",
      contactType: c.title,
      telephone: c.type === "phone" ? c.value : undefined,
      email: c.type === "email" ? c.value : undefined,
    }));

  const sameAs = socials.map((s) => s.url).filter(Boolean);
  const logoUrl =
    typeof logo === "object" && logo.url ? `${siteUrl}${logo.url}` : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName || "СТК-Актив",
    url: siteUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(workingHours ? { openingHours: workingHours } : {}),
    ...(contactPoints.length > 0 ? { contactPoint: contactPoints } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
