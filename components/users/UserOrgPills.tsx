import { UserOrganisationType } from "@/app/api/type/user";

type UserOrgPillsProps = {
  shortNames: UserOrganisationType[];
};

export const UserOrgPills = ({ shortNames }: UserOrgPillsProps) => {
  if (shortNames.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex gap-[5px] flex-wrap max-w-[320px] p-2">
      {shortNames.map((name) => (
        <span
          key={name.organisationId}
          className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted border border-border text-[10.5px] font-bold text-table-row-text tracking-[0.2px]"
        >
          {name.organisationDefaultTeamShortName}
        </span>
      ))}
    </div>
  );
};
