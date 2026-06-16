import { ChevronRight } from "lucide-react";
import { OrganisationListType } from "@/app/api/type/organisation";
import { getInitials } from "@/lib/utils";

type OrgMobileListProps = {
  organisations: OrganisationListType[];
  onRowClick: (org: OrganisationListType) => void;
};

export const OrgMobileList = ({
  organisations,
  onRowClick,
}: OrgMobileListProps) => (
  <div className="flex flex-col gap-3">
    {organisations.length === 0 ? (
      <p className="text-center text-sm text-muted-foreground py-8">
        No organisations match your search.
      </p>
    ) : (
      organisations.map((org) => (
        <button
          key={org.id}
          onClick={() => onRowClick(org)}
          className="w-full bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 text-left active:opacity-70 transition-opacity cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-[42px] h-[42px] rounded-[10px] bg-muted border border-border flex items-center justify-center flex-shrink-0 text-foreground font-bold text-[16px] tracking-[0.3px]">
            {getInitials(org.name)}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-bold text-foreground truncate">
              {org.name}
            </p>
            <p className="text-[11.5px] text-muted-foreground mt-[3px] truncate">
              {org.defaultTeam.name} · 0 members
            </p>
          </div>

          <ChevronRight
            size={18}
            strokeWidth={1.8}
            className="text-muted-foreground flex-shrink-0"
          />
        </button>
      ))
    )}
  </div>
);
