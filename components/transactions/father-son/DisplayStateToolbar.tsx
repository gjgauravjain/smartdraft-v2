import { cn } from "@/lib/utils";
import { DisplayStateKey } from "./type";
import { DISPLAY_STATES } from "./util";

export function DisplayStateToolbar({
  active,
}: {
  active: DisplayStateKey | null;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4.5 z-50 flex justify-center">
      <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/[0.14] bg-[rgba(15,20,30,0.82)] p-1 backdrop-blur-md">
        <span className="px-2.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white/50">
          Display state
        </span>
        {DISPLAY_STATES.map((s) => {
          const isActive = active === s.key;
          return (
            <button
              key={s.key}
              type="button"
              className={cn(
                "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-bold transition-colors",
                isActive
                  ? "bg-white text-[#16202e]"
                  : "bg-transparent text-white/70 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-extrabold",
                  isActive ? "bg-success text-white" : "bg-white/16 text-white",
                )}
              >
                {s.letter}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
