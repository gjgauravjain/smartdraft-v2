"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormTextField } from "@/components/common/fields/FormTextfield";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useProjectFormModal } from "./hook";
import { ProjectFormModalProps } from "./type";
import {
  fieldClassName,
  labelClassName,
  labelOverrideClassName,
  mobileFieldClassName,
  PROJECT_DESCRIPTION_MAX_LENGTH,
} from "./util";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "./type";
import { SelectOption } from "@/components/common/fields/FormSelectField";

type ProjectFormFieldsProps = {
  control: Control<ProjectFormValues>;
  descriptionLength: number;
  draftTypeOptions: SelectOption[];
  teamOptions: SelectOption[];
  isMobile?: boolean;
};

function ProjectFormFields({
  control,
  descriptionLength,
  draftTypeOptions,
  teamOptions,
  isMobile = false,
}: ProjectFormFieldsProps) {
  const fieldsClassName = cn(
    isMobile ? mobileFieldClassName : fieldClassName,
    labelOverrideClassName,
  );

  return (
    <>
      <FormTextField
        control={control}
        name="projectName"
        label="Project name"
        placeholder="2026 Live Draft"
        required
        italiseLabel
        className={fieldsClassName}
      />

      <div>
        <div className="mb-[7px] flex items-center justify-between">
          <span className={cn(labelClassName, "italic")}>Description</span>
          <span className="mb-0 text-[11px] tabular-nums text-[rgb(115,123,136)] dark:text-[rgb(130,143,158)]">
            {descriptionLength} / {PROJECT_DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
        <FormTextField
          control={control}
          name="projectDescription"
          label=""
          placeholder="Primary board for the 2026 national draft."
          italiseLabel
          className={cn(fieldsClassName, "[&_label]:hidden")}
        />
      </div>

      <FormSelectField
        control={control}
        name="draftType"
        label="Draft type"
        required
        placeholder="Select draft type"
        options={draftTypeOptions}
        emptyMessage="No draft types found."
        description="Sets the starting ladder/order and the draft year."
        className={cn(
          fieldsClassName,
          "[&_p]:text-[rgb(115,123,136)] dark:[&_p]:text-[rgb(130,143,158)]",
        )}
      />

      <FormSelectField
        control={control}
        name="team"
        label="Club"
        required
        placeholder="Select club"
        options={teamOptions}
        emptyMessage="No clubs found."
        className={fieldsClassName}
      />
    </>
  );
}

export function ProjectFormModal(props: ProjectFormModalProps) {
  const { open, onOpenChange } = props;
  const isMobile = useIsMobile();
  const {
    form,
    isEditing,
    isSubmitting,
    descriptionLength,
    draftTypeOptions,
    teamOptions,
    handleCancel,
    handleSubmit,
  } = useProjectFormModal(props);

  const title = isEditing ? "Edit project" : "New project";
  const submitLabel = isEditing ? "Save changes" : "Create project";

  const formFieldsProps = {
    control: form.control,
    descriptionLength,
    draftTypeOptions,
    teamOptions,
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-full flex-col gap-0 border-border bg-card p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>

          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-bold text-foreground">
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[15px] text-[rgb(115,123,136)] transition-colors hover:bg-secondary dark:text-[rgb(130,143,158)] dark:hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
                {!isEditing && (
                  <p className="mb-[18px] text-[12.5px] leading-[1.5] text-[rgb(115,123,136)] dark:text-[rgb(130,143,158)]">
                    Creates a draft-year workspace. Roster spots, the masterlist,
                    and default players are set up automatically.
                  </p>
                )}

                <div className="flex flex-col gap-[18px]">
                  <ProjectFormFields {...formFieldsProps} isMobile />
                </div>
              </div>

              <div className="flex shrink-0 gap-2.5 border-t border-border bg-card px-4 pb-[26px] pt-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className="h-12 flex-1 rounded-[9px] border-border bg-card text-[15px] font-semibold text-[rgb(76,85,99)] dark:text-[rgb(169,180,194)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="h-12 flex-[2] rounded-[9px] text-[15px] font-bold shadow-[rgba(0,0,0,0.18)_0px_1px_2px]"
                >
                  {submitLabel}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-[rgba(20,28,40,0.42)] dark:bg-black/60"
        className="w-[520px] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[rgba(0,0,0,0.5)_0px_24px_70px_-10px] dark:border-border [&>button]:hidden"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start gap-3 border-b border-border px-[22px] pb-4 pt-5">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-[17px] font-bold text-foreground">
                  {title}
                </DialogTitle>
                {!isEditing && (
                  <DialogDescription className="mt-1 max-w-[420px] text-xs leading-[1.45] text-[rgb(115,123,136)] dark:text-[rgb(130,143,158)]">
                    Creates a draft-year workspace. Roster spots, the
                    masterlist, and default players are set up automatically.
                  </DialogDescription>
                )}
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm text-[rgb(115,123,136)] transition-colors hover:bg-secondary dark:text-[rgb(130,143,158)] dark:hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-[22px] py-5">
              <ProjectFormFields {...formFieldsProps} />
            </div>

            <div className="flex justify-end gap-2.5 border-t border-border bg-secondary px-[22px] py-3.5 dark:bg-muted">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleCancel}
                className="h-10 rounded-[9px] border-border bg-card px-4 text-[13.5px] font-semibold text-[rgb(76,85,99)] dark:text-[rgb(169,180,194)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="h-10 rounded-[9px] px-[18px] text-[13.5px] font-bold shadow-[rgba(0,0,0,0.18)_0px_1px_2px]"
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormModal;
