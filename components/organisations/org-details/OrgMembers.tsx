import { Link2Off, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { OrgMembersListType } from "@/app/api/type/organisation";
import { useIsMobile } from "@/hooks/use-mobile";

type OrgMembersListProps = {
  membersList: OrgMembersListType[];
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
export function OrgMembersList({ membersList }: OrgMembersListProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div>
        <div className="mb-[9px] flex items-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-muted-foreground">
            Members
          </span>

          <div className="flex-1" />

          <Button size="sm" className="h-8 gap-1.5 px-2.5 text-[11.5px]">
            <UserPlus className="h-3 w-3" />
            Add user
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {membersList.length === 0 && <EmptyMembers isMobile />}
          {membersList.map((member, index) => (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-[11px] px-[14px] py-3",
                index !== membersList.length - 1 &&
                  "border-b border-table-row-border",
              )}
            >
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
                {getInitials(member.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold text-foreground">
                  {member.name}
                </div>

                <div className="truncate text-[11.5px] text-muted-foreground">
                  {member.email}
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-[5px] bg-primary px-[7px] py-[2px] text-[10px] font-bold text-white">
                <Shield className="h-2.5 w-2.5" />
                {member.tier}
              </span>

              <button
                className="flex text-muted-foreground transition-colors hover:text-destructive"
                title="Remove from organisation"
              >
                <Link2Off className="h-[15px] w-[15px]" />
              </button>
            </div>
          ))}
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

        <Button size="sm" className="gap-1.5">
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
              <th>Tier</th>
              <th className="w-[60px]" />
            </tr>
          </thead>

          <tbody>
            {membersList.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyMembers isMobile={false} />
                </td>
              </tr>
            )}
            {membersList.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="flex items-center gap-[9px]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {getInitials(member.name)}
                    </div>

                    <span className="text-[13px] font-semibold text-foreground">
                      {member.name}
                    </span>
                  </div>
                </td>

                <td className="text-[12px]">{member.email}</td>

                <td>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary px-[7px] py-[2px] text-[10px] font-bold text-white">
                    <Shield className="h-2.5 w-2.5" />
                    {member.tier}
                  </span>
                </td>

                <td className="text-right">
                  <button
                    className="inline-flex text-muted-foreground transition-colors hover:text-destructive"
                    title="Remove from organisation"
                  >
                    <Link2Off className="h-[15px] w-[15px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
