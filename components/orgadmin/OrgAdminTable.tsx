import { TeamType } from "@/app/api/type/common";
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

type OrgAdminTableProps = {
  members: OrgMemberType[];
  orgName: string;
  teams: TeamType[];
  currentUserId?: number;
  isUpdating: boolean;
  onMakeAdmin: (member: OrgMemberType) => void;
  onRevokeAdmin: (member: OrgMemberType) => void;
  onRemove: (member: OrgMemberType) => void;
};

const getTeamShortName = (teams: TeamType[], teamId: number) =>
  teams.find((team) => team.id.toString() === teamId.toString())?.shortName ??
  "";

export const OrgAdminTable = ({
  members,
  orgName,
  teams,
  currentUserId,
  isUpdating,
  onMakeAdmin,
  onRevokeAdmin,
  onRemove,
}: OrgAdminTableProps) => (
  <div className="sd-table-wrap">
    <table className="sd-table table-fixed">
      <thead>
        <tr>
          <th className="w-[28%]">Member</th>
          <th className="w-[28%]">Email</th>
          <th className="w-[14%]">Role on {orgName}</th>
          <th className="w-[13%]">State</th>
          <th className="w-[13%]">Member Since</th>
          <th className="w-[4%]" />
        </tr>
      </thead>
      <tbody>
        {members.length === 0 ? (
          <tr className="sd-table-empty">
            <td colSpan={6} className="py-10 text-center text-[12.5px]">
              No members match your filters.
            </td>
          </tr>
        ) : (
          members.map((member) => {
            const memberState = getMemberState(member);
            const isActiveMember = memberState === "active";

            return (
              <tr key={member.userId} className="cursor-default">
                <td>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <OrgMemberAvatar member={member} />
                    <span className="min-w-0">
                      <span
                        className={[
                          "block text-[13px] font-semibold truncate",
                          isActiveMember
                            ? "text-foreground"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {getMemberFullName(member)}
                      </span>
                      <span className="block text-[10.5px] text-text4 mt-px">
                        {getTeamShortName(teams, member.teamId)}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="truncate text-[12.5px]">{member.email}</td>
                <td>
                  <OrgMemberRoleBadge member={member} />
                </td>
                <td>
                  <OrgMemberStateBadge state={memberState} />
                </td>
                <td className="text-[12px] text-muted-foreground">
                  {formatMemberJoinedDate(member.memberSince)}
                </td>
                <td className="text-right relative overflow-visible">
                  <OrgMemberActions
                    member={member}
                    orgName={orgName}
                    isOwnRow={member.userId === currentUserId}
                    isUpdating={isUpdating}
                    onMakeAdmin={onMakeAdmin}
                    onRevokeAdmin={onRevokeAdmin}
                    onRemove={onRemove}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);
