"use client";

import { useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { ProjectType } from "@/app/api/type/projects";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/common/BottomSheet";
import { MobileFilterPill } from "@/components/common/MobileFilterPill";
import { BottomSheetOption } from "@/components/common/BottomSheetOption";
import { DesktopProjectDropdown } from "./DesktopProjectDropdown";
import { useStore } from "@/store/useStore";
import { DraftBoardIcon } from "@/components/common/icons";
import { Button } from "@/components/ui/button";

interface ProjectDropdownProps {
  projects?: ProjectType[];
  value?: string;
  onChange: (value: string) => void;
  onNewProject: () => void;
}

export const ProjectDropdown = ({
  projects = [],
  value,
  onChange,
  onNewProject,
}: ProjectDropdownProps) => {
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(b.id) - Number(a.id)),
    [projects],
  );

  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedProject = projects.find((p) => p.id === value);
  const { selectedTeam } = useStore();
  if (isMobile) {
    return (
      <>
        <MobileFilterPill
          eyebrow="Project"
          value={selectedProject?.projectName ?? "Select project"}
          active={!!selectedProject}
          onClick={() => setSheetOpen(true)}
        />
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Switch project"
          subtitle={selectedProject?.projectName}
          footer={
            <div className=" gap-2.5 border-t border-border bg-secondary px-[22px] py-3.5 dark:bg-muted">
              <Button className="w-full" onClick={onNewProject}>
                <PlusIcon />
                <span className="text-[13.5px] font-semibold">New project</span>
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-1.5 px-3 py-2.5">
            {sortedProjects.map((project) => {
              const isSelected = project.id === value;
              const subtitle = [project.draftType, project.year]
                .filter(Boolean)
                .join(" · ");
              return (
                <BottomSheetOption
                  key={project.id}
                  label={project.projectName}
                  description={subtitle || undefined}
                  icon={<DraftBoardIcon />}
                  selected={isSelected}
                  onClick={() => {
                    onChange?.(project.id);
                    setSheetOpen(false);
                  }}
                />
              );
            })}
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <DesktopProjectDropdown
      projects={sortedProjects}
      value={value ?? ""}
      onChange={onChange}
      selectedTeam={selectedTeam}
      onNewProject={onNewProject}
    />
  );
};
