// src/modules/home/components/ReviewsSection.tsx

import { Reveal } from "@/components/UI/Reveal/Reveal";
import { MediaGallery } from "@/modules/mediagalleries";
import { getCachedMediaGalleryByKey } from "@/services/payload/media-galleries";

const REVIEWS_GALLERY_KEY = "reviews";

export async function ReviewsSection() {
  const gallery = await getCachedMediaGalleryByKey(REVIEWS_GALLERY_KEY)();
  if (!gallery || gallery.items.length === 0) return null;

  return (
    // Reveal рендерится только когда есть данные — иначе пустая обёртка
    // всё равно становится flex-элементом родительского списка секций
    // и добавляет лишний gap до и после себя.
    <Reveal translateY={16} fillWidth delay={0.1}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <MediaGallery
          items={gallery.items}
          variant="carousel"
          title={gallery.title || "Отзывы клиентов"}
          description={gallery.description}
          aspect="aspect-[4/3]"
          fit="contain"
          carouselSlideWidthClassName="w-[260px] sm:w-[300px]"
        />
      </div>
    </Reveal>
  );
}
