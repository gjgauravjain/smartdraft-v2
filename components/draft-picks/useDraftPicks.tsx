import { useGetTeams } from "@/app/api/react-query/common";
import { useState } from "react";
import { DEFAULT_DRAFT_TABS } from "./DraftsPickTab";

export const useDraftPicks = () => {
  const { data } = useGetTeams();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const [compensation, setCompensation] = useState(true);
  const [activeTab, setActiveTab] = useState(DEFAULT_DRAFT_TABS[0].id);
  const [isAll, setIsAll] = useState(false);
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
  };
};
