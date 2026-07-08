"use client";

import { useMemo, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SortDir = "asc" | "desc";

export type SdColumnDef<T> = {
  key: string;
  label: string;
  width: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
};

export type SdTableGroup<T> = {
  label: string;
  summary?: string;
  rows: T[];
};

type Props<T> = {
  data?: T[];
  groups?: SdTableGroup<T>[];
  columns: SdColumnDef<T>[];
  rowKey: (row: T) => string | number;
  highlightRow?: (row: T) => boolean;
  accentRow?: (row: T) => boolean;
  defaultSortKey?: string;
  defaultSortDir?: SortDir;
  className?: string;
  tableBodyClassName?: string;
};

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span className={cn("text-[8px]", active ? "text-sub-heading" : "")}>
    {active ? dir === "asc" ? "▲" : "▼" : <span className="opacity-40">↕</span>}
  </span>
);

function SdTable<T>({
  data,
  groups,
  columns,
  rowKey,
  highlightRow,
  accentRow,
  defaultSortKey,
  defaultSortDir = "asc",
  className,
  tableBodyClassName,
}: Props<T>) {
  const firstSortable = columns.find((c) => c.sortable)?.key ?? columns[0].key;
  const [sortKey, setSortKey] = useState<string>(
    defaultSortKey ?? firstSortable,
  );
  const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortRows = (rows: T[]): T[] => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortable) return rows;
    const getValue =
      col.sortValue ??
      ((row: T) => String((row as Record<string, unknown>)[col.key] ?? ""));
    return [...rows].sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  };

  const resolvedGroups = useMemo<SdTableGroup<T>[]>(() => {
    if (groups) return groups.map((g) => ({ ...g, rows: sortRows(g.rows) }));
    return [{ label: "", rows: sortRows(data ?? []) }];
  }, [data, groups, sortKey, sortDir]); // eslint-disable-line react-hooks/exhaustive-deps

  const gridCols = columns.map((c) => c.width).join(" ");

  const thBase = cn(
    "px-3.5 py-2.5 text-left text-[9.5px] font-bold uppercase",
    "tracking-[0.6px] border-b border-border whitespace-nowrap select-none",
  );

  return (
    <div
      className={cn(
        "sd-table-wrap flex flex-col min-h-0 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div
        className="grid shrink-0 bg-table-header"
        style={{ gridTemplateColumns: gridCols, padding: "0 16px" }}
      >
        {columns.map((col) => {
          const active = sortKey === col.key;
          const alignClass =
            col.align === "center"
              ? "justify-center"
              : col.align === "right"
                ? "justify-end"
                : "";

          if (col.sortable) {
            return (
              <button
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={cn(
                  thBase,
                  "cursor-pointer flex items-center gap-1",
                  alignClass,
                  active ? "text-sub-heading" : "text-muted-foreground",
                )}
              >
                {col.label}
                <SortIcon active={active} dir={sortDir} />
              </button>
            );
          }

          return (
            <div
              key={col.key}
              className={cn(
                thBase,
                "text-muted-foreground cursor-default flex items-center",
                alignClass,
              )}
            >
              {col.label}
            </div>
          );
        })}
      </div>

      <div className={cn("flex-1 overflow-y-auto", tableBodyClassName)}>
        {resolvedGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div className="flex items-center gap-2 px-4 py-1.75 sticky top-0 z-10 border-b border-border bg-card">
                <span className="text-[11.5px] font-bold text-foreground">
                  {group.label}
                </span>
                {group.summary && (
                  <span className="text-[10.5px] text-muted-foreground tabular-nums ml-auto">
                    {group.summary}
                  </span>
                )}
              </div>
            )}

            {group.rows.map((row) => {
              const highlighted = highlightRow?.(row) ?? false;
              const accented = accentRow?.(row) ?? false;

              return (
                <div
                  key={rowKey(row)}
                  className={cn(
                    "grid items-center transition-colors",
                    "border-b border-table-row-border",
                    accented && "bg-primary-light",
                    !accented && highlighted && "bg-table-row-hover",
                    highlighted &&
                      "shadow-[2px_0_0_var(--table-row-text)_inset]",
                  )}
                  style={{
                    gridTemplateColumns: gridCols,
                    padding: "0 16px",
                    minHeight: "40px",
                  }}
                >
                  {columns.map((col) => {
                    const alignClass =
                      col.align === "center"
                        ? "justify-center"
                        : col.align === "right"
                          ? "justify-end"
                          : "";

                    const cellContent = col.render
                      ? col.render(row)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? "—",
                        );

                    return (
                      <div
                        key={col.key}
                        className={cn("flex items-center min-w-0", alignClass)}
                      >
                        {cellContent}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SdTable;
