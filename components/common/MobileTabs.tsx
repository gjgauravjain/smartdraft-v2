"use client";

import { cn } from "@/lib/utils";

export interface MobileTabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MobileTabsProps {
  tabs: MobileTabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MobileTabs({
  tabs,
  value,
  onChange,
  className,
}: MobileTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "mx-3 mt-2 flex shrink-0 gap-1 rounded-[9px] border border-border bg-secondary p-[3px]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex-1 rounded-[7px] py-2 font-sans text-[12.5px] font-semibold transition-colors",
              isActive
                ? "bg-card text-sub-heading shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                : "bg-transparent text-[rgb(130,143,158)] shadow-none",
              tab.disabled && "opacity-50",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
