import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

// Types
export interface IFlagList {
  id: string;
  teamName: string;
  shortName: string;
  image: string;
  listSpotsAvailaible: number;
}

export type UploadCsvTransactionType = {
  transactionType: string;
  payload: Record<string, any>;
};

export type UserOrganisationType = {
  organisationId: number;
  organisationTitle: string;
  organisationSportingCode: string;
  organisationDefaultTeamId: string;
  organisationDefaultTeamName: string;
  organisationDefaultTeamShortName: string;
  created: string;
  updated: string;
  invitationAccepted: string;
  roles: string;
};

export type User = {
  userId: number | null;
  username: string;
  teamId: number | null;
  email: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  uui: string;
  groups: string[];
  auth0Id: string;
  organisation: UserOrganisationType[];
}
interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

interface AppState {
  currentProject: string;
  currentOrganisation: string;
  selectedFlag: string;
  hoveredTeamId: string;
  selectedTransactionModal: string;
  uploadCsvTransactionTypeModal: UploadCsvTransactionType | null;
  isSideBarOpen: boolean;
  flagList: IFlagList[];
  refreshFlagData: string;
  setCurrentProject: (projectId: string) => void;
  setCurrentOrganisation: (orgId: string) => void;
  setSelectedFlag: (flagId: string) => void;
  setHoveredTeamId: (teamId: string) => void;
  setSelectedTransactionModal: (modalId: string) => void;
  setUploadCsvTransactionTypeModal: (type: UploadCsvTransactionType | null) => void;
  setIsSideBarOpen: (isOpen: boolean) => void;
  setFlagList: (flags: IFlagList[]) => void;
  setRefreshFlag: (value: string) => void;
}

type Store = AuthState & AppState;

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Auth State
      accessToken: null,
      user: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, user: null }),

      // App State
      currentProject: '',
      currentOrganisation: '',
      selectedFlag: '',
      hoveredTeamId: '',
      selectedTransactionModal: '',
      uploadCsvTransactionTypeModal: null,
      isSideBarOpen: true,
      flagList: [],
      refreshFlagData: '',

      // App Actions
      setCurrentProject: (projectId) => set({ currentProject: projectId }),
      setCurrentOrganisation: (orgId) => set({ currentOrganisation: orgId }),
      setSelectedFlag: (flagId) => set({ selectedFlag: flagId }),
      setHoveredTeamId: (teamId) => set({ hoveredTeamId: teamId }),
      setSelectedTransactionModal: (modalId) => set({ selectedTransactionModal: modalId }),
      setUploadCsvTransactionTypeModal: (type) => set({ uploadCsvTransactionTypeModal: type }),
      setIsSideBarOpen: (isOpen) => set({ isSideBarOpen: isOpen }),
      setFlagList: (flags) => set({ 
        flagList: flags, 
        refreshFlagData: Math.random().toString() 
      }),
      setRefreshFlag: (value) => set({ refreshFlagData: value }),
    }),
    {
      name: 'gtx-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Persist all state
    }
  )
);

// Selector hooks for better performance
export const useAuth = () => useStore(
  useShallow((state) => ({
    accessToken: state.accessToken,
    user: state.user,
    setAccessToken: state.setAccessToken,
    setUser: state.setUser,
    clearAuth: state.clearAuth,
  }))
);

export const useAppState = () => useStore(
  useShallow((state) => ({
    currentProject: state.currentProject,
    currentOrganisation: state.currentOrganisation,
    selectedFlag: state.selectedFlag,
    hoveredTeamId: state.hoveredTeamId,
    selectedTransactionModal: state.selectedTransactionModal,
    uploadCsvTransactionTypeModal: state.uploadCsvTransactionTypeModal,
    isSideBarOpen: state.isSideBarOpen,
    flagList: state.flagList,
    refreshFlagData: state.refreshFlagData,
    setCurrentProject: state.setCurrentProject,
    setCurrentOrganisation: state.setCurrentOrganisation,
    setSelectedFlag: state.setSelectedFlag,
    setHoveredTeamId: state.setHoveredTeamId,
    setSelectedTransactionModal: state.setSelectedTransactionModal,
    setUploadCsvTransactionTypeModal: state.setUploadCsvTransactionTypeModal,
    setIsSideBarOpen: state.setIsSideBarOpen,
    setFlagList: state.setFlagList,
    setRefreshFlag: state.setRefreshFlag,
  }))
);
