import { Pencil, Shield } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { UserListType } from "@/app/api/type/user";
import { Button } from "@/components/ui/button";
import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { FormTextField } from "@/components/common/fields/FormTextfield";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn, formatDate } from "@/lib/utils";
import { TeamOption } from "../util";
import { EditUserFormValues } from "./editUserForm";
import { getEditTeamOptions } from "./utils";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserListType;
  form: UseFormReturn<EditUserFormValues>;
  teams: TeamOption[];
  isPending: boolean;
  onOpenTier: () => void;
  onSave: SubmitHandler<EditUserFormValues>;
};

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  form,
  teams,
  isPending,
  onOpenTier,
  onSave,
}: EditUserDialogProps) {
  const editIsActive = form.watch("isActive");
  const editDefaultTeamId = form.watch("defaultTeamId");
  const teamOptions = getEditTeamOptions(teams, editDefaultTeamId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[716px] max-w-[520px] overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:rounded-[14px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSave)}
            className="flex max-h-[716px] flex-col overflow-hidden"
          >
            <DialogHeader className="flex-row items-center gap-3 border-b border-border px-5 py-[17px]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-primary/10 text-primary">
                <Pencil className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-[15.5px] font-bold text-foreground">
                  Edit {user.firstName} {user.lastName}
                </DialogTitle>
                <DialogDescription className="mt-px text-xs text-muted-foreground">
                  Joined{" "}
                  {formatDate(user.dateJoined, "MMM DD, YYYY") || "recently"}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex max-h-[540px] flex-col gap-4 overflow-auto px-5 py-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <FormTextField
                  control={form.control}
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                  className="flex-1"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="lastName"
                  label="Last name"
                  placeholder="Last name"
                  className="flex-1"
                  required
                />
              </div>

              <div className="min-w-0">
                <label className="mb-1.5 block text-[11.5px] font-bold text-foreground">
                  Email
                </label>
                <div className="flex w-full items-center gap-2 rounded-[7px] border border-input bg-muted px-3 py-2 text-[13px] text-muted-foreground">
                  <span className="flex-1">{user.email}</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
                <div className="mt-1.5 text-[11px] leading-[1.4] text-muted-foreground">
                  Owned by the sign-in provider - not editable here.
                </div>
              </div>

              <FormSelectField
                control={form.control}
                name="defaultTeamId"
                label="Default team"
                placeholder="Select team"
                options={teamOptions}
                emptyMessage="No teams found."
                required
              />

              <button
                type="button"
                onClick={() => form.setValue("isActive", !editIsActive)}
                className="flex items-center justify-between rounded-[9px] border border-border bg-secondary px-3.5 py-3 text-left"
              >
                <span className="text-[12.5px] font-bold text-foreground">
                  Account active
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-[34px] items-center rounded-full border border-transparent p-0.5 transition-colors",
                      editIsActive
                        ? "justify-end bg-primary"
                        : "justify-start bg-input",
                    )}
                  >
                    <span className="h-[14px] w-[14px] rounded-full bg-background shadow-sm" />
                  </span>
                </span>
              </button>

              <div className="flex items-center justify-between rounded-[9px] border border-border bg-card px-3.5 py-3">
                <div>
                  <div className="text-[12.5px] font-bold text-foreground">
                    Platform tier
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {user.isSuperuser ? "Super Admin" : "Standard"} - changed in
                    its own confirm step
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenTier}
                  className="h-auto rounded-[6px] border-border px-2.5 py-1.5 text-[11.5px] font-semibold"
                >
                  <Shield className="mr-1.5 h-3 w-3" strokeWidth={1.8} />
                  Change tier
                </Button>
              </div>
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
                disabled={isPending}
                className="h-auto rounded-[6px] px-3.5 py-2 text-[12.5px] font-semibold"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
