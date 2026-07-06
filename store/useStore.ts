import { TeamType, UserDetailsType } from "@/app/api/type/common";
import { ProjectType } from "@/app/api/type/projects";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

export type UploadCsvTransactionType = {
  transactionType: string;
  payload: Record<string, any>;
};

interface AuthState {
  accessToken: string | null;
  user: UserDetailsType | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserDetailsType | null) => void;
  clearAuth: () => void;
}

interface AppState {
  currentProject: string;
  currentOrganisation: string;
  selectedFlag: string;
  hoveredTeamId: string | null;
  selectedTransactionModal: string;
  uploadCsvTransactionTypeModal: UploadCsvTransactionType | null;
  isSideBarOpen: boolean;
  selectedTeam: TeamType | null;
  setCurrentProject: (projectId: string) => void;
  setCurrentOrganisation: (orgId: string) => void;
  setSelectedFlag: (flagId: string) => void;
  setHoveredTeamId: (teamId: string | null) => void;
  setSelectedTransactionModal: (modalId: string) => void;
  setUploadCsvTransactionTypeModal: (
    type: UploadCsvTransactionType | null,
  ) => void;
  setIsSideBarOpen: (isOpen: boolean) => void;
  setSelectedTeam: (team: TeamType | null) => void;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
  selectedTalentOrder: string | null;
  setSelectedTalentOrder: (talentOrder: string | null) => void;
}

type Store = AuthState & AppState;

export const useStore = create<Store>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          currentProject: "",
          currentOrganisation: "",
          selectedFlag: "",
          hoveredTeamId: null,
          selectedTransactionModal: "",
          uploadCsvTransactionTypeModal: null,
          isSideBarOpen: true,
          selectedTeam: null,
          selectedProject: null,
          selectedTalentOrder: "",
        }),

      // App State
      currentProject: "",
      currentOrganisation: "",
      selectedFlag: "",
      hoveredTeamId: "",
      selectedTransactionModal: "",
      uploadCsvTransactionTypeModal: null,
      isSideBarOpen: true,
      selectedTeam: null,
      selectedProject: null,
      selectedTalentOrder: "",
      // App Actions
      setCurrentProject: (projectId) => set({ currentProject: projectId }),
      setCurrentOrganisation: (orgId) => set({ currentOrganisation: orgId }),
      setSelectedFlag: (flagId) => set({ selectedFlag: flagId }),
      setHoveredTeamId: (teamId) => set({ hoveredTeamId: teamId }),
      setSelectedTransactionModal: (modalId) =>
        set({ selectedTransactionModal: modalId }),
      setUploadCsvTransactionTypeModal: (type) =>
        set({ uploadCsvTransactionTypeModal: type }),
      setIsSideBarOpen: (isOpen) => set({ isSideBarOpen: isOpen }),
      setSelectedTeam: (team) => set({ selectedTeam: team }),
      setSelectedProject: (project) => set({ selectedProject: project }),
      setSelectedTalentOrder: (talentOrder) =>
        set({ selectedTalentOrder: talentOrder }),
    }),
    {
      name: "gtx-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Selector hooks for better performance
export const useAuth = () =>
  useStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      user: state.user,
      setAccessToken: state.setAccessToken,
      setUser: state.setUser,
      clearAuth: state.clearAuth,
    })),
  );

export const useAppState = () =>
  useStore(
    useShallow((state) => ({
      currentProject: state.currentProject,
      currentOrganisation: state.currentOrganisation,
      selectedFlag: state.selectedFlag,
      hoveredTeamId: state.hoveredTeamId,
      selectedTransactionModal: state.selectedTransactionModal,
      uploadCsvTransactionTypeModal: state.uploadCsvTransactionTypeModal,
      isSideBarOpen: state.isSideBarOpen,
      selectedTeam: state.selectedTeam,
      selectedTalentOrder: state.selectedTalentOrder,
      setCurrentProject: state.setCurrentProject,
      setCurrentOrganisation: state.setCurrentOrganisation,
      setSelectedFlag: state.setSelectedFlag,
      setHoveredTeamId: state.setHoveredTeamId,
      setSelectedTransactionModal: state.setSelectedTransactionModal,
      setUploadCsvTransactionTypeModal: state.setUploadCsvTransactionTypeModal,
      setIsSideBarOpen: state.setIsSideBarOpen,
      setSelectedTeam: state.setSelectedTeam,
      selectedProject: state.selectedProject,
      setSelectedProject: state.setSelectedProject,
    })),
  );
