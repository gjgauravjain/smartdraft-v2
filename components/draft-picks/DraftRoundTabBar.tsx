import { cn } from "@/lib/utils";
import { DraftYearType } from "@/app/api/type/draftpicks";

type TabItem = {
  id: "all" | keyof DraftYearType;
  label: string;
};

const TABS: TabItem[] = [
  { id: "all", label: "All" },
  { id: "rd1List", label: "R1" },
  { id: "rd2List", label: "R2" },
  { id: "rd3List", label: "R3" },
  { id: "rd4List", label: "R4" },
  { id: "rd5List", label: "R5" },
  { id: "rd6List", label: "Rest" },
];

type Props = {
  active: "all" | keyof DraftYearType;
  onChange: (id: "all" | keyof DraftYearType) => void;
};

export function DraftRoundTabBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto px-3 py-2 scrollbar-none border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border border-border transition-colors shrink-0",
            active === tab.id
              ? "bg-card text-foreground"
              : "bg-card/50 text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
