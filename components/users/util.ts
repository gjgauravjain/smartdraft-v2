import { z } from "zod";
import { SelectOption } from "../common/fields/FormSelectField";
import { OrganisationListType } from "@/app/api/type/organisation";
import {
  UserListType,
  UserOrganisationType,
  UserTier,
} from "@/app/api/type/user";

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
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const createUserFormDefaults: CreateUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  defaultTeamId: "",
  tierId: "",
  organisationIds: [],
};

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

export const isUserActive = (user: UserListType): boolean =>
  user.isActive && user.active === "active";

export const getUserOrgShortNames = (
  user: UserListType,
): UserOrganisationType[] => user.organisations ?? [];

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

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      (statusFilter === "active" && isUserActive(user)) ||
      (statusFilter === "inactive" && !isUserActive(user));

    return matchesSearch && matchesOrg && matchesTier && matchesStatus;
  });
};
