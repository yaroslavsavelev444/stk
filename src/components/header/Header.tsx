import { Row } from '@once-ui-system/core';
import { getCachedSettings } from '@/services/payload';
import { Logo } from './Logo';
import { CatalogButton } from './CatalogButton';
import { SearchButton } from '../search/SearchButton';
import {CallbackButton} from '../callback-form/header-trigger-usage';
export const Header = async () => {
  const settings = await getCachedSettings();

  let logoUrl: string | null = null;
  if (settings?.logo && typeof settings.logo === 'object' && 'url' in settings.logo) {
    logoUrl = settings.logo.url || null;
  }
  const companyName = settings?.companyName || 'Магазин';

  return (
    <Row
      fillWidth
      horizontal="center"
      className="py-2" // отступ сверху/снизу
    >
      <Row
        maxWidth="m"
        fillWidth
        horizontal="between"
        vertical="center"
        className="
          px-4 md:px-5 py-4 md:py-4
          min-h-16 md:min-h-[64px] sm:min-h-14
          bg-white/65 backdrop-blur-md
          rounded-2xl
          border border-white/40
          shadow-[0_4px_20px_rgba(0,0,0,0.06)]
          relative overflow-hidden isolate
          transition-all duration-300
        "
      >
        <Logo  src="/images/logo.png" alt={companyName} />
        <CallbackButton />
        <div className="flex items-center gap-3 md:gap-4 sm:gap-2">
          <CatalogButton />
          <SearchButton />
        </div>
      </Row>
    </Row>
  );
};