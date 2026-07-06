import { TeamType } from "@/app/api/type/common";
import { ProjectType } from "@/app/api/type/projects";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { isPastSeason } from "./util";
import { DraftBoardIcon } from "@/components/common/icons";
import { Plus } from "lucide-react";

interface ProjectDropdownProps {
  projects: ProjectType[];
  value: string;
  onChange: (value: string) => void;
  selectedTeam: TeamType | null;
  onNewProject: () => void;
}

const ProjectRow = ({
  project,
  isSelected,
  onClick,
}: {
  project: ProjectType;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const past = isPastSeason(project);
  const subtitle = [project.draftType, project.year]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "mb-0.5 flex cursor-pointer items-center gap-[11px] rounded-[9px] px-[9px] py-[9px]",
        isSelected ? "bg-primary/20" : "hover:bg-table-header",
        past && "opacity-55",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isSelected
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-table-header text-muted-foreground",
        )}
      >
        <DraftBoardIcon />
      </span>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-[13px] font-bold",
            isSelected ? "text-dropdown-primary" : "text-foreground",
          )}
        >
          {project.projectName}
        </div>
        {subtitle && (
          <div className="mt-px font-sans text-[10.5px] tabular-nums text-muted-foreground/80">
            {subtitle}
          </div>
        )}
      </div>

      {isSelected ? (
        <span className="shrink-0 text-sm font-extrabold text-primary">✓</span>
      ) : past ? (
        <span className="shrink-0 rounded-[4px] border border-border px-[5px] py-px text-[9px] font-bold uppercase tracking-[0.4px] text-[rgb(94,107,123)]">
          Past season
        </span>
      ) : null}
    </div>
  );
};

export const DesktopProjectDropdown = ({
  projects = [],
  value,
  onChange = () => {},
  selectedTeam,
  onNewProject = () => {},
}: ProjectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const selectedProject = projects.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Switch project"
          className={cn(
            "flex h-auto max-w-56 flex-col items-start justify-center gap-0 overflow-hidden rounded-[5px] border px-[9px] py-[3px] leading-[1.15] transition-colors",
            "border-primary/20 bg-primary-light text-primary dark:bg-primary dark:text-white",
            "data-[state=open]:border-primary data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:shadow-[0_0_0_3px_oklch(0.54_0.132_0_/_0.2)]",
          )}
        >
          <span className="truncate text-[7.5px] font-bold uppercase tracking-[0.7px] opacity-70">
            Project
          </span>
          <span className="relative flex w-full min-w-0 items-center gap-[5px]">
            <p className="min-w-0 flex-1 truncate whitespace-nowrap text-left text-[11.5px] font-bold">
              {selectedProject?.projectName ?? "Select project"}
            </p>
            <span className="shrink-0 text-[9px] opacity-80 transition-transform duration-150 group-data-[state=open]:rotate-180">
              ▾
            </span>
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={9}
        className="w-[360px] overflow-hidden rounded-[12px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.6)_0px_16px_48px_-8px,rgba(0,0,0,0.1)_0px_4px_12px]"
      >
        <div
          className="absolute right-[38px] top-[-6px] h-[11px] w-[11px] rotate-45 bg-card"
          style={{
            borderLeft: "1px solid var(--border)",
            borderTop: "1px solid var(--border)",
          }}
        />

        <div className="border-b border-border px-4 pb-[11px] pt-[13px]">
          <div className="text-[13px] font-bold text-foreground">
            Switch project
          </div>
          <div className="mt-[3px] flex items-center gap-1.5">
            <img
              src={selectedTeam?.image}
              alt={selectedTeam?.teamNames}
              className="w-[12] h-[12] rounded-full"
            />
            <p className="font-sans text-[11.5px] text-muted-foreground/80">
              {selectedTeam?.teamNames}
            </p>
          </div>
        </div>

        <div
          role="listbox"
          className="max-h-[296px] overflow-y-auto px-2 py-[7px]"
        >
          {projects.length === 0 ? (
            <div className="px-2 py-6 text-center text-xs text-muted-foreground">
              No projects found.
            </div>
          ) : (
            projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isSelected={project.id === value}
                onClick={() => {
                  onChange(project.id);
                  setOpen(false);
                }}
              />
            ))
          )}
        </div>

        <div className="border-t border-border px-3 py-[10px]">
          <button
            type="button"
            onClick={() => {
              onNewProject();
              setOpen(false);
            }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[9px] bg-primary font-sans text-[13px] font-bold text-primary-foreground"
          >
            <Plus className="h-[15px] w-[15px]" strokeWidth={1.8} />
            New Project
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
