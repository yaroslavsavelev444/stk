'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import type { Product } from '@/payload-types'; // Media удалён
import { resolveImages } from '@/utils/resolveImages';

interface ImageGalleryProps {
  product: Product;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  const images = resolveImages(product.images);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) {
    return <div className="text-gray-500">Нет изображений</div>;
  }

  const slides = images.map((img) => ({
    src: img.url || '',
    alt: img.alt || 'Изображение товара',
  }));

  return (
    <div className="flex flex-col gap-4">
      {images.map((img, idx) => {
        const imageUrl = img.url
          ? new URL(img.url, 'http://localhost').pathname
          : null;
        if (!imageUrl) return null;

        return (
          <div key={idx}>
            <div
              style={{
                position: 'relative',
                width: '500px',
                height: '500px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={imageUrl}
                alt={img.alt || `Изображение ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          </div>
        );
      })}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        on={{
          view: ({ index: currentIndex }) => setLightboxIndex(currentIndex),
        }}
        render={{
          buttonClose: () => (
            <button
              key="close-button" // добавляем ключ
              onClick={() => setLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                color: '#fff',
                fontSize: 32,
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: 44,
                height: 44,
                cursor: 'pointer',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          ),
        }}
      />
    </div>
  );
}