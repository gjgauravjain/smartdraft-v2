import { DraftPicksTabs } from "./DraftsPickTab";
import { DraftPicksToolbar } from "./DraftPickToolbar";
import CurrentYearDraftPick from "./CurrentYearDraftPick";
import NextYearDraftPick from "./NextYearDraftPick";
import { useDraftPicks } from "./useDraftPicks";
import { draftTabOption } from "./util";
import { MobileTeamBadge } from "./MobileTeamBadge";
import OrderOfEntry from "./OrderOfEntry";

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
      {activeTab === "order" && (
        <OrderOfEntry
          teamsList={teams}
          highlightTeamId={selectedTeam}
          data={draftPicksData?.orderOfEntryData || []}
        />
      )}
    </div>
  );
};

export default DraftPicks;
