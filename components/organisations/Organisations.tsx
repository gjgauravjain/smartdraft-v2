"use client";

import { AddUpdateOrganisationModal } from "./AddUpdateOrganisationModal";
import { OrgEmptyState } from "./OrgEmptyState";
import { OrgErrorState } from "./OrgErrorState";
import { OrgPageHeader } from "./OrgPageHeader";
import { OrgStatsRow } from "./OrgStatsRow";
import { OrgTable } from "./OrgTable";
import { OrgTableSkeleton } from "./OrgTableSkeleton";
import { useOrganisations } from "./hook";

const Organisations = () => {
  const {
    organisations,
    totalUsers,
    loading,
    error,
    handleManageUsers,
    handleNewOrganisation,
    handleRowClick,
    handleMenuClick,
    refetch,
    openAddModal,
    setOpenAddModal,
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
          totalUsers={totalUsers}
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

      <div className="overflow-auto h-[calc(100vh-100px)] bg-background p-5">
        {renderView()}
      </div>
      <AddUpdateOrganisationModal
        onOpenChange={() => {
          setOpenAddModal((prev) => !prev);
        }}
        open={openAddModal}
      />
    </div>
  );
};

export default Organisations;
