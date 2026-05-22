import { useStore } from '@/store/useStore';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

export function useDashboardWizard() {
  const { user } = useAuth0();
  const { 
    currentProject, 
    setCurrentProject,
    isSideBarOpen,
    setIsSideBarOpen 
  } = useStore();

  const [projectInput, setProjectInput] = useState('');

  const handleGenerateProject = () => {
    const newProject = `project-${Date.now()}`;
    setCurrentProject(newProject);
  };

  const handleUpdateProject = (value: string) => {
    setProjectInput(value);
    if (value) {
      setCurrentProject(value);
    }
  };

  const handleToggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return {
    user,
    currentProject,
    isSideBarOpen,
    projectInput,
    setProjectInput,
    handleGenerateProject,
    handleUpdateProject,
    handleToggleSidebar,
  };
}
