import { GoOrganization } from "react-icons/go";
import { OrganisationListType } from "@/app/api/type/organisation";
import { StatCard } from "./StatCard";
import { ChevronRightIcon } from "lucide-react";

type OrgStatsRowProps = {
  organisations: OrganisationListType[];
  totalUsers: number;
  onManageUsers: () => void;
};

export const OrgStatsRow = ({
  organisations,
  totalUsers,
  onManageUsers,
}: OrgStatsRowProps) => (
  <div className="grid grid-cols-2 gap-2.5 md:gap-3 mb-4 md:mb-5">
    <StatCard
      label="Organisations"
      value={organisations.length}
      subLabel="on the platform"
      icon={<GoOrganization size={14} />}
    />
    <StatCard
      label="Users"
      value={totalUsers}
      subLabel="Manage users →"
      subLabelHighlight
      icon={<ChevronRightIcon size={14} />}
      onClick={onManageUsers}
    />
  </div>
);
