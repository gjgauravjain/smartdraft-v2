import {
  getUserFullName,
  getUserTier,
  getUserOrganisations,
  getUserActiveStatus,
  getPendingOrgCount,
  isUserActive,
} from "./util";
import { UserAvatar } from "./UserAvatar";
import { UserOrgPills } from "./UserOrgPills";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserListType } from "@/app/api/type/user";
import { ShieldIcon } from "lucide-react";
import { TeamOption } from "./util";

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
  teams: TeamOption[];
  onClick: (user: UserListType) => void;
};

export const UserMobileCard = ({
  user,
  teams,
  onClick,
}: UserMobileCardProps) => {
  const active = isUserActive(user);
  const tier = getUserTier(user);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-3.5 pb-1 transition-colors hover:bg-muted/40">
      <div className="mb-2 flex justify-end"></div>

      <button
        type="button"
        onClick={() => onClick(user)}
        className="w-full text-left"
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
          <UserRowActions user={user} teams={teams} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-[11px] pt-[11px] border-t border-border/60">
          <UserOrgPills organisations={getUserOrganisations(user)} />
          <span className="flex-1" />
          <UserStatusBadge
            status={getUserActiveStatus(user)}
            pendingOrgCount={getPendingOrgCount(user)}
            size="sm"
          />
        </div>
      </button>
    </div>
  );
};
