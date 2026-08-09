import { Shield } from "lucide-react";
import { OrgMemberType } from "@/app/api/type/org-admin";
import { isOrgAdminMember } from "./util";

type OrgMemberRoleBadgeProps = {
  member: OrgMemberType;
  showShield?: boolean;
};

export const OrgMemberRoleBadge = ({
  member,
  showShield = false,
}: OrgMemberRoleBadgeProps) => {
  const isAdmin = isOrgAdminMember(member);

  if (isAdmin) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap bg-primary-light text-primary border border-primary/20">
        {showShield && <Shield className="h-2.5 w-2.5" strokeWidth={1.8} />}
        Org admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold whitespace-nowrap bg-secondary text-muted-foreground border border-border">
      Member
    </span>
  );
};
