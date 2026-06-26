// @modules/products/components/ProductDocuments.tsx
'use client';

import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Product } from '@/payload-types';

type ProductDocumentsProps = {
  documents: Product['documents'];
};

const ProductDocuments: React.FC<ProductDocumentsProps> = ({ documents }) => {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border-light">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Документация
      </h3>

      <div className="space-y-3">
        {documents.map((doc: any, index: number) => {
          const file = typeof doc === 'object' ? doc : null;
          if (!file?.url) return null;

          const fileName = file.filename || file.name || `Документ ${index + 1}`;
          const fileSize = file.size ? `(${Math.round(file.size / 1024)} KB)` : '';

          return (
            <div
              key={file.id || index}
              className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileTextOutlined className="text-xl text-primary" />
                <div>
                  <p className="font-medium text-text-primary">{fileName}</p>
                  {fileSize && (
                    <p className="text-sm text-text-muted">{fileSize}</p>
                  )}
                </div>
              </div>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={file.url}
                target="_blank"
                download
                className="min-w-[110px] bg-primary hover:bg-primary-hover border-none"
              >
                Скачать
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDocuments;