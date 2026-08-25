import { FormSelectField } from "@/components/common/fields/FormSelectField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { TradeAsset, TradeClub, TradeClubLaneProps } from "./types";

const renderAssetChip = (
  asset: TradeAsset,
  club: TradeClub,
  onRemoveAsset: (clubId: string, assetId: string) => void,
) => (
  <div
    key={asset.id}
    className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-1 text-[11px] font-medium text-foreground"
  >
    <span className="truncate">{asset.label}</span>
    <span className="text-[10px] text-muted-foreground">{asset.points}</span>
    <button
      type="button"
      aria-label={`Remove ${asset.label}`}
      onClick={() => onRemoveAsset(club.id, asset.id)}
      className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
    >
      <X className="h-2.5 w-2.5" />
    </button>
  </div>
);

export function TradeClubLane({
  club,
  control,
  fieldName,
  isActive,
  onClubChange,
  onRemoveClub,
  onRemoveAsset,
  teamOptions,
}: TradeClubLaneProps) {
  const selected = teamOptions.find((team) => team.value === club.teamId);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3 shadow-sm transition-colors",
        isActive ? "border-primary/30 bg-primary/5" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <FormSelectField
            control={control}
            name={fieldName as any}
            label=""
            placeholder="Select club"
            options={teamOptions}
            className="m-0"
            emptyMessage="No clubs available."
          />
        </div>
        <button
          type="button"
          onClick={() => onRemoveClub(club.id)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
          aria-label={`Remove ${club.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <span>Picks</span>
            <Badge
              variant="secondary"
              className="rounded-full px-1.5 py-0.5 text-[10px]"
            >
              {club.picks.length}
            </Badge>
          </div>
          <div className="flex min-h-12 flex-wrap gap-1.5 rounded-lg border border-dashed border-border bg-secondary/30 p-2">
            {club.picks.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">
                No picks
              </span>
            ) : (
              club.picks.map((asset) =>
                renderAssetChip(asset, club, onRemoveAsset),
              )
            )}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <span>Players</span>
            <Badge
              variant="secondary"
              className="rounded-full px-1.5 py-0.5 text-[10px]"
            >
              {club.players.length}
            </Badge>
          </div>
          <div className="flex min-h-12 flex-wrap gap-1.5 rounded-lg border border-dashed border-border bg-secondary/30 p-2">
            {club.players.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">
                No players
              </span>
            ) : (
              club.players.map((asset) =>
                renderAssetChip(asset, club, onRemoveAsset),
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md bg-muted px-2 py-1.5 text-[11px] font-semibold text-foreground">
        <span>pts in</span>
        <span>
          {[...club.picks, ...club.players].reduce(
            (sum, asset) => sum + asset.points,
            0,
          )}
        </span>
      </div>

      <div className="mt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-center gap-1 rounded-lg border-dashed"
        >
          <Plus className="h-3.5 w-3.5" />
          Add asset
        </Button>
      </div>
    </div>
  );
}
