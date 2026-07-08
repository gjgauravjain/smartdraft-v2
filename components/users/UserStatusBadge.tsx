type UserStatusBadgeProps = {
  active: boolean;
  size?: "sm" | "md";
};

export const UserStatusBadge = ({
  active,
  size = "md",
}: UserStatusBadgeProps) => {
  const textCls = size === "sm" ? "text-[11px]" : "text-[12px]";
  const dotCls = size === "sm" ? "w-1.5 h-1.5" : "w-[7px] h-[7px]";

  if (active) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 ${textCls} font-semibold text-success`}
      >
        <span className={`${dotCls} rounded-full bg-success`} />
        Active
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${textCls} font-semibold text-muted-foreground`}
    >
      <span className={`${dotCls} rounded-full bg-muted-foreground/50`} />
      Inactive
    </span>
  );
};
