// src/modules/home/components/CertificatesSection.tsx
import { MediaGallery } from "@/modules/mediagalleries";
import { getCachedMediaGalleryByKey } from "@/services/payload/media-galleries";

const CERTIFICATES_GALLERY_KEY = "certificates";

/**
 * Server Component: тянет подборку "certificates" через кэширующий
 * сервис (тот же паттерн, что у CategoriesGrid/ConsentsList) и передаёт
 * нормализованные данные в универсальный MediaGallery.
 */
export async function CertificatesSection() {
  const gallery = await getCachedMediaGalleryByKey(CERTIFICATES_GALLERY_KEY)();
  if (!gallery || gallery.items.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <MediaGallery
        items={gallery.items}
        variant="grid"
        title={gallery.title || "Сертификаты и документы"}
        description={gallery.description}
        aspect="aspect-[3/4]"
        fit="contain"
      />
    </div>
  );
}
