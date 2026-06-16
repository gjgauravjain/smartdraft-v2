"use client";

import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TeamBadge } from "./TeamBadge";
import { TeamType } from "@/app/api/type/common";
import { useStore } from "@/store/useStore";
import { MobileDraftPicksHeader } from "./MobileDraftsPickHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export interface DraftPicksToolbarProps {
  teams?: TeamType[];
  selectedTeamId?: string;
  onTeamSelect?: (id: string) => void;
  applyCompensation?: boolean;
  onApplyCompensation?: (v: boolean) => void;
  onSearch?: () => void;
  isAll: boolean;
  onToggleAll: (isAll: boolean) => void;
}

export function DraftPicksToolbar({
  teams = [],
  selectedTeamId,
  onTeamSelect,
  applyCompensation = true,
  onApplyCompensation,
  onSearch,
  isAll,
  onToggleAll,
}: DraftPicksToolbarProps) {
  const { setHoveredTeamId } = useStore();

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileDraftPicksHeader
        title="Draft Picks"
        subtitle={`2026 · ${isAll ? "All clubs" : "Selected club"}`}
        notificationCount={3}
        onSearch={onSearch}
        onNotifications={() => {}}
      />
    );
  }
  return (
    <div className="scrollbar-none flex h-12 w-full items-center gap-3 overflow-x-auto bg-background px-4">
      <span className="shrink-0 text-sm font-bold text-foreground">
        Draft Picks
      </span>

      <div className="flex items-center gap-2">
        <Label
          htmlFor="compensation"
          className="cursor-pointer whitespace-nowrap text-sm text-foreground"
        >
          All
        </Label>
        <Switch
          id="all-toggle"
          checked={isAll}
          onCheckedChange={(v) => onToggleAll(v)}
        />
      </div>
      <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none py-1">
        {teams.map((team) => (
          <TeamBadge
            key={team.id}
            team={team}
            selected={team.id === selectedTeamId}
            onClick={() => {
              if (team.id === selectedTeamId) {
                onTeamSelect?.("");
                return;
              }
              onTeamSelect?.(team.id);
            }}
            onHovered={() => setHoveredTeamId(team.id)}
            onHoverLeave={() => setHoveredTeamId(null)}
          />
        ))}
      </div>
      <button
        onClick={onSearch}
        className="flex h-9.5 w-9.5 border items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 border p-2 rounded-sm">
        <Switch
          id="compensation"
          checked={applyCompensation}
          onCheckedChange={onApplyCompensation}
        />
        <Label
          htmlFor="compensation"
          className="cursor-pointer whitespace-nowrap text-sm text-foreground"
        >
          Apply compensation picks
        </Label>
      </div>
    </div>
  );
}
