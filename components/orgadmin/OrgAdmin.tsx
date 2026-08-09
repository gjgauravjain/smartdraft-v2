"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { useIsMobile } from "@/hooks/use-mobile";
import { UsersTableSkeleton } from "@/components/users/UsersTableSkeleton";
import { OrgAdminHeader } from "./OrgAdminHeader";
import { OrgAdminMobileHeader } from "./OrgAdminMobileHeader";
import { OrgAdminMobileList } from "./OrgAdminMobileList";
import { OrgAdminMobileSearch } from "./OrgAdminMobileSearch";
import { OrgAdminMobileSkeleton } from "./OrgAdminMobileSkeleton";
import { OrgAdminStatsRow } from "./OrgAdminStatsRow";
import { OrgAdminTable } from "./OrgAdminTable";
import { OrgAdminToolbar } from "./OrgAdminToolbar";
import { useOrgAdmin } from "./hook";

const OrgAdmin = () => {
  const isMobile = useIsMobile();
  const {
    orgName,
    members,
    allMembers,
    teams,
    filters,
    stats,
    isLoading,
    error,
    isOrgAdmin,
    isUpdating,
    currentUserId,
    refetch,
    setSearch,
    setRoleFilter,
    setStateFilter,
    handleMakeAdmin,
    handleRevokeAdmin,
    handleRemove,
  } = useOrgAdmin();

  if (!isOrgAdmin) {
    return null;
  }

  if (isMobile) {
    if (isLoading) {
      return (
        <>
          <OrgAdminMobileHeader orgName={orgName} />
          <div className="flex-1 overflow-auto min-h-0 pb-[70px]">
            <div className="p-3.5">
              <OrgAdminMobileSkeleton />
            </div>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <>
          <OrgAdminMobileHeader orgName={orgName} />
          <div className="flex-1 overflow-auto min-h-0 pb-[70px] p-3.5">
            <ErrorState message={error.message} onRetry={refetch} />
          </div>
        </>
      );
    }

    return (
      <>
        <OrgAdminMobileHeader orgName={orgName} />
        <div className="flex-1 overflow-auto min-h-0 pb-[70px]">
          <div className="p-3.5 flex flex-col gap-[11px]">
            <OrgAdminStatsRow
              totalMembers={stats.totalMembers}
              orgAdminCount={stats.orgAdminCount}
              pendingCount={stats.pendingCount}
            />
            <OrgAdminMobileSearch
              value={filters.search}
              onChange={setSearch}
            />
            <OrgAdminMobileList
              members={members}
              orgName={orgName}
              currentUserId={currentUserId}
              isUpdating={isUpdating}
              onMakeAdmin={handleMakeAdmin}
              onRevokeAdmin={handleRevokeAdmin}
              onRemove={handleRemove}
            />
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <OrgAdminHeader
          orgName={orgName}
          totalMembers={0}
          activeCount={0}
          pendingCount={0}
        />
        <div className="flex-1 overflow-auto bg-background p-[22px]">
          <UsersTableSkeleton rows={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <OrgAdminHeader
          orgName={orgName}
          totalMembers={0}
          activeCount={0}
          pendingCount={0}
        />
        <div className="flex-1 overflow-auto bg-background p-[22px]">
          <ErrorState message={error.message} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <OrgAdminHeader
        orgName={orgName}
        totalMembers={stats.totalMembers}
        activeCount={stats.activeCount}
        pendingCount={stats.pendingCount}
      />
      <div className="flex-1 overflow-auto bg-background p-[22px]">
        <OrgAdminToolbar
          filters={filters}
          filteredCount={members.length}
          totalCount={allMembers.length}
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onStateFilterChange={setStateFilter}
        />
        <OrgAdminTable
          members={members}
          orgName={orgName}
          teams={teams}
          currentUserId={currentUserId}
          isUpdating={isUpdating}
          onMakeAdmin={handleMakeAdmin}
          onRevokeAdmin={handleRevokeAdmin}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default OrgAdmin;
