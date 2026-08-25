"use client";

import { Pencil, Shield, UserX } from "lucide-react";
import { UserListType } from "@/app/api/type/user";
import { ConfirmDangerDialog } from "@/components/common/ConfirmDangerDialog";
import { DotsIcon } from "@/components/common/icons";
import { ActionMenuItem } from "@/components/users/row-actions/ActionMenuItem";
import { ChangeTierDialog } from "@/components/users/row-actions/ChangeTierDialog";
import { EditUserDialog } from "@/components/users/row-actions/EditUserDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TeamOption } from "./util";
import { useUserRowActions } from "./hook";
import { useIsMobile } from "@/hooks/use-mobile";
import { VscKebabVertical } from "react-icons/vsc";

type UserRowActionsProps = {
  user: UserListType;
  teams: TeamOption[];
};

export function UserRowActions({ user, teams }: UserRowActionsProps) {
  const {
    open,
    setOpen,
    editOpen,
    setEditOpen,
    tierOpen,
    setTierOpen,
    deactivateOpen,
    setDeactivateOpen,
    selectedTier,
    setSelectedTier,
    editForm,
    isPending,
    isCurrentUser,
    canManageUsers,
    wouldRemoveLastSuperAdmin,
    handleEditUser,
    handleChangeTier,
    handleSaveEdit,
    handleSaveTier,
    handleDeactivateAccount,
    handleConfirmDeactivate,
    disableReason,
    changeTierReason,
    deactivateReason,
  } = useUserRowActions(user);
  const isMobile = useIsMobile();
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${user.firstName} ${user.lastName}`}
            className="inline-flex cursor-pointer rounded p-1 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
            onClick={(event) => event.stopPropagation()}
            disabled={isPending}
          >
            {isMobile ? <VscKebabVertical /> : <DotsIcon />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-1">
          <ActionMenuItem
            icon={<Pencil className="h-3 w-3" strokeWidth={1.8} />}
            label="Edit user"
            disabled={!canManageUsers || isCurrentUser || isPending}
            disabledReason={disableReason()}
            onClick={handleEditUser}
          />
          <ActionMenuItem
            icon={<Shield className="h-3 w-3" strokeWidth={1.8} />}
            label="Change tier"
            disabled={
              !canManageUsers ||
              isCurrentUser ||
              isPending ||
              wouldRemoveLastSuperAdmin
            }
            disabledReason={changeTierReason()}
            onClick={handleChangeTier}
          />
          {user.isActive && (
            <ActionMenuItem
              icon={<UserX className="h-3 w-3" strokeWidth={1.8} />}
              label="Deactivate account"
              destructive
              disabled={
                !canManageUsers ||
                isCurrentUser ||
                isPending ||
                !user.isActive ||
                wouldRemoveLastSuperAdmin
              }
              disabledReason={deactivateReason()}
              onClick={handleDeactivateAccount}
            />
          )}
        </PopoverContent>
      </Popover>

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
        form={editForm}
        teams={teams}
        isPending={isPending}
        onOpenTier={() => setTierOpen(true)}
        onSave={handleSaveEdit}
      />

      <ChangeTierDialog
        open={tierOpen}
        onOpenChange={setTierOpen}
        user={user}
        selectedTier={selectedTier}
        isPending={isPending}
        wouldRemoveLastSuperAdmin={wouldRemoveLastSuperAdmin}
        onSelectTier={setSelectedTier}
        onSave={handleSaveTier}
      />

      <ConfirmDangerDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate account"
        subtitle={`${user.firstName} ${user.lastName}`}
        description="This will disable the account and block sign in until it is reactivated."
        actionLabel="Deactivate"
        onConfirm={handleConfirmDeactivate}
        isLoading={isPending}
      />
    </>
  );
}
