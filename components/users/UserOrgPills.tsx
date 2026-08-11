import { Shield } from "lucide-react";
import { UserOrganisationType } from "@/app/api/type/user";
import {
  VISIBLE_ORG_CHIP_COUNT,
  formatOrgChipTooltip,
  isOrganisationAdmin,
} from "./util";

type UserOrgPillsProps = {
  organisations: UserOrganisationType[];
};

export const UserOrgPills = ({ organisations }: UserOrgPillsProps) => {
  if (organisations.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const visibleOrgs = organisations.slice(0, VISIBLE_ORG_CHIP_COUNT);
  const overflowCount = organisations.length - visibleOrgs.length;
  const fullTooltip = organisations.map(formatOrgChipTooltip).join(" · ");

  return (
    <div
      title={fullTooltip}
      className="flex gap-[5px] items-center flex-nowrap min-w-0 max-w-[320px] p-2"
    >
      {visibleOrgs.map((org) => {
        const isAdmin = isOrganisationAdmin(org);

        return (
          <span
            key={org.organisationId}
            title={
              isAdmin
                ? `${org.organisationTitle} — org admin`
                : org.organisationTitle
            }
            className={[
              "inline-flex items-center gap-1 max-w-[150px] px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-[0.2px] whitespace-nowrap overflow-hidden text-ellipsis",
              isAdmin
                ? "bg-primary/10 border border-primary/20 text-primary"
                : "bg-muted border border-border text-table-row-text",
            ].join(" ")}
          >
            {isAdmin && <Shield className="h-[9px] w-[9px] shrink-0" strokeWidth={1.8} />}
            <span className="truncate">{org.organisationTitle}</span>
          </span>
        );
      })}

      {overflowCount > 0 && (
        <span
          title={fullTooltip}
          className="inline-flex items-center gap-1 max-w-[150px] px-2 py-0.5 rounded-full bg-muted border border-border text-[10.5px] font-semibold text-table-row-text tracking-[0.2px] whitespace-nowrap"
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
};
