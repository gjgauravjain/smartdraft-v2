// import { UserListType } from "../type";
import {
  getUserFullName,
  getUserTier,
  getUserOrgShortNames,
  isUserActive,
} from "./util";
import { UserAvatar } from "./UserAvatar";
import { UserOrgPills } from "./UserOrgPills";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserListType } from "@/app/api/type/user";
import { ShieldIcon } from "lucide-react";

const MobileTierBadge = ({ isSuperAdmin }: { isSuperAdmin: boolean }) => {
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-[5px] px-[7px] py-0.5 rounded-[5px] text-[10px] font-bold whitespace-nowrap bg-primary text-primary-foreground border-0">
        <ShieldIcon className="w-4 h-4" />
        SA
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-[7px] py-0.5 rounded-[5px] text-[10px] font-bold whitespace-nowrap bg-muted text-muted-foreground border border-border">
      U
    </span>
  );
};

type UserMobileCardProps = {
  user: UserListType;
  onClick: (user: UserListType) => void;
};

export const UserMobileCard = ({ user, onClick }: UserMobileCardProps) => {
  const active = isUserActive(user);
  const tier = getUserTier(user);

  return (
    <button
      onClick={() => onClick(user)}
      className="w-full text-left bg-card border border-border rounded-xl p-3.5 pb-1 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-center gap-[11px]">
        <UserAvatar user={user} size={38} />

        <div className="flex-1 min-w-0">
          <div
            className={[
              "text-[14px] font-bold truncate",
              active ? "text-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {getUserFullName(user)}
          </div>
          <div className="text-[11.5px] text-muted-foreground truncate">
            {user.email}
          </div>
        </div>

        <MobileTierBadge isSuperAdmin={tier === "super_admin"} />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mt-[11px] pt-[11px] border-t border-border/60">
        <UserOrgPills shortNames={getUserOrgShortNames(user)} />
        <span className="flex-1" />
        <UserStatusBadge active={active} size="sm" />
      </div>
    </button>
  );
};
