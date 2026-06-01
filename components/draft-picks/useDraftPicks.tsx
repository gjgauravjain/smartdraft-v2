import { useState } from "react";
import { useGetTeams } from "@/app/api/react-query/common";
import { userGetDraftPicks } from "@/app/api/react-query/draftpicks";
import { useStore } from "@/store/useStore";

export const useDraftPicks = () => {
  const { data } = useGetTeams();
  const { selectedProject } = useStore();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const [compensation, setCompensation] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [isAll, setIsAll] = useState(false);
  const { data: draftPicksData } = userGetDraftPicks({
    projectId: Number(selectedProject?.id),
    compensationEnabled: compensation,
  });

  return {
    teams: data || [],
    selectedTeam,
    setSelectedTeam,
    compensation,
    setCompensation,
    activeTab,
    setActiveTab,
    isAll,
    setIsAll,
    draftPicksData,
  };
};
