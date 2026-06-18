'use client';

import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export const CatalogButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/catalog');
  };

  return (
    <Button
      type="primary"
      icon={<MenuOutlined />}
      aria-label="Каталог"
      onClick={handleClick}
    >
      Каталог
    </Button>
  );
};