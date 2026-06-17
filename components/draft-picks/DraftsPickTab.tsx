"use client";

import { TabOptionType } from "@/app/api/type/common";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MobileTabItem } from "./MobileDraftTab";

export interface DraftTab {
  id: string;
  label: string;
}

function TabItem({
  tab,
  active,
  onClick,
}: {
  tab: TabOptionType;
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
  tabs?: TabOptionType[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}

export function DraftPicksTabs({
  tabs = [],
  activeTabId,
  onTabChange,
}: DraftPicksTabsProps) {
  const active = activeTabId ?? tabs[0]?.value;
  const visibleTabs = tabs.filter((item) => !item.toHide);
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="border-b border-border bg-background">
        <div className="scrollbar-none flex gap-1.5 overflow-x-auto px-3.5 py-2">
          {visibleTabs.map((tab) => (
            <MobileTabItem
              key={tab.value}
              tab={tab}
              active={tab.value === active}
              onClick={() => onTabChange?.(tab.value)}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="scrollbar-none flex items-center gap-6 overflow-x-auto border-t border-border bg-background px-4">
      {tabs
        .filter((item) => !item.toHide)
        .map((tab) => (
          <TabItem
            key={tab.value}
            tab={tab}
            active={tab.value === active}
            onClick={() => onTabChange?.(tab.value)}
          />
        ))}
    </div>
  );
}
