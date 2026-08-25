"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetTeams } from "@/app/api/react-query/common";
import { useGetPlayerList } from "@/app/api/react-query/player";
import { useStore } from "@/store/useStore";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TradeAssetSheet } from "./TradeAssetSheet";
import { TradeClubLane } from "./TradeClubLane";
import { tradePickOptions } from "./utils";
import { TradeAsset, TradeClub, TradeModalFormValues, TradeTab } from "./types";

type TradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function TradeModal({ isOpen, onClose }: TradeModalProps) {
  const isMobile = useIsMobile();
  const { currentOrganisation } = useStore();
  const { data: teams = [] } = useGetTeams();
  const { data: players = [] } = useGetPlayerList({
    orgId: currentOrganisation || "",
  });

  const form = useForm<TradeModalFormValues>({
    defaultValues: {
      clubs: teams.map((club) => ({
        id: club.id,
        teamId: club.id,
      })),
    },
  });

  const clubsForm = useWatch({ control: form.control, name: "clubs" }) ?? [];
  const [clubs, setClubs] = useState<TradeClub[]>([]);
  const [activeTab, setActiveTab] = useState<TradeTab>("picks");

  useEffect(() => {
    setClubs(
      teams
        .map((team) => ({
          id: `club-${team.id}`,
          teamId: String(team.id),
          name: team.teamNames,
          shortName: team.shortName,
          icon: team.image || "",
          picks: [],
          players: [],
        }))
        .splice(0, 2),
    );
  }, [teams]);
  useEffect(() => {
    if (!teams.length) {
      return;
    }

    setClubs((current) =>
      current.map((club, index) => {
        const selectedTeamId = clubsForm[index]?.teamId;
        const resolvedTeam =
          selectedTeamId &&
          teams.find((team) => String(team.id) === String(selectedTeamId));

        if (resolvedTeam) {
          return {
            ...club,
            teamId: String(resolvedTeam.id),
            name: resolvedTeam.teamNames,
            shortName: resolvedTeam.shortName,
            icon: resolvedTeam.image || club.icon,
          };
        }

        return {
          ...club,
          teamId: String(teams[index % teams.length]?.id ?? ""),
          name: teams[index % teams.length]?.teamNames ?? club.name,
          shortName: teams[index % teams.length]?.shortName ?? club.shortName,
          icon: teams[index % teams.length]?.image || club.icon,
        };
      }),
    );
  }, [teams, clubsForm]);

  const teamOptions = useMemo(
    () =>
      teams.map((team) => ({
        value: String(team.id),
        label: team.teamNames,
        icon: team.image,
      })),
    [teams],
  );

  const playerOptions: TradeAsset[] = useMemo(
    () =>
      players.map((player) => ({
        id: String(player.id),
        name: `${player.preferredFirstName || player.firstName} ${player.preferredLastName || player.lastName}`.trim(),
        label:
          `${player.preferredFirstName || player.firstName} ${player.preferredLastName || player.lastName}`.trim(),
        kind: "player",
        points: 0,
        clubId: String(player.currentRoasterAllocation?.teamId ?? ""),
      })),
    [players],
  );

  const usedAssetIds = useMemo(
    () =>
      clubs.flatMap((club) =>
        [...club.picks, ...club.players].map((asset) => asset.id),
      ),
    [clubs],
  );

  const addClub = () => {
    const nextTeamId = teamOptions.find(
      (team) => !clubs.some((club) => club.teamId === team.value),
    )?.value;

    const nextClubId = `club-${Date.now()}`;
    const nextClub: TradeClub = {
      id: nextClubId,
      teamId: nextTeamId ?? "",
      name: nextTeamId
        ? (teamOptions.find((team) => team.value === nextTeamId)?.label ??
          "Club")
        : "Club",
      shortName: "CL",
      icon: nextTeamId
        ? (teamOptions.find((team) => team.value === nextTeamId)?.icon ?? "")
        : "",
      picks: [],
      players: [],
    };

    setClubs((current) => [...current, nextClub]);
    form.setValue("clubs", [
      ...form.getValues("clubs"),
      { id: nextClubId, teamId: nextTeamId ?? "" },
    ]);
  };

  const removeClub = (clubId: string) => {
    setClubs((current) => {
      if (current.length <= 2) return current;
      return current.filter((club) => club.id !== clubId);
    });

    form.setValue(
      "clubs",
      form.getValues("clubs").filter((club) => club.id !== clubId),
    );
  };

  const updateClub = (clubId: string, nextTeamId: string) => {
    const team = teamOptions.find((option) => option.value === nextTeamId);
    if (!team) return;

    setClubs((current) =>
      current.map((club) =>
        club.id === clubId
          ? {
              ...club,
              teamId: team.value,
              name: team.label,
              shortName: team.label.slice(0, 2),
              icon: team.icon ?? club.icon,
            }
          : club,
      ),
    );

    form.setValue(
      "clubs",
      form
        .getValues("clubs")
        .map((club) =>
          club.id === clubId ? { ...club, teamId: nextTeamId } : club,
        ),
    );
  };

  const addAssetToClub = (asset: TradeAsset) => {
    const club = clubs.find((candidate) => candidate.teamId === asset.clubId);
    if (!club) {
      const nextClubId = `club-${Date.now()}`;
      const nextTeam = teamOptions.find(
        (candidate) => candidate.value === asset.clubId,
      );
      const nextClub: TradeClub = {
        id: nextClubId,
        teamId: asset.clubId,
        name: nextTeam?.label ?? "Club",
        shortName: nextTeam?.label?.slice(0, 2) ?? "CL",
        icon: nextTeam?.icon ?? "",
        picks: [],
        players: [],
      };

      setClubs((current) => [
        ...current,
        { ...nextClub, [asset.kind === "pick" ? "picks" : "players"]: [asset] },
      ]);
      form.setValue("clubs", [
        ...form.getValues("clubs"),
        { id: nextClubId, teamId: asset.clubId },
      ]);
      return;
    }

    setClubs((current) =>
      current.map((candidate) => {
        if (candidate.id !== club.id) return candidate;
        const key = asset.kind === "pick" ? "picks" : "players";
        return {
          ...candidate,
          [key]: [...candidate[key], asset],
        } as TradeClub;
      }),
    );
  };

  const removeAsset = (clubId: string, assetId: string) => {
    setClubs((current) =>
      current.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          picks: club.picks.filter((asset) => asset.id !== assetId),
          players: club.players.filter((asset) => asset.id !== assetId),
        };
      }),
    );
  };

  const pickerOptions =
    activeTab === "picks" ? tradePickOptions : playerOptions;

  const modalContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => undefined)}
        className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-highlight-text">
              Transaction · Trade
            </div>
            <div className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              New trade
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-dashed px-3 text-[11px] font-semibold"
            onClick={addClub}
          >
            + Add club
          </Button>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 max-h-[70vh] flex-1 flex-col gap-4 overflow-auto bg-secondary/20 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-2">
            {clubs.map((club, index) => (
              <TradeClubLane
                key={club.id}
                club={club}
                control={form.control}
                fieldName={`clubs.${index}.teamId`}
                onClubChange={updateClub}
                onRemoveClub={removeClub}
                onRemoveAsset={removeAsset}
                teamOptions={teamOptions}
              />
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="mb-3 flex overflow-hidden rounded-lg border border-border bg-secondary/40 p-1">
              {(["picks", "players"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {tab === "picks" ? "Picks" : "Players"}
                </button>
              ))}
            </div>

            <TradeAssetSheet
              tab={activeTab}
              pickerOptions={pickerOptions}
              usedAssetIds={usedAssetIds}
              onAddAsset={addAssetToClub}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 sm:px-5">
          <div className="text-xs text-muted-foreground">
            {clubs.length} clubs selected
          </div>
          <Button
            type="submit"
            className="h-10 rounded-xl px-5 text-sm font-semibold"
          >
            Confirm trade
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="flex h-[92dvh] flex-col gap-0 border-border bg-transparent p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Trade</SheetTitle>
          <div className="flex h-full flex-col bg-transparent p-2">
            {modalContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        overlayClassName="bg-black/35"
        className="max-w-[1100px] max-h-[90vh] gap-0  border-0 bg-transparent p-0 shadow-none [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Trade</DialogTitle>
        <DialogDescription className="sr-only">
          Create a multi-club draft trade.
        </DialogDescription>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}

export default TradeModal;
