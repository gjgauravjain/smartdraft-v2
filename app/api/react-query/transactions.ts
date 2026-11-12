import {
  createFatherSonBidApi,
  createManualPickEditApi,
  createMovePickApi,
  createPassPickApiUrl,
  createPriorityPickApi,
  createPriorityPickScenarioApiUrl,
  createTradeApiUrl,
  fetchTradeImpactApiUrl,
  getPriorityPickTypeApiUrl,
  getTransactionsSum,
  passPickImpactApiUrl,
  priorityPickScenarioImpactApiUrl,
  transactionPriorityPick,
} from "@/lib/api-constant";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/store/useStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  buildPassPickRequestPayload,
  transformPassPickImpactResponse,
} from "../util/pass-pick";
import { ManualPickEditReason } from "../type/manual-pick-edit";
import { MovePickPosition } from "../type/move-pick";
import { PassPickPassType } from "../type/pass-pick";
import {
  TradeCommitResult,
  TradeImpactResponse,
  TradeRequestPayload,
} from "../type/trade";
import { buildManualPickEditRequestPayload } from "../util/manual-pick-edit";
import { buildMovePickRequestPayload } from "../util/move-pick";
import { transformFatherSonBidImpactResponse } from "../util/transaction";
import { transformTradeImpactResponse } from "../util/trade";
import {
  PriorityPickPreviewResult,
  PriorityPickRequest,
  PriorityPickScope,
} from "../type/priority-pick";
import {
  previewErrorFromUnknown,
  transformPriorityPickImpact,
  transformPriorityPickTypes,
} from "../util/priority-pick";

type GetFatherSonBidImpactParams = {
  projectId: number;
  fsTeamId: string;
  playerId: string;
  pickId: string;
};

export const useGetFatherSonBidImpact = ({
  projectId,
  fsTeamId,
  playerId,
  pickId,
}: GetFatherSonBidImpactParams) => {
  const { accessToken } = useAuth();

  const readyToFetch = Boolean(projectId && fsTeamId && playerId && pickId);

  return useQuery({
    queryKey: ["father-son-bid-impact", projectId, fsTeamId, playerId, pickId],

    queryFn: async () => {
      const { data } = await apiClient.post(getTransactionsSum(projectId), {
        fs_team: fsTeamId,
        pickid: pickId,
        playerid: playerId,
      });

      return transformFatherSonBidImpactResponse(data);
    },

    enabled: !!accessToken && readyToFetch,
    retry: 0,
  });
};

type SubmitFatherSonBidParams = {
  projectId: number;
  fsTeamId: string;
  playerId: string;
  pickId: string;
};

export const useSubmitFatherSonBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      fsTeamId,
      playerId,
      pickId,
    }: SubmitFatherSonBidParams) => {
      const { data } = await apiClient.post(
        createFatherSonBidApi(String(projectId)),
        {
          fs_team: fsTeamId,
          pickid: pickId,
          playerid: playerId,
        },
      );
      return data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["draft-picks", variables.projectId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["all-draft-picks", variables.projectId],
      });
    },
  });
};

type GetPassPickImpactParams = {
  projectId: number;
  pickId: string;
  passType: PassPickPassType;
  enabled?: boolean;
};

export const useGetPassPickImpact = ({
  projectId,
  pickId,
  passType,
  enabled = true,
}: GetPassPickImpactParams) => {
  const { accessToken } = useAuth();
  const readyToFetch = Boolean(projectId && pickId && passType);

  return useQuery({
    queryKey: ["pass-pick-impact", projectId, pickId, passType],
    queryFn: async () => {
      const { data } = await apiClient.post(
        passPickImpactApiUrl(String(projectId)),
        buildPassPickRequestPayload({ pickId, passType }),
      );

      return transformPassPickImpactResponse(data);
    },
    enabled: !!accessToken && readyToFetch && enabled,
    retry: 0,
  });
};

export const useCreatePassPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      pickId,
      passType,
    }: {
      projectId: number;
      pickId: string;
      passType: PassPickPassType;
    }) => {
      const { data } = await apiClient.post(
        createPassPickApiUrl(String(projectId)),
        buildPassPickRequestPayload({ pickId, passType }),
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
      queryClient.invalidateQueries({
        queryKey: ["pass-pick-impact", variables.projectId],
      });
    },
  });
};

export const useCreateManualPickEdit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      pickLabel,
      uniquePick,
      newOwnerId,
      viaOwnerId,
      reason,
    }: {
      projectId: number;
      pickLabel: string;
      uniquePick: string;
      newOwnerId: string;
      viaOwnerId?: string;
      reason: ManualPickEditReason;
    }) => {
      const { data } = await apiClient.post(
        createManualPickEditApi(String(projectId)),
        buildManualPickEditRequestPayload({
          pickLabel,
          uniquePick,
          newOwnerId,
          viaOwnerId,
          reason,
        }),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
    },
  });
};

