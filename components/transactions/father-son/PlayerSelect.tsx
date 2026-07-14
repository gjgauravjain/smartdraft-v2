import {
  FormSelectField,
  SelectOption,
} from "@/components/common/fields/FormSelectField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { FatherSonBidMatchFormValues } from "./hook";
import RequiredLabel from "@/components/common/fields/RequiredLabel";

type PlayerSelectProps = {
  playerSource: "all" | "talentOrder";
  setPlayerSource: (source: "all" | "talentOrder") => void;
  talentOrderOptions: SelectOption[];
  talentOrderId: string;
  playersOptions: SelectOption[];
  form: UseFormReturn<
    FatherSonBidMatchFormValues,
    any,
    FatherSonBidMatchFormValues
  >;
};

const PlayerSelect = ({
  playerSource,
  form,
  talentOrderId,
  setPlayerSource,
  talentOrderOptions,
  playersOptions,
}: PlayerSelectProps) => {
  const selectedTalentOrder = talentOrderOptions.find(
    (o) => o.value === talentOrderId,
  );

  const handleSelectTalentOrder = (value: string) => {
    form.setValue("talentOrderId", value, { shouldValidate: true });
    setPlayerSource("talentOrder");
  };

  return (
    <div>
      <div className="mb-1.5 text-[11px] font-bold text-foreground">
        <RequiredLabel>Player</RequiredLabel>
      </div>

      <div className="mb-1.5 inline-flex max-w-full items-center gap-0.5 rounded-lg border border-border bg-muted p-0.75">
        <button
          type="button"
          onClick={() => setPlayerSource("all")}
          className={cn(
            "inline-flex h-6.5 items-center whitespace-nowrap rounded-md border px-2.5 text-[11px] font-extrabold transition-colors",
            playerSource === "all"
              ? "border-[#d3d7de] bg-card text-primary shadow-sm"
              : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          All players
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={() => {
                if (playerSource !== "talentOrder" && talentOrderId) {
                  setPlayerSource("talentOrder");
                }
              }}
              className={cn(
                "inline-flex h-6.5 max-w-47.5 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-[11px] font-semibold transition-colors",
                playerSource === "talentOrder"
                  ? "border-[#d3d7de] bg-card text-primary shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-[10px]">★</span>
              <span className="truncate">
                {selectedTalentOrder?.label ?? "Talent order"}
              </span>
              <span className="text-[8.5px] opacity-70">▾</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {talentOrderOptions.length === 0 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                No talent orders available
              </div>
            )}
            {talentOrderOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleSelectTalentOrder(option.value)}
                className={cn(
                  "text-[12.5px]",
                  option.value === talentOrderId && "font-bold text-primary",
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <FormSelectField
        label={undefined}
        control={form.control}
        name="playerId"
        options={playersOptions}
        placeholder={"Select player"}
        isSearchable
        required={false}
      />
    </div>
  );
};

export default PlayerSelect;
