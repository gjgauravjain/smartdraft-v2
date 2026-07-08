import { UserListType } from "@/app/api/type/user";
import { getUserInitials, isUserActive } from "./util";

type UserAvatarProps = {
  user: UserListType;
};

export const UserAvatar = ({ user }: UserAvatarProps) => {
  const active = isUserActive(user);
  const initials = getUserInitials(user);

  if (!active) {
    return (
      <div className="w-8 h-8 rounded-full shrink-0 bg-muted text-muted-foreground flex items-center justify-center text-[12px] font-bold">
        {initials}
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full shrink-0 bg-primary text-primary-foreground flex items-center justify-center text-[12px] font-bold">
      {initials}
    </div>
  );
};
