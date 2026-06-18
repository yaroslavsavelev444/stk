import { Row } from '@once-ui-system/core';
import { getCachedSettings } from '@/services/payload';
import { Logo } from './Logo';
import { CatalogButton } from './CatalogButton';
import { SearchButton } from '../search/SearchButton';
import styles from './Header.module.scss';

export const Header = async () => {
  const settings = await getCachedSettings();

  // Безопасное получение URL логотипа из Payload
  let logoUrl: string | null = null;
  if (settings?.logo && typeof settings.logo === 'object' && 'url' in settings.logo) {
    logoUrl = settings.logo.url;
  }
  const companyName = settings?.companyName || 'Магазин';

  return (
    <Row
      fillWidth
      horizontal="center"
      className={styles.headerWrapper} // sticky + отступ сверху
    >
      <Row
        maxWidth="m"          // общий контейнер с остальным сайтом
        fillWidth
        horizontal="between"
        vertical="center"
        className={styles.headerInner} // стеклянная карточка
      >
        <Logo src={logoUrl} alt={companyName} />
        <div className={styles.actions}>
          <CatalogButton />
          <SearchButton />
        </div>
      </Row>
    </Row>
  );
};