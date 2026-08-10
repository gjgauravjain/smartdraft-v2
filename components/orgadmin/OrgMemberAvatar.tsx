import { OrgMemberType } from "@/app/api/type/org-admin";
import { getInitials } from "@/lib/utils";
import { getMemberFullName, getMemberState } from "./util";

type OrgMemberAvatarProps = {
  member: OrgMemberType;
  size?: 30 | 38 | 40;
};

export const OrgMemberAvatar = ({
  member,
  size = 30,
}: OrgMemberAvatarProps) => {
  const active = getMemberState(member) === "active";
  const initials = getInitials(getMemberFullName(member));
  const sizeCls =
    size === 40
      ? "w-10 h-10 text-[15.2px]"
      : size === 38
        ? "w-[38px] h-[38px] text-[14.4px]"
        : "w-[30px] h-[30px] text-[11.4px]";

  return (
    <div
      className={[
        sizeCls,
        "rounded-full shrink-0 flex items-center justify-center font-bold",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {initials}
    </div>
  );
};
