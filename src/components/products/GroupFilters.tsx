"use client";
import { Button, Row } from "@once-ui-system/core";

interface GroupFiltersProps {
  groups: string[];
  activeGroup?: string;
  categorySlug: string;
}

export function GroupFilters({ groups, activeGroup, categorySlug }: GroupFiltersProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Row 
        wrap 
        gap="12" 
        horizontal="start"
        className="w-full"
      >
        {/* Кнопка "Все" */}
        <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-1.5 hover:shadow transition-shadow duration-200">
          <Button
            variant={activeGroup ? "secondary" : "primary"}
            size="m"
            href={`/catalog/${categorySlug}`}
            data-border="rounded"
            className="!rounded-2xl font-medium transition-all duration-200 hover:bg-white/70"
          >
            Все
          </Button>
        </div>

        {/* Остальные группы */}
        {groups.map((group) => {
          const isActive = activeGroup === group;
          return (
            <div 
              key={group}
              className="bg-white border border-black/5 shadow-sm rounded-3xl p-1.5 hover:shadow transition-shadow duration-200"
            >
              <Button
                variant={isActive ? "primary" : "secondary"}
                size="m"
                href={`/catalog/${categorySlug}?group=${encodeURIComponent(group)}`}
                data-border="rounded"
                className="!rounded-2xl font-medium whitespace-nowrap transition-all duration-200 hover:bg-white/70"
              >
                {group}
              </Button>
            </div>
          );
        })}
      </Row>
    </div>
  );
}