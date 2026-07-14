import { cn } from "@/lib/utils";
import { DisplayStateKey } from "./type";
import { DISPLAY_STATES } from "./util";

export function DisplayStateToolbar({
  active,
}: {
  active: DisplayStateKey | null;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-50 flex justify-center sm:top-4.5">
      <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/[0.14] bg-[rgba(15,20,30,0.82)] p-1 backdrop-blur-md">
        <span className="hidden px-2.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white/50 sm:inline">
          Display state
        </span>
        {DISPLAY_STATES.map((s) => {
          const isActive = active === s.key;
          return (
            <button
              key={s.key}
              type="button"
              className={cn(
                "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-1.5 text-[11px] font-bold transition-colors sm:px-3",
                isActive
                  ? "bg-white text-black"
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
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
