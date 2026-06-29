"use client";

import { DraftLabel } from "@/components/layout/dashboard-sub-header/DraftLabel";
import { ProjectDropdown } from "@/components/layout/dashboard-sub-header/ProjectDropdown";
import { TalentOrderDropdown } from "@/components/layout/dashboard-sub-header/TalentOrderDropdown";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { ProjectType } from "@/app/api/type/projects";
import { SearchableDropdownOption } from "../ui/searchable-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardSubHeaderProps {
  projects?: ProjectType[];
  selectedProject?: ProjectType | null;
  onProjectChange?: (project: ProjectType) => void;
  talentOrder?: string;
  onTalentOrderChange?: (value: string) => void;
  onNewTransaction?: () => void;
  className?: string;
  talentOrderOptions: SearchableDropdownOption[];
}

export function DashboardSubHeader({
  projects,
  onProjectChange,
  talentOrder,
  onTalentOrderChange,
  onNewTransaction,
  className,
  selectedProject,
  talentOrderOptions,
}: DashboardSubHeaderProps) {
  const isMobile = useIsMobile();
  const handleProjectChange = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    if (project) {
      onProjectChange?.(project);
    }
  };

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex shrink-0 gap-2  border-b border-b-border bg-card px-3 py-2",
          className,
        )}
      >
        <ProjectDropdown
          value={selectedProject?.id}
          onChange={handleProjectChange}
          projects={projects}
        />
        <TalentOrderDropdown
          value={talentOrder}
          onChange={onTalentOrderChange}
          options={talentOrderOptions}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-11 shrink-0 items-center justify-between bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <ProjectDropdown
          value={selectedProject?.id}
          onChange={handleProjectChange}
          projects={projects}
        />
        <TalentOrderDropdown
          value={talentOrder}
          onChange={onTalentOrderChange}
          options={talentOrderOptions}
        />
        <Button
          onClick={onNewTransaction}
          size="sm"
          className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New transaction
        </Button>
      </div>
    </div>
  );
}
