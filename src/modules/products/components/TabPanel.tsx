'use client';

import React from 'react';

type TabPanelProps = {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
};

export default function TabPanel({ id, label, isOpen, onToggle, children }: TabPanelProps) {
  return (
    <div className="product-tabs__item">
      <button
        type="button"
        className={`product-tabs__trigger${isOpen ? ' product-tabs__trigger--open' : ''}`}
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`tab-panel-${id}`}
        id={`tab-btn-${id}`}
        role="tab"
      >
        <span>{label}</span>
        <svg
          className="product-tabs__chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={`tab-panel-${id}`}
        role="tabpanel"
        aria-labelledby={`tab-btn-${id}`}
        hidden={!isOpen}
      >
        {isOpen && (
          <div className="tab-content">
            {children}
          </div>
        )}
      </div>
      <style>{`
        .product-tabs__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          text-align: left;
          transition: background 0.15s ease;
        }
        .product-tabs__trigger:hover {
          background: var(--surface-secondary);
        }
        .product-tabs__trigger--open {
          color: var(--primary);
        }
        .product-tabs__trigger:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: -2px;
        }
        .tab-content {
          padding: 0.75rem 1rem 1.25rem;
        }
      `}</style>
    </div>
  );
}