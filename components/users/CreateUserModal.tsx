"use client";

import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormTextField } from "../common/fields/FormTextfield";
import { FormSelectField } from "../common/fields/FormSelectField";
import { useCreateUserModal } from "./hook";
import { LinkedOrganisationsSection } from "./LinkedOrganisationsSection";
import { CreateUserModalProps } from "./type";
import { toTeamSelectOptions } from "./util";

export function CreateUserModal({
  open,
  onOpenChange,
  teams,
  tiers,
  organisations,
  defaultValues,
}: CreateUserModalProps) {
  const {
    form,
    isSubmitting,
    linkedOrgs,
    availableOrgsToAdd,
    addOrganisation,
    removeOrganisation,
    handleSubmit,
  } = useCreateUserModal({ open, onOpenChange, organisations, defaultValues });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[580px] max-h-[712px] flex flex-col gap-0 p-0 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-hidden"
          >
            <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b border-border px-5 py-[17px]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-primary/[0.08] text-primary">
                <UserPlus className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-[15.5px] font-bold text-foreground">
                  Create user
                </DialogTitle>
                <DialogDescription className="mt-px text-xs text-muted-foreground">
                  Add a user, then link them to one or more orgs
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4 overflow-auto p-5">
              <div className="flex gap-3">
                <FormTextField
                  control={form.control}
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                  className="flex-1"
                />
                <FormTextField
                  control={form.control}
                  name="lastName"
                  label="Last name"
                  placeholder="Last name"
                  className="flex-1"
                />
              </div>

              <FormTextField
                control={form.control}
                name="email"
                label="Email"
                placeholder="name@club.com.au"
              />

              <div className="flex gap-3">
                <FormSelectField
                  control={form.control}
                  name="defaultTeamId"
                  label="Default team"
                  placeholder="Select team"
                  options={toTeamSelectOptions(teams)}
                  emptyMessage="No teams found."
                  className="flex-1"
                />
                <FormSelectField
                  control={form.control}
                  name="tierId"
                  label="Tier"
                  placeholder="Select tier"
                  options={tiers}
                  emptyMessage="No tiers found."
                  description="Options come from the backend role catalogue."
                  className="flex-1"
                />
              </div>

              <LinkedOrganisationsSection
                linkedOrgs={linkedOrgs}
                availableOrgs={availableOrgsToAdd}
                onAdd={addOrganisation}
                onRemove={removeOrganisation}
              />
            </div>

            <DialogFooter className="border-t border-border px-5 py-3.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              >
                {isSubmitting ? "Creating…" : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
