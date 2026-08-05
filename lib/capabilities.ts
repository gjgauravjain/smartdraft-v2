import { UserDetailsType } from "@/app/api/type/common";

export const REBUILD_DRAFT_EDIT_CAPABILITY = "rebuild_draft_edit";

export const hasRebuildDraftEditCapability = (
  user: UserDetailsType | null | undefined,
): boolean => {
  if (!user) return false;
  if (user.isSuperuser) return true;

  return (
    user.userPermissions.includes(REBUILD_DRAFT_EDIT_CAPABILITY) ||
    user.groups.includes(REBUILD_DRAFT_EDIT_CAPABILITY)
  );
};
