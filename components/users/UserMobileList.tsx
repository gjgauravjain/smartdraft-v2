import { UserListType } from "@/app/api/type/user";
import { UserMobileCard } from "./UserMobileCard";

type UsersMobileListProps = {
  users: UserListType[];
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
  onRowClick,
}: UsersMobileListProps) => {
  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {users.map((user) => (
        <UserMobileCard key={user.id} user={user} onClick={onRowClick} />
      ))}
    </div>
  );
};
