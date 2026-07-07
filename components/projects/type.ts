import { ProjectType } from "@/app/api/type/projects";

export type ProjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectType | null;
  defaultTeamId?: string;
  onCreated?: (project: ProjectType) => void;
};

export type ProjectFormValues = {
  projectName: string;
  projectDescription: string;
  draftType: string;
  team: string;
};
