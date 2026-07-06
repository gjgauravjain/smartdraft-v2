import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { ProjectDropdown } from "./dashboard-sub-header/ProjectDropdown";
import { TalentOrderDropdown } from "./dashboard-sub-header/TalentOrderDropdown";
import { useStore } from "@/store/useStore";
import { useGetProjects } from "@/app/api/react-query/projects";
import { useGetTalentOrder } from "@/app/api/react-query/player";
import { DashboardSubHeader } from "./DashboardSubHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const AppSelectionSettings = () => {
  const {
    selectedProject,
    setSelectedProject,
    selectedTalentOrder,
    setSelectedTalentOrder,
  } = useStore();
  const isMobile = useIsMobile();
  const { data: projects } = useGetProjects();
  const { data: talentOrder } = useGetTalentOrder();
  const talentOrderOptions = useMemo(() => {
    return (
      talentOrder?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })) || []
    );
  }, [talentOrder]);

  const handleProjectChange = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };
  if (isMobile) {
    return (
      <DashboardSubHeader
        projects={projects}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        talentOrderOptions={talentOrderOptions}
        onTalentOrderChange={setSelectedTalentOrder}
        talentOrder={selectedTalentOrder ?? undefined}
      />
    );
  }
  return (
    <div className={cn("flex shrink-0 gap-2 px-3 py-2")}>
      <ProjectDropdown
        value={selectedProject?.id}
        onChange={handleProjectChange}
        projects={projects}
        onNewProject={() => {}}
      />
      <TalentOrderDropdown
        value={selectedTalentOrder?.toString()}
        onChange={(talentOrder) => setSelectedTalentOrder(talentOrder)}
        options={talentOrderOptions}
      />
    </div>
  );
};

export default AppSelectionSettings;
