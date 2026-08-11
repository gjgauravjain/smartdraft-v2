"use client";

import { getInitials } from "@/lib/utils";
import { AddOrganisationButton } from "./AddOrganisationButton";
import { OrgLinkRow } from "./OrgLinkRow";
import { OrganisationListType } from "@/app/api/type/organisation";
import { normalizeOrgId, orgIdsMatch } from "./util";

type LinkedOrganisationsSectionProps = {
  linkedOrgs: OrganisationListType[];
  organisations: OrganisationListType[];
  organisationAdminIds: string[];
  onAdd: (orgId: string | number) => void;
  onRemove: (orgId: string | number) => void;
  onToggleOrgAdmin: (orgId: string | number, isOrgAdmin: boolean) => void;
};

export function LinkedOrganisationsSection({
  linkedOrgs,
  organisations,
  organisationAdminIds,
  onAdd,
  onRemove,
  onToggleOrgAdmin,
}: LinkedOrganisationsSectionProps) {
  return (
    <div>
      <div className="mb-2 flex items-center">
        <span className="text-[11.5px] font-bold text-foreground">
          Link to organisations
        </span>
        <span className="ml-[7px] text-[10.5px] text-muted-foreground">
          One user can belong to multiple orgs · org admin is set per org
        </span>
      </div>

      {linkedOrgs.length > 0 && (
        <div className="overflow-hidden rounded-[9px] border border-border bg-card">
          {linkedOrgs.map((org, index) => {
            const orgId = normalizeOrgId(org.id);
            const isOrgAdmin = organisationAdminIds.some((id) =>
              orgIdsMatch(id, orgId),
            );

            return (
              <OrgLinkRow
                key={org.id}
                label={org.name}
                shortCode={org.sportingCode?.code ?? getInitials(org.name)}
                isOrgAdmin={isOrgAdmin}
                onOrgAdminChange={(next) => onToggleOrgAdmin(orgId, next)}
                isLast={index === linkedOrgs.length - 1}
                onRemove={() => onRemove(orgId)}
              />
            );
          })}
        </div>
      )}

      <AddOrganisationButton
        organisations={organisations}
        linkedOrgIds={linkedOrgs.map((org) => normalizeOrgId(org.id))}
        onSelect={onAdd}
      />
    </div>
  );
}
