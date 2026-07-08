"use client";

import { useUsersList } from "./hook";
import { UsersToolbar } from "./UsersToolbar";
import { UsersTable } from "./UsersTable";
import { UsersTableSkeleton } from "./UsersTableSkeleton";
import { ErrorState } from "../common/ErrorState";
import { UsersPageHeader } from "./UserPageHeader";
import { CreateUserModal } from "./CreateUserModal";
import { TIER_OPTIONS } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileSearch } from "./MobileSearch";
import { UsersMobileList } from "./UserMobileList";
import UserMobileHeader from "./UserMobileHeader";

const UsersList = () => {
  const {
    users,
    isLoading,
    error,
    filters,
    setSearch,
    setOrgFilter,
    setTierFilter,
    setStatusFilter,
    handleRowClick,
    handleMenuClick,
    refetch,
    createUserOpen,
    setCreateUserOpen,
    teamOptions,
    organisations,
  } = useUsersList();

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-muted p-5">
          <UsersTableSkeleton rows={6} />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-muted p-5">
          <ErrorState message={error.message} onRetry={refetch ?? (() => {})} />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <UserMobileHeader onAddUser={() => setCreateUserOpen(true)} />
        <div className="p-2.5">
          <MobileSearch value={filters.search} onChange={setSearch} />
          <div className="border-b border-border h-[calc(100vh-170px)] pb-[70px] overflow-auto">
            <UsersMobileList users={users} onRowClick={handleRowClick} />
          </div>
          <CreateUserModal
            open={createUserOpen}
            onOpenChange={setCreateUserOpen}
            teams={teamOptions}
            tiers={TIER_OPTIONS}
            organisations={organisations}
          />
        </div>
      </>
    );
  }
  return (
    <div>
      <UsersPageHeader
        totalUsers={users.length}
        superAdminCount={users.filter((user) => !user.isStaff).length}
        onCreateUser={() => setCreateUserOpen(true)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-muted p-5">
          <UsersToolbar
            filters={filters}
            organisations={organisations}
            onSearchChange={setSearch}
            onOrgFilterChange={setOrgFilter}
            onTierFilterChange={setTierFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <UsersTable
            users={users}
            onRowClick={handleRowClick}
            onMenuClick={handleMenuClick}
          />
          <CreateUserModal
            open={createUserOpen}
            onOpenChange={setCreateUserOpen}
            teams={teamOptions}
            tiers={TIER_OPTIONS}
            organisations={organisations}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersList;
