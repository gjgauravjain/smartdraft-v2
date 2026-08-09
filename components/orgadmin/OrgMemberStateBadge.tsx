import { OrgMemberState } from "@/app/api/type/org-admin";

type OrgMemberStateBadgeProps = {
  state: OrgMemberState;
};

const stateStyles: Record<
  OrgMemberState,
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
    dot: "bg-muted-foreground",
    label: "Inactive",
  },
  pending: {
    container:
      "bg-[rgb(251,242,223)] text-[rgb(138,100,32)] border-[rgb(238,223,188)] dark:bg-[rgba(210,165,92,0.15)] dark:text-[rgb(232,201,135)] dark:border-[rgba(210,165,92,0.36)]",
    dot: "bg-[rgb(138,100,32)] dark:bg-[rgb(232,201,135)]",
    label: "Pending",
  },
};

export const OrgMemberStateBadge = ({ state }: OrgMemberStateBadgeProps) => {
  const styles = stateStyles[state];

  return (
    <span
      title={
        state === "pending"
          ? "Invited — no access until they set a password and log in"
          : undefined
      }
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap border",
        styles.container,
      ].join(" ")}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  );
};
