"use client";

import { cn } from "@/lib/utils";

export interface DraftTab {
  id: string;
  label: string;
}

export const DEFAULT_DRAFT_TABS: DraftTab[] = [
  { id: "2026", label: "2026 Draft Picks" },
  { id: "2027", label: "2027 Draft Picks" },
  { id: "2028", label: "2028 Draft Picks" },
  { id: "order", label: "Order of Entry" },
  { id: "full", label: "Full Draft List" },
  { id: "assets", label: "Draft Assets" },
];

function TabItem({
  tab,
  active,
  onClick,
}: {
  tab: DraftTab;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative shrink-0 px-1 pb-2 pt-1 text-sm transition-colors whitespace-nowrap",
        active
          ? "font-semibold text-primary dark:text-accent"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {tab.label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
      )}
    </button>
  );
}

export interface DraftPicksTabsProps {
  tabs?: DraftTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}

export function DraftPicksTabs({
  tabs = DEFAULT_DRAFT_TABS,
  activeTabId,
  onTabChange,
}: DraftPicksTabsProps) {
  const active = activeTabId ?? tabs[0]?.id;

  return (
    <div className="scrollbar-none flex items-center gap-6 overflow-x-auto border-t border-border bg-background px-4">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          active={tab.id === active}
          onClick={() => onTabChange?.(tab.id)}
        />
      ))}
    </div>
  );
}
