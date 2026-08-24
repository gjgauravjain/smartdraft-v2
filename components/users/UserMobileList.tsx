import { UserListType } from "@/app/api/type/user";
import { UserMobileCard } from "./UserMobileCard";
import { TeamOption } from "./util";

type UsersMobileListProps = {
  users: UserListType[];
  teams: TeamOption[];
  onRowClick: (user: UserListType) => void;
};

function EmptyState() {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      No users found.
    </div>
  );
}

export const UsersMobileList = ({
  users,
  teams,
  onRowClick,
}: UsersMobileListProps) => {
  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {users.map((user) => (
        <UserMobileCard
          key={user.id}
          user={user}
          teams={teams}
          onClick={onRowClick}
        />
      ))}
    </div>
  );
};
