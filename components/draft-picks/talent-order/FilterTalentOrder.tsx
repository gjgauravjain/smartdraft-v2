import React from "react";
import { FILTERS } from "./util";
import { TalentFilter } from "@/app/api/type/player";

interface FilterTalentOrderProps {
  filter: TalentFilter;
  setFilter: (filter: TalentFilter) => void;
}
const FilterTalentOrder = ({ filter, setFilter }: FilterTalentOrderProps) => {
  return (
    <div className="px-3 pt-2 pb-1 shrink-0 flex gap-1">
      {FILTERS.map(({ key, label }) => {
        const active = filter === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={[
              "flex-1 px-2 py-[5px] text-[10.5px] font-semibold rounded-[5px] border cursor-pointer transition-colors",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTalentOrder;
