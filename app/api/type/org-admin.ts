export type OrgMemberType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  teamId: number;
  isActive: boolean;
  isSuperuser: boolean;
  invitationAccepted: boolean;
  dateJoined: string;
  lastLogin: string | null;
  roles: string[];
};

export type OrgMemberState = "active" | "inactive" | "pending";

export type OrgAdminRoleDialogMode = "make" | "revoke";
export enum OrgAdminRoleDialogModeEnum {
  MAKE = "make",
  REVOKE = "revoke",
}
