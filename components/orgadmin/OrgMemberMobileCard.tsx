import { OrgMemberType } from "@/app/api/type/org-admin";
import { OrgMemberActions } from "./OrgMemberActions";
import { OrgMemberAvatar } from "./OrgMemberAvatar";
import { OrgMemberRoleBadge } from "./OrgMemberRoleBadge";
import { OrgMemberStateBadge } from "./OrgMemberStateBadge";
import {
  formatMemberJoinedDate,
  getMemberFullName,
  getMemberState,
} from "./util";

type OrgMemberMobileCardProps = {
  member: OrgMemberType;
  orgName: string;
  isOwnRow: boolean;
  isUpdating: boolean;
  onMakeAdmin: (member: OrgMemberType) => void;
  onRevokeAdmin: (member: OrgMemberType) => void;
  onRemove: (member: OrgMemberType) => void;
};

export const OrgMemberMobileCard = ({
  member,
  orgName,
  isOwnRow,
  isUpdating,
  onMakeAdmin,
  onRevokeAdmin,
  onRemove,
}: OrgMemberMobileCardProps) => {
  const memberState = getMemberState(member);
  const isActiveMember = memberState === "active";

  return (
    <div className="bg-card border border-border rounded-xl p-[13px]">
      <div className="flex items-center gap-[11px]">
        <OrgMemberAvatar member={member} size={38} />

        <div className="flex-1 min-w-0">
          <div
            className={[
              "text-[14px] font-bold truncate",
              isActiveMember ? "text-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {getMemberFullName(member)}
          </div>
          <div className="text-[11.5px] text-muted-foreground truncate">
            {member.email}
          </div>
        </div>

        <OrgMemberActions
          member={member}
          orgName={orgName}
          isOwnRow={isOwnRow}
          isUpdating={isUpdating}
          onMakeAdmin={onMakeAdmin}
          onRevokeAdmin={onRevokeAdmin}
          onRemove={onRemove}
        />
      </div>

      <div className="flex items-center gap-[7px] mt-[11px] pt-[11px] border-t border-table-row-border">
        <OrgMemberRoleBadge member={member} showShield />
        <OrgMemberStateBadge state={memberState} />
        <span className="flex-1" />
        <span className="text-[10.5px] text-text4 whitespace-nowrap">
          Joined {formatMemberJoinedDate(member.memberSince)}
        </span>
      </div>
    </div>
  );
};
