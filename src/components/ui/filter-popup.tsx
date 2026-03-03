import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/popup";
import { FilterList } from "@/components/ui/filter-list";

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
      <FilterList
        filterCategories={filterCategories}
        pendingFilters={pendingFilters}
        onToggleOption={handleToggleOption}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </Popup>
  );
}

export { FilterPopup };
