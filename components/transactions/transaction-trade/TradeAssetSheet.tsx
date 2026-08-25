import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TradeAsset, TradeTab } from "./types";

type TradeAssetSheetProps = {
  tab: TradeTab;
  pickerOptions: TradeAsset[];
  usedAssetIds: string[];
  onAddAsset: (asset: TradeAsset) => void;
};

export function TradeAssetSheet({
  tab,
  pickerOptions,
  usedAssetIds,
  onAddAsset,
}: TradeAssetSheetProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return pickerOptions.filter((asset) => {
      const matchesTab = asset.kind === (tab === "picks" ? "pick" : "player");
      const matchesQuery =
        !normalized || asset.name.toLowerCase().includes(normalized);
      const isUsed = usedAssetIds.includes(asset.id);
      return matchesTab && matchesQuery && !isUsed;
    });
  }, [pickerOptions, query, tab, usedAssetIds]);

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === "picks" ? "Search picks" : "Search players"}
          className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="max-h-64 space-y-2 overflow-auto pr-1">
        {filteredOptions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
            No available {tab} found.
          </div>
        ) : (
          filteredOptions.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onAddAsset(asset)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-left transition-colors hover:bg-secondary",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">
                  {asset.name}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {asset.clubId}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {asset.points} pts
                </span>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 rounded-md px-2.5 text-xs"
                >
                  Add
                </Button>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
