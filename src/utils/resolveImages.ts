import type { Media } from '@/payload-types';

export function resolveImages(images: unknown): Media[] {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (image): image is Media =>
      typeof image === 'object' &&
      image !== null &&
      'url' in image // достаточно проверить наличие поля url
  );
}