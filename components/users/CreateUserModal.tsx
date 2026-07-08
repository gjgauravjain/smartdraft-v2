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
import { useIsMobile } from "@/hooks/use-mobile";
import { FormTextField } from "../common/fields/FormTextfield";
import { FormSelectField } from "../common/fields/FormSelectField";
import { useCreateUserModal } from "./hook";
import { LinkedOrganisationsSection } from "./LinkedOrganisationsSection";
import { CreateUserModalProps } from "./type";
import { toTeamSelectOptions } from "./util";

type FormBodyProps = {
  form: ReturnType<typeof useCreateUserModal>["form"];
  teams: CreateUserModalProps["teams"];
  tiers: CreateUserModalProps["tiers"];
  linkedOrgs: ReturnType<typeof useCreateUserModal>["linkedOrgs"];
  availableOrgsToAdd: ReturnType<
    typeof useCreateUserModal
  >["availableOrgsToAdd"];
  addOrganisation: ReturnType<typeof useCreateUserModal>["addOrganisation"];
  removeOrganisation: ReturnType<
    typeof useCreateUserModal
  >["removeOrganisation"];
  isMobile: boolean;
};

function FormBody({
  form,
  teams,
  tiers,
  linkedOrgs,
  availableOrgsToAdd,
  addOrganisation,
  removeOrganisation,
  isMobile,
}: FormBodyProps) {
  return (
    <div className="flex flex-col gap-4 overflow-auto p-5 flex-1">
      <div className="flex gap-3">
        <FormTextField
          control={form.control}
          name="firstName"
          label="First name"
          placeholder={isMobile ? "First" : "First name"}
          className="flex-1"
        />
        <FormTextField
          control={form.control}
          name="lastName"
          label="Last name"
          placeholder={isMobile ? "Last" : "Last name"}
          className="flex-1"
        />
      </div>

      <FormTextField
        control={form.control}
        name="email"
        label="Email"
        placeholder="name@club.com.au"
      />

      <div className={isMobile ? "flex flex-col gap-4" : "flex gap-3"}>
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
  );
}

export function CreateUserModal({
  open,
  onOpenChange,
  teams,
  tiers,
  organisations,
  defaultValues,
}: CreateUserModalProps) {
  const isMobile = useIsMobile();

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
      <DialogContent
        className={[
          "flex flex-col gap-0 p-0 overflow-hidden",
          "max-w-[580px] max-h-[712px] rounded-2xl",
          "max-sm:max-w-none max-sm:w-full max-sm:h-[100dvh]",
          "max-sm:max-h-[100dvh] max-sm:rounded-none",
          "max-sm:m-0 max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:top-0 max-sm:left-0 max-sm:inset-0",
        ].join(" ")}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col overflow-hidden flex-1"
          >
            {isMobile && <div className="h-[3px] bg-primary shrink-0" />}

            <DialogHeader
              className={[
                "border-b border-border space-y-0 shrink-0",
                isMobile
                  ? "flex-row items-center px-4 py-3"
                  : "flex-row items-center gap-3 px-5 py-[17px]",
              ].join(" ")}
            >
              {isMobile ? (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="w-[46px] text-left text-[14px] font-semibold text-muted-foreground bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <DialogTitle className="flex-1 text-center text-[15.5px] font-bold text-foreground">
                    Create user
                  </DialogTitle>
                  <span className="w-[46px]" />
                </>
              ) : (
                <>
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
                </>
              )}
            </DialogHeader>

            <FormBody
              form={form}
              teams={teams}
              tiers={tiers}
              linkedOrgs={linkedOrgs}
              availableOrgsToAdd={availableOrgsToAdd}
              addOrganisation={addOrganisation}
              removeOrganisation={removeOrganisation}
              isMobile={isMobile}
            />

            {isMobile ? (
              <div className="px-4 pb-[26px] pt-3 border-t border-border shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-[13px] bg-primary text-primary-foreground rounded-[10px] text-[14.5px] font-bold border-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating…" : "Create user"}
                </button>
              </div>
            ) : (
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
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
