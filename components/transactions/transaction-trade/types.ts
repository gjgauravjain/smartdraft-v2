import { Control } from "react-hook-form";

export type TradeAssetKind = "pick" | "player";

export type TradeAsset = {
  id: string;
  name: string;
  label: string;
  kind: TradeAssetKind;
  points: number;
  clubId: string;
};

export type TradeClub = {
  id: string;
  teamId: string;
  name: string;
  shortName: string;
  icon: string;
  picks: TradeAsset[];
  players: TradeAsset[];
};

export type TradeTab = "picks" | "players";

export type TradeClubFormValue = {
  id: string;
  teamId: string;
};

export type TradeModalFormValues = {
  clubs: TradeClubFormValue[];
};

export type TradeClubLaneProps = {
  club: TradeClub;
  control: Control<TradeModalFormValues>;
  fieldName: string;
  isActive?: boolean;
  onClubChange: (clubId: string, teamId: string) => void;
  onRemoveClub: (clubId: string) => void;
  onRemoveAsset: (clubId: string, assetId: string) => void;
  teamOptions: Array<{ value: string; label: string; icon?: string }>;
};
