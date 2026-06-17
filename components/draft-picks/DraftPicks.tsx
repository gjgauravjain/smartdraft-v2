import { DraftPicksTabs } from "./DraftsPickTab";
import { DraftPicksToolbar } from "./DraftPickToolbar";
import CurrentYearDraftPick from "./CurrentYearDraftPick";
import NextYearDraftPick from "./NextYearDraftPick";
import { useDraftPicks } from "./useDraftPicks";
import { draftTabOption } from "./util";
import { MobileTeamBadge } from "./MobileTeamBadge";
import OrderOfEntry from "./OrderOfEntry";
import { MobileApplyCompensation } from "./MobileApplyCompensation";
import MobileOrderEntry from "./MobileOrderEntry";
import FullListView from "./fulllist/FullListView";
import FullListMobileView from "./fulllist/FullListMobileView";
import DraftAssetsChart from "./draft-assets/DraftAssetsChart";
import DraftAssetsMobileList from "./draft-assets/DraftAssetMobileList";

const DraftPicks = () => {
  const {
    activeTab,
    selectedTeam,
    teams,
    setSelectedTeam,
    compensation,
    setCompensation,
    setActiveTab,
    isAll,
    setIsAll,
    draftPicksData,
    isMobile,
  } = useDraftPicks();
  const draftData = draftPicksData?.draftData;

  const renderOrderEntry = () => {
    if (isMobile) {
      return (
        <MobileOrderEntry
          teamsList={teams}
          highlightTeamId={selectedTeam}
          data={draftPicksData?.orderOfEntryData || []}
        />
      );
    }
    return (
      <OrderOfEntry
        teamsList={teams}
        highlightTeamId={selectedTeam}
        data={draftPicksData?.orderOfEntryData || []}
      />
    );
  };

  const renderFullListEntry = () => {
    if (isMobile) {
      return (
        <FullListMobileView
          teams={teams}
          highlightTeamId={selectedTeam}
          data={draftData?.fullOrderList || []}
        />
      );
    }
    return (
      <FullListView
        teams={teams}
        highlightTeamId={selectedTeam}
        data={draftData?.fullOrderList || []}
      />
    );
  };

  const renderDraftAssets = () => {
    if (isMobile) {
      return (
        <DraftAssetsMobileList
          data={draftData?.draftAsset || []}
          teams={teams}
          highlightOwnerName={
            teams.find(
              (item) => item.id.toString() === selectedTeam?.toString(),
            )?.shortName
          }
        />
      );
    }
    return (
      <DraftAssetsChart
        data={draftData?.draftAsset || []}
        teams={teams}
        highlightOwnerName={
          teams.find((item) => item.id.toString() === selectedTeam?.toString())
            ?.shortName
        }
      />
    );
  };
  return (
    <div className="w-full border-b border-border">
      {/* Row 1 – toolbar */}
      <DraftPicksToolbar
        teams={teams}
        selectedTeamId={selectedTeam}
        onTeamSelect={setSelectedTeam}
        applyCompensation={compensation}
        onApplyCompensation={setCompensation}
        isAll={isAll}
        onToggleAll={setIsAll}
      />

      <DraftPicksTabs
        tabs={[...(draftPicksData?.draftTab || []), ...draftTabOption]}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
      />
      {isMobile && (
        <MobileTeamBadge
          isAll={isAll}
          teams={teams}
          selectedTeamId={selectedTeam}
          onToggleAll={setIsAll}
          onTeamSelect={setSelectedTeam}
        />
      )}
      {isMobile && (
        <MobileApplyCompensation
          checked={compensation}
          onCheckedChange={setCompensation}
        />
      )}
      {activeTab === "current" && (
        <CurrentYearDraftPick
          data={draftData?.draftCurrentYear}
          selectedTeamId={selectedTeam}
          showAll={isAll}
        />
      )}
      {activeTab === "next" && (
        <NextYearDraftPick
          data={draftData?.draftNextYear}
          selectedTeamId={selectedTeam}
          showAll={isAll}
        />
      )}
      {activeTab === "order" && renderOrderEntry()}
      {activeTab === "fulllist" && renderFullListEntry()}
      {activeTab === "draftAssets" && renderDraftAssets()}
    </div>
  );
};

export default DraftPicks;
