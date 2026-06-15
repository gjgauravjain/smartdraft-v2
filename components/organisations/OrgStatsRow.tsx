import { GoOrganization } from "react-icons/go";
import { OrganisationListType } from "@/app/api/type/organisation";
import { StatCard } from "./StatCard";
import { ChevronRightIcon, TrendingUpIcon } from "lucide-react";

type OrgStatsRowProps = {
  organisations: OrganisationListType[];
  totalUsers: number;
  newSignups: number;
  onManageUsers: () => void;
};

export const OrgStatsRow = ({
  organisations,
  totalUsers,
  newSignups,
  onManageUsers,
}: OrgStatsRowProps) => (
  <div className="grid grid-cols-3 gap-3 mb-5">
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
    <StatCard
      label="New sign-ups"
      value={newSignups}
      subLabel="last 7 days"
      icon={<TrendingUpIcon size={14} />}
    />
  </div>
);
