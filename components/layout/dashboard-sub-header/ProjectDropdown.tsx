"use client";

import { ProjectType } from "@/app/api/type/projects";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";

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
  const options = projects.map((project) => ({
    value: project.id,
    label: project.projectName,
  }));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Project</span>
      <SearchableDropdown
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select project"
        searchPlaceholder="Search projects..."
        emptyMessage="No projects found."
        showStatusDot
        triggerClassName="rounded-full border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
      />
    </div>
  );
}
