import { OrganisationType, UserDetailsType } from "@/app/api/type/common";

export const ORGANISATION_ADMIN_ROLE = "ORGANISATION_ADMIN";

export function resolveOrganisationId(
  currentOrganisation: string,
  organisations: OrganisationType[],
): string {
  if (currentOrganisation) {
    return currentOrganisation;
  }

  return organisations[0]?.organisationId.toString() ?? "";
}

export function isOrgAdminForOrg(
  user: UserDetailsType | null,
  orgId: string,
): boolean {
  if (!user || !orgId) {
    return false;
  }

  const org = user.organisations.find(
    (item) => item.organisationId.toString() === orgId.toString(),
  );

  return (
    user.isSuperuser || (org?.roles.includes(ORGANISATION_ADMIN_ROLE) ?? false)
  );
}

export function getOrganisationTitle(
  organisations: OrganisationType[],
  orgId: string,
): string {
  return (
    organisations.find(
      (org) => org.organisationId.toString() === orgId.toString(),
    )?.organisationTitle ?? ""
  );
}