export const useCreateMovePick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      pick,
      destinationPick,
      position,
      reason,
    }: {
      projectId: number;
      pick: string;
      destinationPick: string;
      position: MovePickPosition;
      reason: string;
    }) => {
      const { data } = await apiClient.post(
        createMovePickApi(String(projectId)),
        buildMovePickRequestPayload({
          pick,
          destinationPick,
          position,
          reason,
        }),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
    },
  });
};

type GetTradeImpactParams = {
  projectId: number;
  payload: TradeRequestPayload | null;
  enabled?: boolean;
};

export const useGetTradeImpact = ({
  projectId,
  payload,
  enabled = true,
}: GetTradeImpactParams) => {
  const { accessToken } = useAuth();
  const requestSeq = useRef(0);
  const [data, setData] = useState<TradeImpactResponse | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isFetching, setIsFetching] = useState(false);

  const readyToFetch = Boolean(
    accessToken && enabled && projectId && payload?.teams.length,
  );
  const payloadKey = payload ? JSON.stringify(payload) : "";

  useEffect(() => {
    const seq = ++requestSeq.current;

    if (!readyToFetch || !payload) {
      setData(null);
      setError(null);
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();
    setData(null);
    setError(null);
    setIsFetching(true);

    const run = async () => {
      try {
        const { data: response } = await apiClient.post(
          fetchTradeImpactApiUrl(String(projectId)),
          payload,
          { signal: controller.signal },
        );
        if (seq !== requestSeq.current) return;
        setData(transformTradeImpactResponse(response));
      } catch (err) {
        if (seq !== requestSeq.current) return;
        if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
          return;
        }
        if (axios.isAxiosError(err) && err.response?.status === 400) {
          setData(transformTradeImpactResponse(err.response.data));
          setError(null);
          return;
        }
        setData(null);
        setError(err);
      } finally {
        if (seq === requestSeq.current) {
          setIsFetching(false);
        }
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [payloadKey, projectId, readyToFetch]);

  return { data, error, isFetching };
};

export const useCreateTrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: number;
      payload: TradeRequestPayload;
    }): Promise<TradeCommitResult> => {
      try {
        const { data } = await apiClient.post(
          createTradeApiUrl(String(projectId)),
          payload,
        );
        return {
          kind: "success",
          transactionDescription: data?.transaction_description ?? "",
        };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          return {
            kind: "blocked",
            impact: transformTradeImpactResponse(error.response.data),
          };
        }
        throw error;
      }
    },
    onSuccess: (result) => {
      if (result.kind !== "success") return;
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
    },
  });
};

const priorityPickImpactUrl = ({
  projectId,
  scenarioId,
  transactionNo,
}: PriorityPickScope) => {
  if (scenarioId && transactionNo) {
    return priorityPickScenarioImpactApiUrl(
      String(projectId),
      scenarioId,
      transactionNo,
    );
  }
  return transactionPriorityPick(String(projectId));
};

const priorityPickSaveUrl = ({
  projectId,
  scenarioId,
  transactionNo,
}: PriorityPickScope) => {
  if (scenarioId && transactionNo) {
    return createPriorityPickScenarioApiUrl(
      String(projectId),
      scenarioId,
      transactionNo,
    );
  }
  return createPriorityPickApi(String(projectId));
};

export const useGetPriorityPickTypes = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["priority-pick-types"],
    queryFn: async () => {
      const { data } = await apiClient.get(getPriorityPickTypeApiUrl());
      return transformPriorityPickTypes(data);
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useGetPriorityPickImpact = ({
  scope,
  payload,
  enabled = true,
}: {
  scope: PriorityPickScope;
  payload: PriorityPickRequest | null;
  enabled?: boolean;
}) => {
  const { accessToken } = useAuth();
  const url = priorityPickImpactUrl(scope);
  const payloadKey = payload ? JSON.stringify(payload) : "";

  const query = useQuery({
    queryKey: ["priority-pick-impact", url, payloadKey],
    queryFn: async (): Promise<PriorityPickPreviewResult> => {
      if (!payload) {
        return previewErrorFromUnknown(new Error("Missing priority pick payload"));
      }
      try {
        const { data } = await apiClient.post(url, payload);
        return { kind: "success", impact: transformPriorityPickImpact(data) };
      } catch (error) {
        return previewErrorFromUnknown(error);
      }
    },
    enabled: !!accessToken && enabled && !!payload,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const preview = payload && enabled ? (query.data ?? null) : null;

  return {
    preview,
    isFetching: Boolean(payload) && enabled && query.isFetching,
  };
};

export const useCreatePriorityPick = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scope,
      payload,
    }: {
      scope: PriorityPickScope;
      payload: PriorityPickRequest;
    }) => {
      const { data } = await apiClient.post(priorityPickSaveUrl(scope), payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftpicks"] });
      queryClient.invalidateQueries({ queryKey: ["scenario-picks-list"] });
      queryClient.invalidateQueries({ queryKey: ["priority-pick-impact"] });
    },
  });
};
