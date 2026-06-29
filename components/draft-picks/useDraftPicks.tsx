import { useEffect, useMemo, useState } from "react";
import { useGetTeams } from "@/app/api/react-query/common";
import { userGetDraftPicks } from "@/app/api/react-query/draftpicks";
import { useStore } from "@/store/useStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetTalentOrder } from "@/app/api/react-query/player";
import { useGetProjects } from "@/app/api/react-query/projects";

export const useDraftPicks = () => {
  const { data } = useGetTeams();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const [compensation, setCompensation] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [isAll, setIsAll] = useState(false);
  const { selectedProject, setSelectedProject } = useStore();
  const { data: projects } = useGetProjects();
  const { data: draftPicksData } = userGetDraftPicks({
    projectId: Number(selectedProject?.id),
    compensationEnabled: compensation,
  });
  const [selectedTalentOrder, setSelectedTalentOrder] = useState<string>("");
  const { data: talentOrder } = useGetTalentOrder();
  const talentOrderOptions = useMemo(() => {
    return (
      talentOrder?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })) || []
    );
  }, [talentOrder]);

  useEffect(() => {
    if (!selectedTalentOrder && talentOrderOptions.length > 0) {
      setSelectedTalentOrder(talentOrderOptions[0].value);
    }
  }, [talentOrderOptions, selectedTalentOrder]);

  const isMobile = useIsMobile();
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
    isMobile,
    selectedProject,
    setSelectedProject,
    selectedTalentOrder,
    setSelectedTalentOrder,
    talentOrderOptions,
    projects: projects || [],
  };
};
