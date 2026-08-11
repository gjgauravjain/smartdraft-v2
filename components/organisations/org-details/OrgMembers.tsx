import { Link2Off, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrgMemberActions } from "@/components/orgadmin/OrgMemberActions";
import { OrgMemberRoleBadge } from "@/components/orgadmin/OrgMemberRoleBadge";
import { OrgMemberStateBadge } from "@/components/orgadmin/OrgMemberStateBadge";
import {
  getMemberFullName,
  getMemberState,
} from "@/components/orgadmin/util";
import { UserTierBadge } from "@/components/users/UserTierBadge";

type OrgMembersListProps = {
  membersList: OrgMemberType[];
  orgName: string;
  currentUserId?: number;
  isUpdating?: boolean;
  onAddUser?: () => void;
  onMakeAdmin?: (member: OrgMemberType) => void;
  onRevokeAdmin?: (member: OrgMemberType) => void;
  onRemoveMember?: (member: OrgMemberType) => void;
};

function EmptyMembers({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted mb-3">
        <UserPlus className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-[13.5px] font-semibold text-foreground">
        No members yet
      </p>
      <p className="text-[12px] text-muted-foreground mt-1">
        {isMobile
          ? "Add a user to get started."
          : "Add an existing user to link them to this organisation."}
      </p>
    </div>
  );
}

export function OrgMembersList({
  membersList,
  orgName,
  currentUserId,
  isUpdating,
  onAddUser,
  onMakeAdmin,
  onRevokeAdmin,
  onRemoveMember,
}: OrgMembersListProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <div className="mb-[9px] flex items-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-muted-foreground">
            Members
          </span>

          <div className="flex-1" />

          <Button
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-[11.5px]"
            onClick={onAddUser}
          >
            <UserPlus className="h-3 w-3" />
            Add user
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {membersList.length === 0 && <EmptyMembers isMobile />}
          {membersList.map((member, index) => {
            const fullName = getMemberFullName(member);
            const memberState = getMemberState(member);

            return (
              <div
                key={member.userId}
                className={cn(
                  "flex items-center gap-[11px] px-[14px] py-3",
                  index !== membersList.length - 1 &&
                    "border-b border-table-row-border",
                )}
              >
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
                  {getInitials(fullName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-foreground">
                    {fullName}
                  </div>
                  <div className="truncate text-[11.5px] text-muted-foreground">
                    {member.email}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <OrgMemberRoleBadge member={member} showShield />
                    <OrgMemberStateBadge state={memberState} />
                    <UserTierBadge
                      tier={member.isSuperuser ? "super_admin" : "standard"}
                    />
                  </div>
                </div>

                {onMakeAdmin && onRevokeAdmin && onRemoveMember ? (
                  <OrgMemberActions
                    member={member}
                    orgName={orgName}
                    isOwnRow={member.userId === currentUserId}
                    isUpdating={!!isUpdating}
                    onMakeAdmin={onMakeAdmin}
                    onRevokeAdmin={onRevokeAdmin}
                    onRemove={onRemoveMember}
                  />
                ) : (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onRemoveMember?.(member)}
                    className="flex text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                    title="Remove from organisation"
                  >
                    <Link2Off className="h-[15px] w-[15px]" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center border-b border-border px-[18px] py-[13px]">
        <div>
          <h3 className="text-sm font-bold text-foreground">Members</h3>

          <p className="mt-px text-[11.5px] text-muted-foreground">
            Users linked to this organisation
          </p>
        </div>

        <div className="flex-1" />

        <Button size="sm" className="gap-1.5" onClick={onAddUser}>
          <UserPlus className="h-3 w-3" />
          Add existing user
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="sd-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>State</th>
              <th>Tier</th>
              <th className="w-[60px]" />
            </tr>
          </thead>

          <tbody>
            {membersList.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyMembers isMobile={false} />
                </td>
              </tr>
            )}
            {membersList.map((member) => {
              const fullName = getMemberFullName(member);
              const memberState = getMemberState(member);

              return (
                <tr key={member.userId}>
                  <td>
                    <div className="flex items-center gap-[9px]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {getInitials(fullName)}
                      </div>

                      <span className="text-[13px] font-semibold text-foreground">
                        {fullName}
                      </span>
                    </div>
                  </td>

                  <td className="text-[12px]">{member.email}</td>

                  <td>
                    <OrgMemberRoleBadge member={member} />
                  </td>

                  <td>
                    <OrgMemberStateBadge state={memberState} />
                  </td>

                  <td>
                    <UserTierBadge
                      tier={member.isSuperuser ? "super_admin" : "standard"}
                    />
                  </td>

                  <td className="text-right relative overflow-visible">
                    {onMakeAdmin && onRevokeAdmin && onRemoveMember ? (
                      <OrgMemberActions
                        member={member}
                        orgName={orgName}
                        isOwnRow={member.userId === currentUserId}
                        isUpdating={!!isUpdating}
                        onMakeAdmin={onMakeAdmin}
                        onRevokeAdmin={onRevokeAdmin}
                        onRemove={onRemoveMember}
                      />
                    ) : (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onRemoveMember?.(member)}
                        className="inline-flex text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                        title="Remove from organisation"
                      >
                        <Link2Off className="h-[15px] w-[15px]" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
