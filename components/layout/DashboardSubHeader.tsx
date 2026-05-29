"use client";

import { ProjectType } from "@/app/api/react-query/projects";
import { DraftLabel } from "@/components/layout/dashboard-sub-header/DraftLabel";
import { ProjectDropdown } from "@/components/layout/dashboard-sub-header/ProjectDropdown";
import { TalentOrderDropdown } from "@/components/layout/dashboard-sub-header/TalentOrderDropdown";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface DashboardSubHeaderProps {
  projects?: ProjectType[];
  selectedProject?: ProjectType | null;
  onProjectChange?: (project: ProjectType) => void;
  talentOrder?: string;
  onTalentOrderChange?: (value: string) => void;
  onNewTransaction?: () => void;
  className?: string;
}

export function DashboardSubHeader({
  projects,
  onProjectChange,
  talentOrder,
  onTalentOrderChange,
  onNewTransaction,
  className,
  selectedProject,
}: DashboardSubHeaderProps) {
  const handleProjectChange = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    if (project) {
      onProjectChange?.(project);
    }
  };
  return (
    <div
  className={cn(
    "flex h-11 shrink-0 items-center justify-between border-l-4 border-l-primary border-b border-b-border bg-background pr-4",
    className,
  )}
>
      {/* Left: Draft label + dropdowns */}
      <div className="flex items-center gap-4">
        <DraftLabel />
        <ProjectDropdown
          value={selectedProject?.id}
          onChange={handleProjectChange}
          projects={projects}
        />
        <TalentOrderDropdown
          value={talentOrder}
          onChange={onTalentOrderChange}
        />
      </div>
      <Button
        onClick={onNewTransaction}
        size="sm"
        className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        New transaction
      </Button>
    </div>
  );
}
