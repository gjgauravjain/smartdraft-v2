export type OrgMemberType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  teamId: number;
  isActive: boolean;
  invitationAccepted: boolean;
  dateJoined: string;
  lastLogin: string | null;
  roles: string[];
};

export type OrgMemberState = "active" | "inactive" | "pending";
export type PendingAction = "make_admin" | "revoke_admin" | "remove" | null;
