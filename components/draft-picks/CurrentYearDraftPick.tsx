import { useState } from "react";
import { DraftYearType } from "@/app/api/type/draftpicks";
import { DraftYearPickBoard } from "@/components/draft-picks/DraftYearPickBoard";
import { useStore } from "@/store/useStore";
import TalentOrder from "./talent-order/TalentOrder";
import { useGetPlayerList } from "@/app/api/react-query/player";
import { TALENT_ORDER_RAIL_WIDTH, TALENT_ORDER_WIDTH } from "./util";

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
  const { user, hoveredTeamId, currentOrganisation } = useStore();
  const { data: players } = useGetPlayerList({ orgId: currentOrganisation });
  const [isTalentOrderCollapsed, setIsTalentOrderCollapsed] = useState(false);

  const reservedRight = isTalentOrderCollapsed
    ? TALENT_ORDER_RAIL_WIDTH
    : TALENT_ORDER_WIDTH + TALENT_ORDER_RAIL_WIDTH;

  return (
    <div className="flex gap-4">
      <div
        className="flex-1 min-w-0 transition-[padding] duration-200"
        style={{ paddingRight: reservedRight }}
      >
        <DraftYearPickBoard
          data={data}
          selectedTeamId={selectedTeamId}
          showAll={showAll}
          userTeamId={user?.teamId}
          hoveredTeamId={hoveredTeamId}
        />
      </div>
      <TalentOrder
        players={players || []}
        isCollapsed={isTalentOrderCollapsed}
        topOffset={151}
        onToggleCollapse={() => setIsTalentOrderCollapsed((prev) => !prev)}
      />
    </div>
  );
};

export default CurrentYearDraftPick;
