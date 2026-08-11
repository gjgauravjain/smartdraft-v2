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
export type PendingAction = "make_admin" | "revoke_admin" | "remove" | null;
export enum PendingActionEnum {
  MAKE_ADMIN = "make_admin",
  REVOKE_ADMIN = "revoke_admin",
  REMOVE = "remove",
}
