type UserStatusBadgeProps = {
  active: boolean;
};

export const UserStatusBadge = ({ active }: UserStatusBadgeProps) => {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-success">
        <span className="w-[7px] h-[7px] rounded-full bg-success" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
      <span className="w-[7px] h-[7px] rounded-full bg-muted-foreground/50" />
      Inactive
    </span>
  );
};
