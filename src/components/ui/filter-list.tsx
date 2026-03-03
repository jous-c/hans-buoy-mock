import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { FilterCategory } from "@/components/ui/filter-popup";

interface FilterListProps {
  filterCategories: FilterCategory[];
  pendingFilters: Record<string, string[]>;
  onToggleOption: (categoryKey: string, option: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (key: string) => void;
}

function FilterList({
  filterCategories,
  pendingFilters,
  onToggleOption,
  selectedCategory: controlledCategory,
  onCategoryChange,
}: FilterListProps) {
  const [internalCategory, setInternalCategory] = useState(
    filterCategories[0]?.key ?? "",
  );

  const selectedCategory = controlledCategory ?? internalCategory;
  const setSelectedCategory = onCategoryChange ?? setInternalCategory;

  const activeCategory = filterCategories.find(
    (c) => c.key === selectedCategory,
  );

  return (
    <div className="flex min-h-0 h-full">
      {/* Left sidebar */}
      <div className="flex w-[180px] shrink-0 flex-col overflow-y-auto border-r border-stroke py-(--spacing-8)">
        {filterCategories.map((category) => {
          const count = (pendingFilters[category.key] ?? []).length;
          const isActive = category.key === selectedCategory;
          return (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={cn(
                "flex items-center gap-2 px-(--spacing-16) py-(--spacing-8) text-left text-sm font-medium leading-5 transition-colors cursor-pointer",
                isActive
                  ? "bg-secondary-lighter text-foreground"
                  : "text-text-sub hover:bg-secondary-lighter",
              )}
            >
              <span className="truncate">{category.label}</span>
              {count > 0 && (
                <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-(--radius-4) bg-primary-light px-1 text-xs font-medium text-primary-dark">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-(--spacing-24) py-(--spacing-16)">
        {activeCategory && (
          <>
            <h3 className="mb-(--spacing-12) text-base font-semibold leading-6 text-foreground">
              {activeCategory.label}
            </h3>
            <div className="flex flex-col gap-(--spacing-4)">
              {activeCategory.options.map((option) => {
                const checked = (
                  pendingFilters[activeCategory.key] ?? []
                ).includes(option);
                return (
                  <Checkbox
                    key={option}
                    label={option}
                    checked={checked}
                    onChange={() =>
                      onToggleOption(activeCategory.key, option)
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { FilterList };
export type { FilterListProps };
