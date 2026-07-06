import * as yup from "yup";
import { ProjectType } from "@/app/api/type/projects";
import { SelectOption } from "@/components/common/fields/FormSelectField";
import { TeamType } from "@/app/api/type/common";
import { DraftOptionType } from "@/app/api/type/projects";
import { ProjectFormValues } from "./type";
import { cn } from "@/lib/utils";

export const PROJECT_DESCRIPTION_MAX_LENGTH = 200;

export const projectFormSchema = yup.object({
  projectName: yup.string().required("Project name is required"),
  projectDescription: yup
    .string()
    .default("")
    .max(
      PROJECT_DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${PROJECT_DESCRIPTION_MAX_LENGTH} characters`,
    ),
  draftType: yup.string().required("Draft type is required"),
  team: yup.string().required("Club is required"),
});

export const getProjectFormDefaults = (
  defaultTeamId?: string,
): ProjectFormValues => ({
  projectName: "",
  projectDescription: "",
  draftType: "",
  team: defaultTeamId ?? "",
});

export const projectToFormValues = (
  project: ProjectType,
): ProjectFormValues => ({
  projectName: project.projectName,
  projectDescription: project.projectDesc ?? "",
  draftType: project.draftType,
  team: project.teamId,
});

export const toDraftSelectOptions = (
  options: DraftOptionType[],
): SelectOption[] =>
  options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

export const toTeamSelectOptions = (teams: TeamType[]): SelectOption[] =>
  teams.map((team) => ({
    value: team.id,
    label: team.teamNames,
    icon: team.image || undefined,
  }));

export const labelClassName =
  "text-xs font-semibold normal-case tracking-normal text-[rgb(76,85,99)] dark:text-[rgb(169,180,194)]";

export const labelOverrideClassName =
  "[&_label]:text-xs [&_label]:font-semibold [&_label]:normal-case [&_label]:tracking-normal [&_label]:text-[rgb(76,85,99)] dark:[&_label]:text-[rgb(169,180,194)]";

export const fieldClassName = cn(
  "[&_input]:h-10 [&_input]:rounded-[9px] [&_input]:border-border [&_input]:text-[13.5px] [&_input]:text-foreground",
  "[&_input]:bg-secondary dark:[&_input]:bg-muted",
  "[&_button]:h-10 [&_button]:rounded-[9px] [&_button]:border-border [&_button]:text-[13.5px] [&_button]:text-foreground",
  "[&_button]:bg-secondary dark:[&_button]:bg-muted",
);

export const mobileFieldClassName = cn(
  "[&_input]:h-[46px] [&_input]:rounded-[9px] [&_input]:border-border [&_input]:text-[15px] [&_input]:text-foreground",
  "[&_input]:bg-secondary dark:[&_input]:bg-muted",
  "[&_button]:h-[46px] [&_button]:rounded-[9px] [&_button]:border-border [&_button]:text-[15px] [&_button]:text-foreground",
  "[&_button]:bg-secondary dark:[&_button]:bg-muted",
);
