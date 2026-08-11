import { UserActiveStatus } from "./util";

type UserStatusBadgeProps = {
  status: UserActiveStatus;
  pendingOrgCount?: number;
  size?: "sm" | "md";
};

const statusStyles: Record<
  UserActiveStatus,
  { container: string; dot: string; label: string }
> = {
  active: {
    container:
      "bg-success-surface text-success border-success-border",
    dot: "bg-success",
    label: "Active",
  },
  inactive: {
    container: "bg-secondary text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
    label: "Inactive",
  },
  pending: {
    container:
      "bg-[rgb(251,242,223)] text-[rgb(138,100,32)] border-[rgb(238,223,188)] dark:bg-[rgba(210,165,92,0.15)] dark:text-[rgb(232,201,135)] dark:border-[rgba(210,165,92,0.36)]",
    dot: "bg-[rgb(138,100,32)] dark:bg-[rgb(232,201,135)]",
    label: "Pending",
  },
};

export const UserStatusBadge = ({
  status,
  pendingOrgCount = 0,
  size = "md",
}: UserStatusBadgeProps) => {
  const styles = statusStyles[status];
  const textCls = size === "sm" ? "text-[10.5px]" : "text-[10.5px]";
  const dotCls = size === "sm" ? "w-1.5 h-1.5" : "w-1.5 h-1.5";
  const showPendingHint = status !== "pending" && pendingOrgCount > 0;

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        title={
          status === "pending"
            ? "Invited — no access until they accept every organisation invite"
            : undefined
        }
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${textCls} font-bold whitespace-nowrap border ${styles.container}`}
      >
        <span className={`${dotCls} rounded-full ${styles.dot}`} />
        {styles.label}
      </span>

      {showPendingHint && (
        <span className="text-[10.5px] text-muted-foreground whitespace-nowrap">
          {pendingOrgCount} pending org{pendingOrgCount === 1 ? "" : "s"}
        </span>
      )}
    </span>
  );
};
