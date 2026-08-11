import { UserListType } from "@/app/api/type/user";
import {
  formatOrgChipTooltip,
  getUserOrganisations,
} from "@/components/users/util";

export const formatUserOrgSummary = (user: UserListType) => {
  const orgs = getUserOrganisations(user);
  if (orgs.length === 0) {
    return "No organisations";
  }

  return orgs.map(formatOrgChipTooltip).join(", ");
};
