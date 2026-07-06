import {
  useCreateProject,
  useGetDraftOptions,
} from "@/app/api/react-query/projects";
import { useGetTeams } from "@/app/api/react-query/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProjectFormModalProps, ProjectFormValues } from "./type";
import {
  getProjectFormDefaults,
  projectFormSchema,
  projectToFormValues,
  toDraftSelectOptions,
  toTeamSelectOptions,
} from "./util";

export function useProjectFormModal({
  open,
  onOpenChange,
  project,
  defaultTeamId,
  onCreated,
}: ProjectFormModalProps) {
  const isEditing = !!project;
  const { data: draftOptions = [] } = useGetDraftOptions();
  const { data: teams = [] } = useGetTeams();
  const { mutate: createProject, isPending } = useCreateProject();

  const form = useForm<ProjectFormValues>({
    resolver: yupResolver(projectFormSchema),
    defaultValues: getProjectFormDefaults(defaultTeamId),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      project
        ? projectToFormValues(project)
        : getProjectFormDefaults(defaultTeamId),
    );
  }, [open, project, defaultTeamId, form]);

  const descriptionLength = form.watch("projectDescription")?.length ?? 0;

  const draftTypeOptions = useMemo(
    () => toDraftSelectOptions(draftOptions),
    [draftOptions],
  );

  const teamOptions = useMemo(() => toTeamSelectOptions(teams), [teams]);

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values: ProjectFormValues) => {
    if (isEditing) {
      toast.error("Project update is not available yet.");
      return;
    }

    const draftYear =
      draftOptions.find((option) => option.value === values.draftType)?.year ??
      "";

    createProject(
      { ...values, draftYear },
      {
        onSuccess: (createdProject) => {
          toast.success("Project created successfully");
          form.reset();
          onOpenChange(false);
          onCreated?.(createdProject);
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );
  });

  return {
    form,
    isEditing,
    isSubmitting: isPending,
    descriptionLength,
    draftTypeOptions,
    teamOptions,
    handleCancel,
    handleSubmit,
  };
}
