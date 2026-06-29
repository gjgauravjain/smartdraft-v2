import { useGetTalentOrder } from "@/app/api/react-query/player";
import { useGetProjects } from "@/app/api/react-query/projects";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/store/useStore";
import { useEffect, useMemo, useState } from "react";

export const useDashboardLayout = () => {
  const { data: projects } = useGetProjects();
  const pathname = window.location.pathname;
  const {
    isSideBarOpen,
    setIsSideBarOpen,
    selectedProject,
    setSelectedProject,
  } = useStore();
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

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  const hideSubHeader =
    ["/", "/projects"].includes(pathname) ||
    pathname.startsWith("/organisations");
  return {
    projects,
    isSideBarOpen,
    setIsSideBarOpen,
    selectedProject,
    setSelectedProject,
    isMobile,
    hideSubHeader,
    selectedTalentOrder,
    setSelectedTalentOrder,
    talentOrderOptions,
  };
};
