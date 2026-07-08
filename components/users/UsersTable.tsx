import { UserListType } from "@/app/api/type/user";
import {
  getUserFullName,
  getUserTier,
  getUserOrgShortNames,
  isUserActive,
} from "./util";
import { UserAvatar } from "./UserAvatar";
import { UserTierBadge } from "./UserTierBadge";
import { UserOrgPills } from "./UserOrgPills";
import { UserStatusBadge } from "./UserStatusBadge";
import SdTable, { SdColumnDef } from "../common/SdTable";
import { DotsIcon } from "../common/icons";

type UsersTableProps = {
  users: UserListType[];
  onRowClick: (user: UserListType) => void;
  onMenuClick: (e: React.MouseEvent, user: UserListType) => void;
};

export const UsersTable = ({
  users,
  onRowClick,
  onMenuClick,
}: UsersTableProps) => {
  const columns: SdColumnDef<UserListType>[] = [
    {
      key: "name",
      label: "User",
      width: "2fr",
      sortable: true,
      sortValue: (row) => getUserFullName(row),
      render: (user) => (
        <button
          onClick={() => onRowClick(user)}
          className="flex items-center gap-2.5 px-0 py-3 w-full text-left"
        >
          <UserAvatar user={user} />
          <div className="min-w-0">
            <div
              className={[
                "text-[13px] font-semibold truncate",
                isUserActive(user)
                  ? "text-foreground"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              {getUserFullName(user)}
            </div>
            <div className="text-[11.5px] text-muted-foreground truncate">
              {user.email}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: "tier",
      label: "Tier",
      width: "1fr",
      sortable: true,
      sortValue: (row) => (row.isSuperuser ? "super_admin" : "standard"),
      render: (user) => <UserTierBadge tier={getUserTier(user)} />,
    },
    {
      key: "organisations",
      label: "Organisations",
      width: "1.8fr",
      render: (user) => (
        <UserOrgPills shortNames={getUserOrgShortNames(user)} />
      ),
    },
    {
      key: "active",
      label: "Active",
      width: "1fr",
      sortable: true,
      sortValue: (row) => (isUserActive(row) ? 1 : 0),
      render: (user) => <UserStatusBadge active={isUserActive(user)} />,
    },
    {
      key: "actions",
      label: "",
      width: "40px",
      align: "right",
      render: (user) => (
        <button
          onClick={(e) => onMenuClick(e, user)}
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors inline-flex p-1 rounded cursor-pointer"
        >
          <DotsIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="h-[calc(100vh-220px)]">
      <SdTable
        data={users}
        columns={columns}
        rowKey={(user) => user.id}
        defaultSortKey="name"
        defaultSortDir="asc"
      />
    </div>
  );
};
