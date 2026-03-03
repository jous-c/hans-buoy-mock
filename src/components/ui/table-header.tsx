import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Table Header Cell ───────────────────────────────────

type TableHeaderCellProps = React.ComponentProps<"div"> & {
  sortable?: boolean;
};

function TableHeaderCell({
  className,
  children,
  sortable,
  ...props
}: TableHeaderCellProps) {
  return (
    <div
      role="columnheader"
      className={cn(
        "flex h-8 shrink-0 items-center gap-2.5 bg-(--alpha-brown-10) px-3 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-0.5">
        <span className="truncate text-xs font-medium leading-4 text-muted-foreground whitespace-nowrap">
          {children}
        </span>
        {sortable && (
          <ArrowUpDown className="size-5 shrink-0 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

// ─── Table Header ─────────────────────────────────────────

interface TableHeaderColumn {
  label: string;
  width: number;
  sortable?: boolean;
}

interface TableHeaderProps extends React.ComponentProps<"div"> {
  columns: TableHeaderColumn[];
}

function TableHeader({ className, columns, ...props }: TableHeaderProps) {
  return (
    <div
      role="row"
      className={cn(
        "flex w-full items-center border-b border-stroke",
        className,
      )}
      {...props}
    >
      {columns.map((col, i) => (
        <TableHeaderCell
          key={col.label}
          sortable={col.sortable}
          className={cn(
            `w-[${col.width}px]`,
            i === 0 && "sticky left-0 z-20 pl-6 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]",
          )}
          style={{ width: col.width }}
        >
          {col.label}
        </TableHeaderCell>
      ))}
    </div>
  );
}

export { TableHeader, TableHeaderCell };
export type { TableHeaderProps, TableHeaderCellProps, TableHeaderColumn };
