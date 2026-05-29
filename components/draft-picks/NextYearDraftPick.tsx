import { DraftYearType } from "@/app/api/type/draftpicks";
import { DraftYearPickBoard } from "@/components/draft-picks/DraftYearPickBoard";
import { useStore } from "@/store/useStore";

interface NextYearDraftPickProps {
  data?: DraftYearType;
  selectedTeamId?: string;
  showAll?: boolean;
}

const NextYearDraftPick = ({
  data,
  selectedTeamId,
  showAll,
}: NextYearDraftPickProps) => {
  const { user, hoveredTeamId } = useStore();

  return (
    <DraftYearPickBoard
      data={data}
      selectedTeamId={selectedTeamId}
      showAll={showAll}
      userTeamId={user?.teamId}
      hoveredTeamId={hoveredTeamId}
      visibleRoundIds={["rd1List", "rd2List", "rd3List", "rd4List", "rd5List"]}
      defaultCollapsedRoundIds={["rd5List"]}
    />
  );
};

export default NextYearDraftPick;
