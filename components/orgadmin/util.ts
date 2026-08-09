import dayjs from "dayjs";
import { OrgMemberType, OrgMemberState } from "@/app/api/type/org-admin";
import { ORGANISATION_ADMIN_ROLE } from "@/lib/org-admin";

export type OrgAdminFilterState = {
  search: string;
  roleFilter: "all" | "org_admin" | "member";
  stateFilter: "all" | OrgMemberState;
};

export const defaultOrgAdminFilters: OrgAdminFilterState = {
  search: "",
  roleFilter: "all",
  stateFilter: "all",
};

export const getMemberFullName = (member: OrgMemberType) =>
  `${member.firstName} ${member.lastName}`.trim();

export const getMemberState = (member: OrgMemberType): OrgMemberState => {
  if (!member.invitationAccepted) {
    return "pending";
  }

  return member.isActive ? "active" : "inactive";
};

export const isOrgAdminMember = (member: OrgMemberType) =>
  member.roles.includes(ORGANISATION_ADMIN_ROLE);

export const getMemberSummarySubtitle = (member: OrgMemberType) => {
  const role = isOrgAdminMember(member) ? "Org admin" : "Member";
  const state = getMemberState(member);
  const stateLabel = state.charAt(0).toUpperCase() + state.slice(1);

  return `${role} · ${stateLabel}`;
};

export const formatMemberJoinedDate = (date: string) =>
  date ? dayjs(date).format("D MMM YYYY") : "—";

export const filterOrgMembers = (
  members: OrgMemberType[],
  filters: OrgAdminFilterState,
) => {
  const search = filters.search.trim().toLowerCase();

  return members.filter((member) => {
    const fullName = getMemberFullName(member).toLowerCase();

    if (
      search &&
      !fullName.includes(search) &&
      !member.email.toLowerCase().includes(search)
    ) {
      return false;
    }

    const isAdmin = isOrgAdminMember(member);

    if (filters.roleFilter === "org_admin" && !isAdmin) {
      return false;
    }

    if (filters.roleFilter === "member" && isAdmin) {
      return false;
    }

    const state = getMemberState(member);

    if (filters.stateFilter !== "all" && state !== filters.stateFilter) {
      return false;
    }

    return true;
  });
};

export const getUpdatedRoles = (
  currentRoles: string[],
  makeAdmin: boolean,
): string[] => {
  if (makeAdmin) {
    return currentRoles.includes(ORGANISATION_ADMIN_ROLE)
      ? currentRoles
      : [...currentRoles, ORGANISATION_ADMIN_ROLE];
  }

  return currentRoles.filter((role) => role !== ORGANISATION_ADMIN_ROLE);
};
