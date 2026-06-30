import { z } from "zod";
import { SelectOption } from "../common/fields/FormSelectField";
import { OrganisationListType } from "@/app/api/type/organisation";

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
