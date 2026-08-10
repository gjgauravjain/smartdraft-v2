import { OrgMemberType } from "@/app/api/type/org-admin";
import { OrgMemberMobileCard } from "./OrgMemberMobileCard";

type OrgAdminMobileListProps = {
  members: OrgMemberType[];
  orgName: string;
  currentUserId?: number;
  isUpdating: boolean;
  onMakeAdmin: (member: OrgMemberType) => void;
  onRevokeAdmin: (member: OrgMemberType) => void;
  onRemove: (member: OrgMemberType) => void;
};

function EmptyState() {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      No members match your search.
    </div>
  );
}

export const OrgAdminMobileList = ({
  members,
  orgName,
  currentUserId,
  isUpdating,
  onMakeAdmin,
  onRevokeAdmin,
  onRemove,
}: OrgAdminMobileListProps) => {
  if (members.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-[11px] h-[calc(100vh-216px)] pb-30 overflow-y-auto">
      {members.map((member) => (
        <OrgMemberMobileCard
          key={member.userId}
          member={member}
          orgName={orgName}
          isOwnRow={member.userId === currentUserId}
          isUpdating={isUpdating}
          onMakeAdmin={onMakeAdmin}
          onRevokeAdmin={onRevokeAdmin}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
