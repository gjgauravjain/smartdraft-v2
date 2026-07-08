import { UserListType } from "@/app/api/type/user";
import { getUserInitials, isUserActive } from "./util";

type UserAvatarProps = {
  user: UserListType;
  size?: 32 | 38;
};

export const UserAvatar = ({ user, size = 32 }: UserAvatarProps) => {
  const active = isUserActive(user);
  const initials = getUserInitials(user);

  const sizeCls =
    size === 38 ? "w-[38px] h-[38px] text-[12px]" : "w-8 h-8 text-[12px]";

  const colorCls = active
    ? "bg-primary text-primary-foreground"
    : "bg-muted text-muted-foreground";

  return (
    <div
      className={`${sizeCls} ${colorCls} rounded-full shrink-0 flex items-center justify-center font-bold`}
    >
      {initials}
    </div>
  );
};
