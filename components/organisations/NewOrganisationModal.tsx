"use client";

import { LayoutGridIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { NewOrganisationModalProps } from "./type";
import { useNewOrganisationModalWizard } from "./hook";
import { InfoBanner } from "./InfoBanner";
import { FormTextField } from "../common/fields/FormTextfield";
import { FormSelectField } from "../common/fields/FormSelectField";
import { Button } from "../ui/button";

export function NewOrganisationModal({
  open,
  onOpenChange,
}: NewOrganisationModalProps) {
  const { form, handleCancel, isSubmitting, handleSubmit, teamOptions } =
    useNewOrganisationModalWizard({
      onOpenChange,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 p-0 gap-0 bg-card border-border overflow-hidden">
        <DialogHeader className="flex-row items-center gap-3 px-5 py-4.25 border-b border-border space-y-0">
          <div className="w-9 h-9 rounded-[9px] bg-sub-heading/10 text-sub-heading flex items-center justify-center shrink-0">
            <LayoutGridIcon size={18} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-[15.5px] font-bold text-foreground leading-none">
              New organisation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.75">
              Creates an empty org — add users afterwards
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="px-5 py-5 flex flex-col gap-4">
              <FormTextField
                control={form.control}
                name="organisationName"
                label="Organisation name"
                placeholder="e.g. Brisbane Lions"
              />

              <div className="flex gap-3">
                <FormTextField
                  control={form.control}
                  name="sportingCode"
                  label="Sporting code"
                  placeholder="Enter Code"
                  className="flex-1 min-w-0"
                />
                <FormSelectField
                  control={form.control}
                  name="defaultTeam"
                  label="Default team"
                  options={teamOptions}
                  placeholder="Select from team list"
                  className="flex-1 min-w-0"
                />
              </div>

              <InfoBanner />
            </div>

            <div className="px-5 py-3.5 border-t border-border flex gap-[10px] justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                className="text-[12.5px] font-semibold"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                className="cursor-pointer text-[12.5px] font-semibold"
              >
                Create organisation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
