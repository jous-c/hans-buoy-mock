import { useState, useEffect, useCallback } from "react";
import { Popup } from "@/components/ui/popup";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { FilterList } from "@/components/ui/filter-list";
import type { FilterCategory } from "@/components/ui/filter-popup";

interface CreateViewPopupProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, filters: Record<string, string[]>) => void;
  filterCategories: FilterCategory[];
  existingViewNames: string[];
}

function CreateViewPopup({
  open,
  onClose,
  onCreate,
  filterCategories,
  existingViewNames,
}: CreateViewPopupProps) {
  const [pendingName, setPendingName] = useState("");
  const [pendingFilters, setPendingFilters] = useState<
    Record<string, string[]>
  >({});
  const [duplicateError, setDuplicateError] = useState(false);

  useEffect(() => {
    if (open) {
      setPendingName("");
      setPendingFilters({});
      setDuplicateError(false);
    }
  }, [open]);

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

  const handleReset = () => {
    const cleared: Record<string, string[]> = {};
    filterCategories.forEach((c) => {
      cleared[c.key] = [];
    });
    setPendingFilters(cleared);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingName(e.target.value);
    if (duplicateError) setDuplicateError(false);
  };

  const hasFilters = Object.values(pendingFilters).some(
    (arr) => arr.length > 0,
  );
  const isDisabled = pendingName.trim() === "" || !hasFilters;

  const handleCreate = () => {
    const trimmed = pendingName.trim();
    if (
      existingViewNames.some(
        (n) => n.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setDuplicateError(true);
      return;
    }
    onCreate(trimmed, pendingFilters);
  };

  return (
    <Popup
      open={open}
      onClose={onClose}
      title="Create new view"
      className="h-[620px]"
      footer={
        <div className="flex w-full justify-end">
          <Button
            variant="filled"
            color="primary"
            size="md"
            disabled={isDisabled}
            onClick={handleCreate}
          >
            Create view
          </Button>
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-(--spacing-24) pt-(--spacing-16) pb-(--spacing-12)">
          <InputField
            label="View name"
            leadingIcon={false}
            placeholder=""
            value={pendingName}
            onChange={handleNameChange}
            variant={duplicateError ? "destructive" : "default"}
            hint={duplicateError ? "Name is already used" : undefined}
          />
        </div>

        <div className="flex shrink-0 items-center justify-between px-(--spacing-24) pb-(--spacing-8)">
          <span className="text-sm font-medium leading-5 text-foreground">
            Select filters
          </span>
          <button
            onClick={handleReset}
            className="text-sm font-medium leading-5 text-text-sub transition-colors hover:text-foreground cursor-pointer"
          >
            Reset
          </button>
        </div>

        <div className="min-h-0 flex-1 border-t border-stroke">
          <FilterList
            filterCategories={filterCategories}
            pendingFilters={pendingFilters}
            onToggleOption={handleToggleOption}
          />
        </div>
      </div>
    </Popup>
  );
}

export { CreateViewPopup };
export type { CreateViewPopupProps };
