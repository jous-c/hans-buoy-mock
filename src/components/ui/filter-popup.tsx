import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popup } from "@/components/ui/popup";

export interface FilterCategory {
  key: string;
  label: string;
  options: string[];
}

interface FilterPopupProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string[]>) => void;
  filterCategories: FilterCategory[];
  initialFilters: Record<string, string[]>;
}

function FilterPopup({
  open,
  onClose,
  onApply,
  filterCategories,
  initialFilters,
}: FilterPopupProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    filterCategories[0]?.key ?? "",
  );
  const [pendingFilters, setPendingFilters] =
    useState<Record<string, string[]>>(initialFilters);

  useEffect(() => {
    if (open) {
      setPendingFilters(initialFilters);
      if (filterCategories.length > 0 && !filterCategories.find((c) => c.key === selectedCategory)) {
        setSelectedCategory(filterCategories[0].key);
      }
    }
  }, [open, initialFilters, filterCategories, selectedCategory]);

  const handleToggleOption = useCallback(
    (categoryKey: string, option: string) => {
      setPendingFilters((prev) => {
        const current = prev[categoryKey] ?? [];
        const next = current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option];
        return { ...prev, [categoryKey]: next };
      });
    },
    [],
  );

  const handleApply = () => {
    onApply(pendingFilters);
    onClose();
  };

  const handleReset = () => {
    const cleared: Record<string, string[]> = {};
    filterCategories.forEach((c) => {
      cleared[c.key] = [];
    });
    setPendingFilters(cleared);
  };

  const activeCategory = filterCategories.find(
    (c) => c.key === selectedCategory,
  );

  return (
    <Popup
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <>
          <Button
            variant="ghost"
            color="secondary"
            size="sm"
            onClick={handleReset}
          >
            Reset all
          </Button>
          <Button
            variant="filled"
            color="primary"
            size="md"
            onClick={handleApply}
          >
            Apply
          </Button>
        </>
      }
    >
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
                        handleToggleOption(activeCategory.key, option)
                      }
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
}

export { FilterPopup };
