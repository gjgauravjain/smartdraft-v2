"use client";

import { useState } from "react";
import { ProjectType } from "@/app/api/type/projects";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/common/BottomSheet";
import { MobileFilterPill } from "@/components/common/MobileFilterPill";
import { BottomSheetOption } from "@/components/common/BottomSheetOption";
import { FileIcon, Grid2X2Icon } from "lucide-react";

interface ProjectDropdownProps {
  projects?: ProjectType[];
  value?: string;
  onChange?: (value: string) => void;
}

export function ProjectDropdown({
  projects = [],
  value,
  onChange,
}: ProjectDropdownProps) {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const options = projects.map((project) => ({
    value: project.id,
    label: project.projectName,
  }));

  const selectedProject = projects.find((project) => project.id === value);

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
        >
          <div className="flex flex-col gap-1.5 px-3 py-2.5">
            {projects.map((project) => {
              const isSelected = project.id === value;
              const subtitle = [project.draftType, project.year]
                .filter(Boolean)
                .join(" · ");
              return (
                <BottomSheetOption
                  key={project.id}
                  label={project.projectName}
                  description={subtitle || undefined}
                  icon={<Grid2X2Icon />}
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
    <div className="flex items-center gap-2">
      <SearchableDropdown
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select project"
        searchPlaceholder="Search projects..."
        emptyMessage="No projects found."
        showStatusDot
        triggerClassName="rounded-full max-w-[118px]! border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
      />
    </div>
  );
}
