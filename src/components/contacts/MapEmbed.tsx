import { Flex, Text, Button } from '@once-ui-system/core';
import React from 'react';

interface MapEmbedProps {
  map?: string;
  title?: string;
  address?: string;
  fullWidth?: boolean; // новый проп
}

export const MapEmbed = ({ map, title, address, fullWidth = false }: MapEmbedProps) => {
  if (!map) return null;

  let src = map;
  const iframeMatch = map.match(/<iframe.*?src=["'](.*?)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    src = iframeMatch[1];
  }

  if (src.includes('<') || src.includes('>')) {
    console.warn('MapEmbed: потенциально опасный контент, пропущен');
    return null;
  }

  const isYandex = src.includes('yandex.ru/maps');
  const openLink = isYandex ? src : null;

  // Стили для fullWidth: отрицательные отступы и ширина вьюпорта
  const fullWidthStyles = fullWidth
    ? {
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        maxWidth: '100vw',
      }
    : {};

  return (
    <Flex direction="column" className="w-full mt-4" style={fullWidth ? { overflow: 'hidden' } : {}}>
      {title && (
        <Text variant="heading-m" className="mb-2" style={fullWidth ? { paddingLeft: '1rem', paddingRight: '1rem' } : {}}>
          {title}
        </Text>
      )}

      <Flex
        className="w-full rounded-xl overflow-hidden shadow-lg bg-surface-secondary"
        style={{
          ...fullWidthStyles,
          minHeight: '400px',
        }}
      >
        <iframe
          src={src}
          className="w-full h-[400px] sm:h-[500px] md:h-[600px] border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Карта проезда"
        />
      </Flex>

      {/* Блок с адресом и кнопкой тоже растягиваем, если fullWidth */}
      <Flex
        className="mt-3 w-full flex-wrap items-center justify-between gap-2"
        horizontal="between"
        vertical="center"
        style={fullWidth ? { paddingLeft: '1rem', paddingRight: '1rem' } : {}}
      >
        {address && (
          <Text variant="body-default-m" onBackground="neutral-weak">
            📍 {address}
          </Text>
        )}

        {openLink && (
          <Button
            as="a"
            href={openLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="s"
            className="whitespace-nowrap"
          >
            Открыть на карте ↗
          </Button>
        )}
      </Flex>
    </Flex>
  );
};