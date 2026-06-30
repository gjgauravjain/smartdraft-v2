"use client";

import { getInitials } from "@/lib/utils";
import { AddOrganisationButton } from "./AddOrganisationButton";
import { OrgLinkRow } from "./OrgLinkRow";
import { OrganisationListType } from "@/app/api/type/organisation";

type LinkedOrganisationsSectionProps = {
  linkedOrgs: OrganisationListType[];
  availableOrgs: OrganisationListType[];
  onAdd: (orgId: string) => void;
  onRemove: (orgId: string) => void;
};

export function LinkedOrganisationsSection({
  linkedOrgs,
  availableOrgs,
  onAdd,
  onRemove,
}: LinkedOrganisationsSectionProps) {
  return (
    <div>
      <div className="mb-2 flex items-center">
        <span className="text-[11.5px] font-bold text-foreground">
          Link to organisations
        </span>
        <span className="ml-[7px] text-[10.5px] text-muted-foreground">
          One user can belong to multiple orgs
        </span>
      </div>

      {linkedOrgs.length > 0 && (
        <div className="overflow-hidden rounded-[9px] border border-border bg-card">
          {linkedOrgs.map((org, index) => (
            <OrgLinkRow
              key={org.id}
              label={org.name}
              shortCode={org.sportingCode?.code ?? getInitials(org.name)}
              isLast={index === linkedOrgs.length - 1}
              onRemove={() => onRemove(org.id)}
            />
          ))}
        </div>
      )}

      <AddOrganisationButton options={availableOrgs} onSelect={onAdd} />
    </div>
  );
}
