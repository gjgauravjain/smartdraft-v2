import { DraftPicksTabs } from "./DraftsPickTab";
import { DraftPicksToolbar } from "./DraftPickToolbar";
import CurrentYearDraftPick from "./CurrentYearDraftPick";
import { useDraftPicks } from "./useDraftPicks";
import { draftTabOption } from "./util";

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

      {/* Row 2 – tabs */}
      <DraftPicksTabs
        tabs={[...(draftPicksData?.draftTab || []), ...draftTabOption]}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "current" && (
        <CurrentYearDraftPick
          data={draftData?.draftCurrentYear}
          selectedTeamId={selectedTeam}
          showAll={isAll}
        />
      )}
    </div>
  );
};

export default DraftPicks;
