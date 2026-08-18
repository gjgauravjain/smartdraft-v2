import { OrgMemberType } from "../type/org-admin";

export const transformOrgMembers = (data: unknown): OrgMemberType[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(
    (member: Record<string, unknown>) =>
      ({
        userId: Number(member.user_id ?? member.id),
        firstName: String(member.first_name ?? ""),
        lastName: String(member.last_name ?? ""),
        email: String(member.email ?? ""),
        teamId: Number(member.Teams ?? 0),
        isActive: Boolean(member.is_active),
        isSuperuser: Boolean(member.is_superuser),
        invitationAccepted: Boolean(member.invitation_accepted),
        dateJoined: String(member.date_joined ?? ""),
        memberSince: String(member.member_since ?? ""),
        lastLogin: member.last_login ? String(member.last_login) : null,
        roles: Array.isArray(member.roles)
          ? member.roles.map((role) => String(role))
          : [],
      }) as OrgMemberType,
  );
};
