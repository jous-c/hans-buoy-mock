import * as React from "react";
import { createPortal } from "react-dom";
import { Pencil, X, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type EditType = "input" | "textarea" | "dropdown";

interface FieldItemProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
  editable?: boolean;
  editType?: EditType;
  options?: string[];
  maxLength?: number;
  onSave?: (newValue: string) => void;
}

function FieldItem({
  label,
  value = "--",
  className,
  editable = false,
  editType = "input",
  options = [],
  maxLength,
  onSave,
}: FieldItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dropdownMenuRef = React.useRef<HTMLDivElement>(null);

  const resolvedMaxLength = maxLength ?? (editType === "textarea" ? 300 : 30);
  const valueString = typeof value === "string" ? value : "";

  function startEditing() {
    if (!editable) return;
    setDraft(valueString);
    setIsEditing(true);
    if (editType === "dropdown") setDropdownOpen(true);
  }

  function confirmEdit() {
    onSave?.(draft);
    setIsEditing(false);
    setDropdownOpen(false);
  }

  function cancelEdit() {
    setIsEditing(false);
    setDropdownOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") cancelEdit();
    if (e.key === "Enter" && editType === "input") confirmEdit();
  }

  React.useEffect(() => {
    if (isEditing && editType === "input") {
      inputRef.current?.focus();
    }
    if (isEditing && editType === "textarea") {
      textareaRef.current?.focus();
    }
  }, [isEditing, editType]);

  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger = dropdownRef.current?.contains(target);
      const inMenu = dropdownMenuRef.current?.contains(target);
      if (!inTrigger && !inMenu) {
        cancelEdit();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!editable) {
    return (
      <div className={cn("flex gap-(--spacing-12) py-(--spacing-6)", className)}>
        <span className="w-[140px] shrink-0 text-xs leading-4 text-muted-foreground">
          {label}
        </span>
        <span className="min-w-0 flex-1 text-sm leading-5 text-foreground">
          {value}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("flex gap-(--spacing-12) py-(--spacing-6)", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="w-[140px] shrink-0 text-xs leading-4 text-muted-foreground">
        {label}
      </span>

      <div className="min-w-0 flex-1">
        {!isEditing ? (
          <IdleValue
            value={value}
            showPen={isHovered}
            onClick={startEditing}
          />
        ) : editType === "input" ? (
          <InputEditor
            ref={inputRef}
            draft={draft}
            maxLength={resolvedMaxLength}
            onChange={setDraft}
            onKeyDown={handleKeyDown}
            onConfirm={confirmEdit}
            onCancel={cancelEdit}
          />
        ) : editType === "textarea" ? (
          <TextareaEditor
            ref={textareaRef}
            draft={draft}
            maxLength={resolvedMaxLength}
            onChange={setDraft}
            onKeyDown={handleKeyDown}
            onConfirm={confirmEdit}
            onCancel={cancelEdit}
          />
        ) : (
          <DropdownEditor
            ref={dropdownRef}
            menuRef={dropdownMenuRef}
            value={draft}
            options={options}
            open={dropdownOpen}
            onToggle={() => setDropdownOpen((p) => !p)}
            onSelect={(val) => {
              setDraft(val);
              onSave?.(val);
              setIsEditing(false);
              setDropdownOpen(false);
            }}
            onCancel={cancelEdit}
          />
        )}
      </div>
    </div>
  );
}

/* ── Idle value with hover pen icon ─────────────────────── */

function IdleValue({
  value,
  showPen,
  onClick,
}: {
  value: React.ReactNode;
  showPen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-1 rounded-(--radius-6) text-left"
    >
      <span className="min-w-0 flex-1 text-sm leading-5 text-foreground">
        {value}
      </span>
      <span
        className={cn(
          "shrink-0 transition-opacity",
          showPen ? "opacity-100" : "opacity-0",
        )}
      >
        <Pencil className="size-4 text-icon-soft" />
      </span>
    </button>
  );
}

/* ── Confirm / Cancel icon buttons ──────────────────────── */

function ActionButtons({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onCancel}
        className="flex size-7 cursor-pointer items-center justify-center rounded-(--radius-6) border border-stroke text-icon-soft transition-colors hover:bg-secondary-lighter"
      >
        <X className="size-4" />
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="flex size-7 cursor-pointer items-center justify-center rounded-(--radius-6) border border-stroke text-icon-soft transition-colors hover:bg-secondary-lighter"
      >
        <Check className="size-4" />
      </button>
    </div>
  );
}

/* ── Input editor ───────────────────────────────────────── */

const InputEditor = React.forwardRef<
  HTMLInputElement,
  {
    draft: string;
    maxLength: number;
    onChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onConfirm: () => void;
    onCancel: () => void;
  }
>(function InputEditor({ draft, maxLength, onChange, onKeyDown, onConfirm, onCancel }, ref) {
  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="text"
        value={draft}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 rounded-(--radius-6) border border-stroke bg-white px-(--spacing-8) py-(--spacing-4) text-sm leading-5 text-foreground outline-none transition-colors focus:border-stroke-strong"
      />
      <ActionButtons onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  );
});

/* ── Textarea editor ────────────────────────────────────── */

const TextareaEditor = React.forwardRef<
  HTMLTextAreaElement,
  {
    draft: string;
    maxLength: number;
    onChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onConfirm: () => void;
    onCancel: () => void;
  }
>(function TextareaEditor({ draft, maxLength, onChange, onKeyDown, onConfirm, onCancel }, ref) {
  const remaining = maxLength - draft.length;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        ref={ref}
        value={draft}
        maxLength={maxLength}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-w-0 resize-none rounded-(--radius-6) border border-stroke bg-white px-(--spacing-8) py-(--spacing-6) text-sm leading-5 text-foreground outline-none transition-colors focus:border-stroke-strong"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs leading-4 text-muted-foreground">
          {remaining} characters remaining
        </span>
        <ActionButtons onCancel={onCancel} onConfirm={onConfirm} />
      </div>
    </div>
  );
});

/* ── Dropdown editor ────────────────────────────────────── */

const DropdownEditor = React.forwardRef<
  HTMLDivElement,
  {
    menuRef: React.RefObject<HTMLDivElement | null>;
    value: string;
    options: string[];
    open: boolean;
    onToggle: () => void;
    onSelect: (val: string) => void;
    onCancel: () => void;
  }
>(function DropdownEditor({ menuRef, value, options, open, onToggle, onSelect, onCancel }, ref) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [open]);

  return (
    <div ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between rounded-(--radius-6) border border-stroke bg-white px-(--spacing-8) py-(--spacing-4) text-sm leading-5 text-foreground transition-colors hover:border-stroke-sub"
      >
        <span className="truncate">{value || "Select…"}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-icon-soft transition-transform", open && "rotate-180")} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="z-[200] max-h-[200px] overflow-auto rounded-(--radius-10) border border-stroke bg-bg-white p-(--spacing-4) shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(opt)}
                className={cn(
                  "w-full cursor-pointer rounded-(--radius-6) px-(--spacing-8) py-(--spacing-6) text-left text-sm leading-5 transition-colors hover:bg-secondary-lighter",
                  opt === value ? "font-medium text-foreground" : "text-foreground",
                )}
              >
                {opt}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
});

export { FieldItem };
export type { FieldItemProps };
