import type { Product } from '@/payload-types';

type Props = { product: Product };

export default function TabDocuments({ product }: Props) {
  const docs = product.documents || [];
  if (docs.length === 0) return null;

  return (
    <ul className="tab-docs" role="list">
      {docs.map((doc, i) => {
        const file = doc.file && typeof doc.file === 'object' ? doc.file : null;
        const url = file?.url || '';
        const name = file?.filename || 'Документ';

        return (
          <li key={i} className="tab-docs__item">
            {url ? (
              <a href={url} className="tab-docs__link" target="_blank" rel="noopener noreferrer" download>
                <span aria-hidden="true">📄</span>
                <span>{doc.label || name}</span>
              </a>
            ) : (
              <span className="tab-docs__name">{doc.label || name}</span>
            )}
          </li>
        );
      })}
      <style>{`
        .tab-docs {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .tab-docs__item {
          display: flex;
          align-items: center;
        }
        .tab-docs__link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.25rem 0;
          transition: color 0.15s ease;
        }
        .tab-docs__link:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }
        .tab-docs__link:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
          border-radius: 4px;
        }
        .tab-docs__name {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </ul>
  );
}
