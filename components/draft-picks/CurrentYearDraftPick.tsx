import { DraftYearType } from "@/app/api/type/draftpicks";
import { DraftYearPickBoard } from "@/components/draft-picks/DraftYearPickBoard";
import { useStore } from "@/store/useStore";

interface CurrentYearDraftPickProps {
  data?: DraftYearType;
  selectedTeamId?: string;
  showAll?: boolean;
}

const CurrentYearDraftPick = ({
  data,
  selectedTeamId,
  showAll,
}: CurrentYearDraftPickProps) => {
  const { user, hoveredTeamId } = useStore();

  return (
    <DraftYearPickBoard
      data={data}
      selectedTeamId={selectedTeamId}
      showAll={showAll}
      userTeamId={user?.teamId}
      hoveredTeamId={hoveredTeamId}
    />
  );
};

export default CurrentYearDraftPick;
