"use client";

import { OrgEmptyState } from "./OrgEmptyState";
import { OrgErrorState } from "./OrgErrorState";
import { OrgPageHeader } from "./OrgPageHeader";
import { OrgStatsRow } from "./OrgStatsRow";
import { OrgTable } from "./OrgTable";
import { OrgTableSkeleton } from "./OrgTableSkeleton";
import { useOrganisations } from "./useOrganisations";

const Organisations = () => {
  const {
    organisations,
    loading,
    error,
    handleManageUsers,
    handleNewOrganisation,
    handleRowClick,
    handleMenuClick,
    refetch,
  } = useOrganisations();

  const renderView = () => {
    if (loading) {
      return <OrgTableSkeleton rows={6} />;
    }

    if (error) {
      return <OrgErrorState message={error} onRetry={refetch} />;
    }

    if (organisations.length === 0) {
      return <OrgEmptyState onCreateFirst={handleNewOrganisation} />;
    }
    return (
      <>
        <OrgStatsRow
          organisations={organisations}
          totalUsers={0}
          newSignups={0}
          onManageUsers={handleManageUsers}
        />
        <OrgTable
          organisations={organisations}
          onRowClick={handleRowClick}
          onMenuClick={handleMenuClick}
        />
      </>
    );
  };
  return (
    <div className="">
      <OrgPageHeader
        onManageUsers={handleManageUsers}
        onNewOrganisation={handleNewOrganisation}
        isLoading={loading}
      />

      <div className="overflow-auto h-[calc(100vh-140px)] bg-background p-5">
        {renderView()}
      </div>
    </div>
  );
};

export default Organisations;
