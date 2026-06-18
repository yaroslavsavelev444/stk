import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

interface LogoProps {
  src?: string | null;
  alt?: string;
}

export const Logo = ({ src, alt = 'Logo' }: LogoProps) => {
  const logoSrc = src || '/images/logo.jpg'; // fallback – убедитесь, что файл существует

  // Если src – полный URL (начинается с http), отключаем оптимизацию Next.js
  const isExternal = typeof logoSrc === 'string' && 
    (logoSrc.startsWith('http://') || logoSrc.startsWith('https://'));

  return (
    <Link href="/" className={styles.logoLink}>
      <Image
        src={logoSrc}
        alt={alt}
        width={160}
        height={48}
        className={styles.logoImage}
        priority
        unoptimized={isExternal} // внешние изображения грузим напрямую
      />
    </Link>
  );
};