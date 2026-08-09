type OrgAdminStatsRowProps = {
  totalMembers: number;
  orgAdminCount: number;
  pendingCount: number;
};

type StatCardProps = {
  value: number;
  label: string;
};

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="flex-1 bg-card border border-border rounded-[10px] px-3 py-[11px]">
    <div className="text-[22px] font-extrabold text-foreground tracking-[-0.5px]">
      {value}
    </div>
    <div className="text-[10.5px] text-muted-foreground mt-px">{label}</div>
  </div>
);

export const OrgAdminStatsRow = ({
  totalMembers,
  orgAdminCount,
  pendingCount,
}: OrgAdminStatsRowProps) => (
  <div className="flex gap-2.5">
    <StatCard value={totalMembers} label="Members" />
    <StatCard value={orgAdminCount} label="Org admins" />
    <StatCard value={pendingCount} label="Pending" />
  </div>
);
