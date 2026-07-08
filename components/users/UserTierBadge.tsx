import { UserTier } from "@/app/api/type/user";

const ShieldIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

type UserTierBadgeProps = {
  tier: UserTier;
};

export const UserTierBadge = ({ tier }: UserTierBadgeProps) => {
  if (tier === "super_admin") {
    return (
      <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-[5px] text-[11px] font-bold whitespace-nowrap bg-primary text-primary-foreground border-0">
        <ShieldIcon />
        Super Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-[5px] text-[11px] font-bold whitespace-nowrap bg-muted text-muted-foreground border border-border">
      Standard
    </span>
  );
};
