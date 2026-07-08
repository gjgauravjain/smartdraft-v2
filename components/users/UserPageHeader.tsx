import { UserPlusIcon } from "lucide-react";
import { Button } from "../ui/button";

type UsersPageHeaderProps = {
  totalUsers: number;
  superAdminCount: number;
  onCreateUser: () => void;
};

export const UsersPageHeader = ({
  totalUsers,
  superAdminCount,
  onCreateUser,
}: UsersPageHeaderProps) => (
  <div className="bg-card border-b border-border px-[12px] py-[13px] flex items-center gap-3 shrink-0">
    <div className="min-w-0">
      <h1 className="text-[17px] font-bold text-foreground tracking-[-0.2px]">
        Users
      </h1>
      <p className="text-[11.5px] text-muted-foreground mt-px">
        {totalUsers} users · {superAdminCount} super admin
        {superAdminCount !== 1 ? "s" : ""}
      </p>
    </div>
    <span className="flex-1" />

    <Button onClick={onCreateUser}>
      <UserPlusIcon />
      Create user
    </Button>
  </div>
);
