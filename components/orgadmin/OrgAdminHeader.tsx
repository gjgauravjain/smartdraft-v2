type OrgAdminHeaderProps = {
  orgName: string;
  totalMembers: number;
  activeCount: number;
  pendingCount: number;
};

export const OrgAdminHeader = ({
  orgName,
  totalMembers,
  activeCount,
  pendingCount,
}: OrgAdminHeaderProps) => (
  <div className="bg-card border-b border-border px-[22px] py-[13px] flex items-center gap-3 shrink-0">
    <div className="min-w-0">
      <h1 className="text-[17px] font-bold text-foreground tracking-[-0.2px]">
        Org Admin
      </h1>
      <p className="text-[11.5px] text-muted-foreground mt-px">
        {orgName} · {totalMembers} member{totalMembers !== 1 ? "s" : ""} ·{" "}
        {activeCount} active · {pendingCount} pending
      </p>
    </div>
    <span className="flex-1" />
    <span className="text-[11.5px] text-muted-foreground">
      New members are added by your Smart Draft administrator.
    </span>
  </div>
);
