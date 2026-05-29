import { DraftPicksTabs } from "./DraftsPickTab";
import { DraftPicksToolbar } from "./DraftPickToolbar";
import { useDraftPicks } from "./useDraftPicks";

const DraftPicks = () => {
  const {activeTab, selectedTeam, teams, setSelectedTeam, compensation, setCompensation, setActiveTab, isAll, setIsAll} = useDraftPicks()
  return (
    <div className="w-full border-b border-white/10">
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
        activeTabId={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default DraftPicks;
