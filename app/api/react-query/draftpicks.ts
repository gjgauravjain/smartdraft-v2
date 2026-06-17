import apiClient from "@/lib/api-client";
import { getDashboardApiUrl } from "@/lib/api-constant";
import { useAuth } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import {
  transformDashboardData,
  transformDashboardDraftTab,
  transformDataOrderNewEntry,
  transformNewDraftPick,
} from "../util/draftpicks";

export const userGetDraftPicks = ({
  projectId,
  compensationEnabled = false,
}: {
  projectId: number;
  compensationEnabled?: boolean;
}) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["draftpicks", projectId, compensationEnabled],
    queryFn: async () => {
      const { data } = await apiClient.get(
        getDashboardApiUrl(projectId, compensationEnabled),
      );
      return {
        dashboardData: transformDashboardData(data),
        draftData: transformNewDraftPick(data),
        draftTab: transformDashboardDraftTab(data),
        orderOfEntryData: transformDataOrderNewEntry(data.order_of_entry),
      };
    },
    enabled: !!accessToken && !!projectId,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};
