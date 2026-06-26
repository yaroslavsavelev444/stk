'use client';

import React from 'react';
import { Select } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

type AttributeGroupProps = {
  title: string;
  values: string[];
};

export default function AttributeGroup({ title, values }: AttributeGroupProps) {
  if (!values || values.length === 0) return null;

  // Превращаем значения в опции для Select
  const options: DefaultOptionType[] = values.map((val) => ({
    label: val,
    value: val,
  }));

  // Берём первое значение как текущее (читаемое)
  const currentValue = values[0];

  return (
    <div className="attribute-group">
      <label className="attribute-group__label">{title}</label>
      <Select
        className="attribute-group__select"
        value={currentValue}
        options={options}
        disabled={false}   // разрешаем открытие выпадашки
        onChange={() => {}} // пустой обработчик – значение не меняется
        onSelect={() => {}} // тоже пустой – блокируем выбор
        popupMatchSelectWidth={false}
        listHeight={200}
        style={{ width: '100%' }}
      />
      <style>{`
        .attribute-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .attribute-group__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .attribute-group__select {
          width: 100%;
        }
        /* Кастомизация Select под тему */
        .attribute-group__select .ant-select-selector {
          border-radius: var(--radius-md) !important;
          border-color: var(--border) !important;
          background: var(--surface-secondary) !important;
          color: var(--text-primary) !important;
          padding: 0.25rem 0.75rem !important;
          height: 40px !important;
        }
        .attribute-group__select .ant-select-selection-item {
          line-height: 38px !important;
        }
        .attribute-group__select .ant-select-arrow {
          color: var(--text-muted) !important;
        }
        .attribute-group__select .ant-select-dropdown {
          border-radius: var(--radius-md) !important;
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
        }
        .attribute-group__select .ant-select-item-option {
          color: var(--text-primary) !important;
          padding: 8px 12px !important;
        }
        .attribute-group__select .ant-select-item-option:hover {
          background: var(--surface-secondary) !important;
        }
      `}</style>
    </div>
  );
}