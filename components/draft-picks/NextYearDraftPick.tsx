import { useGetPlayerListByTalentOrder } from "@/app/api/react-query/player";
import { DraftYearType } from "@/app/api/type/draftpicks";
import { DraftYearPickBoard } from "@/components/draft-picks/DraftYearPickBoard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import {
  TALENT_ORDER_RAIL_WIDTH,
  TALENT_ORDER_TABS,
  TALENT_ORDER_WIDTH,
} from "./util";
import { MobileTabs } from "../common/MobileTabs";
import TalentOrder from "./talent-order/TalentOrder";

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
  const [activeTab, setActiveTab] = useState("picks");
  const { user, hoveredTeamId, selectedTalentOrder } = useStore();
  const { data: players } = useGetPlayerListByTalentOrder({
    talentOrder: selectedTalentOrder || "",
  });
  const [isTalentOrderCollapsed, setIsTalentOrderCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const reservedRight = isTalentOrderCollapsed
    ? TALENT_ORDER_RAIL_WIDTH
    : TALENT_ORDER_WIDTH + TALENT_ORDER_RAIL_WIDTH;

  const renderView = () => {
    if (!isMobile) {
      return (
        <div className="flex gap-4">
          <div
            className="flex-1 min-w-0 transition-[padding] duration-200"
            style={{ paddingRight: isMobile ? 0 : reservedRight }}
          >
            <DraftYearPickBoard
              data={data}
              selectedTeamId={selectedTeamId}
              showAll={showAll}
              userTeamId={user?.teamId}
              hoveredTeamId={hoveredTeamId}
              visibleRoundIds={[
                "rd1List",
                "rd2List",
                "rd3List",
                "rd4List",
                "rd5List",
              ]}
              defaultCollapsedRoundIds={["rd5List"]}
            />
          </div>
          {!isMobile && (
            <TalentOrder
              players={players || []}
              isCollapsed={isTalentOrderCollapsed}
              topOffset={151}
              onToggleCollapse={() =>
                setIsTalentOrderCollapsed((prev) => !prev)
              }
            />
          )}
        </div>
      );
    }
    if (activeTab === "talent") {
      return (
        <div>
          <TalentOrder
            players={players || []}
            isCollapsed={isTalentOrderCollapsed}
          />
        </div>
      );
    }
    return (
      <div className="flex gap-4">
        <div
          className="flex-1 min-w-0 transition-[padding] duration-200"
          style={{ paddingRight: isMobile ? 0 : reservedRight }}
        >
          <DraftYearPickBoard
            data={data}
            selectedTeamId={selectedTeamId}
            showAll={showAll}
            userTeamId={user?.teamId}
            hoveredTeamId={hoveredTeamId}
            visibleRoundIds={[
              "rd1List",
              "rd2List",
              "rd3List",
              "rd4List",
              "rd5List",
            ]}
            defaultCollapsedRoundIds={["rd5List"]}
          />
        </div>
      </div>
    );
  };
  return (
    <div>
      {isMobile && (
        <MobileTabs
          tabs={TALENT_ORDER_TABS}
          value={activeTab}
          onChange={setActiveTab}
        />
      )}
      {renderView()}
    </div>
  );
};

export default NextYearDraftPick;
