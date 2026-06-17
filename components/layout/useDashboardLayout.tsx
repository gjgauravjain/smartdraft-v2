import { useGetProjects } from "@/app/api/react-query/projects";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

export const useDashboardLayout = () => {
  const { data: projects } = useGetProjects();
  const pathname = window.location.pathname;
  const {
    isSideBarOpen,
    setIsSideBarOpen,
    selectedProject,
    setSelectedProject,
  } = useStore();
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
  };
};
