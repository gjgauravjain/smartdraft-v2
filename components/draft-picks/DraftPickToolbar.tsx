"use client";

import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TeamBadge } from "./TeamBadge";
import { TeamType } from "@/app/api/type/common";
import { useStore } from "@/store/useStore";
import { MobileDraftPicksHeader } from "./MobileDraftsPickHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardSubHeader } from "../layout/DashboardSubHeader";
import { ProjectType } from "@/app/api/type/projects";
import { SearchableDropdownOption } from "../ui/searchable-dropdown";

export interface DraftPicksToolbarProps {
  teams?: TeamType[];
  selectedTeamId?: string;
  onTeamSelect?: (id: string) => void;
  onSearch?: () => void;
  isAll: boolean;
  onToggleAll: (isAll: boolean) => void;
  projects?: ProjectType[];
  selectedProject?: ProjectType | null;
  onProjectChange?: (project: ProjectType) => void;
  talentOrder?: string;
  onTalentOrderChange?: (value: string) => void;
  onNewTransaction?: () => void;
  className?: string;
  talentOrderOptions: SearchableDropdownOption[];
}

export function DraftPicksToolbar({
  teams = [],
  selectedTeamId,
  onTeamSelect,
  onSearch,
  isAll,
  onToggleAll,
  projects,
  selectedProject,
  onProjectChange,
  talentOrder,
  onTalentOrderChange,
  talentOrderOptions,
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
    <div className="scrollbar-none flex h-12 w-full items-center gap-3 overflow-x-auto bg-card px-4">
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

      <div className="flex items-center gap-2 p-2 rounded-sm">
        <DashboardSubHeader
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={onProjectChange}
          talentOrder={talentOrder}
          onTalentOrderChange={onTalentOrderChange}
          talentOrderOptions={talentOrderOptions}
        />
      </div>
    </div>
  );
}
