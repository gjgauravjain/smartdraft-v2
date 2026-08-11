import { z } from "zod";
import { SelectOption } from "../common/fields/FormSelectField";
import { OrganisationListType } from "@/app/api/type/organisation";
import {
  UserListType,
  UserOrganisationType,
  UserTier,
} from "@/app/api/type/user";
import { ORGANISATION_ADMIN_ROLE } from "@/lib/org-admin";

export const createUserFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  defaultTeamId: z.string().min(1, "Select a default team"),
  tierId: z.string().min(1, "Select a tier"),
  organisationIds: z.array(z.string()),
  organisationAdminIds: z.array(z.string()),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const createUserFormDefaults: CreateUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  defaultTeamId: "",
  tierId: "",
  organisationIds: [],
  organisationAdminIds: [],
};

export type UserActiveStatus = "active" | "inactive" | "pending";

export const VISIBLE_ORG_CHIP_COUNT = 2;

export type TeamOption = {
  id: string;
  name: string;
};

export const normalizeOrgId = (orgId: string | number) => orgId.toString();

export const orgIdsMatch = (a: string | number, b: string | number) =>
  normalizeOrgId(a) === normalizeOrgId(b);

export const getLinkedOrganisations = (
  organisations: OrganisationListType[],
  organisationIds: string[],
): OrganisationListType[] =>
  organisationIds
    .map((orgId) => organisations.find((org) => orgIdsMatch(org.id, orgId)))
    .filter((org): org is OrganisationListType => !!org);

export const getAvailableOrganisations = (
  organisations: OrganisationListType[],
  organisationIds: string[],
): OrganisationListType[] =>
  organisations.filter(
    (org) => !organisationIds.some((orgId) => orgIdsMatch(org.id, orgId)),
  );

export const toTeamSelectOptions = (teams: TeamOption[]): SelectOption[] =>
  teams.map((team) => ({ value: team.id, label: team.name }));

export const getUserInitials = (user: UserListType): string => {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase();
};

export const getUserFullName = (user: UserListType): string =>
  `${user.firstName} ${user.lastName}`.trim();

export const getUserTier = (user: UserListType): UserTier =>
  user.isSuperuser ? "super_admin" : "standard";

export const isOrganisationAdmin = (org: UserOrganisationType): boolean =>
  org.roles.includes(ORGANISATION_ADMIN_ROLE);

export const formatOrgChipTooltip = (org: UserOrganisationType): string =>
  isOrganisationAdmin(org)
    ? `${org.organisationTitle} (org admin)`
    : org.organisationTitle;

export const getUserOrganisations = (
  user: UserListType,
): UserOrganisationType[] => user.organisations ?? [];

export const getUserActiveStatus = (user: UserListType): UserActiveStatus => {
  const orgs = getUserOrganisations(user);

  if (orgs.length > 0 && orgs.every((org) => !org.invitationAccepted)) {
    return "pending";
  }

  return user.isActive ? "active" : "inactive";
};

export const getPendingOrgCount = (user: UserListType): number => {
  const orgs = getUserOrganisations(user);
  if (orgs.length === 0) {
    return 0;
  }

  const pendingCount = orgs.filter((org) => !org.invitationAccepted).length;

  // Hint only when some — not all — memberships are still pending.
  if (pendingCount === 0 || pendingCount === orgs.length) {
    return 0;
  }

  return pendingCount;
};

export const isUserActive = (user: UserListType): boolean =>
  getUserActiveStatus(user) === "active";

export const filterUsers = (
  users: UserListType[],
  search: string,
  orgFilter: string,
  tierFilter: string,
  statusFilter: string,
): UserListType[] => {
  return users.filter((user) => {
    const fullName = getUserFullName(user).toLowerCase();
    const matchesSearch =
      !search ||
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesOrg =
      !orgFilter ||
      orgFilter === "all" ||
      user.organisations.some((o) =>
        o.organisationTitle.toLowerCase().includes(orgFilter.toLowerCase()),
      );

    const matchesTier =
      !tierFilter ||
      tierFilter === "all" ||
      (tierFilter === "super_admin" && user.isSuperuser) ||
      (tierFilter === "standard" && !user.isSuperuser);

    const status = getUserActiveStatus(user);
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      (statusFilter === "active" && status === "active") ||
      (statusFilter === "inactive" && status === "inactive") ||
      (statusFilter === "pending" && status === "pending");

    return matchesSearch && matchesOrg && matchesTier && matchesStatus;
  });
};
