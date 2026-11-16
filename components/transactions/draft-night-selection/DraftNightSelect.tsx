"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { fieldLabelClass, selectPanelClass, selectTriggerClass } from "./util";

type DraftNightSelectProps = {
  label: string;
  open: boolean;
  hasValue: boolean;
  onToggle: () => void;
  onDismiss: () => void;
  trigger: ReactNode;
  panel: ReactNode;
  error?: string | null;
};

export const DraftNightSelect = ({
  label,
  open,
  hasValue,
  onToggle,
  onDismiss,
  trigger,
  panel,
  error,
}: DraftNightSelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onDismiss();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, onDismiss]);

  return (
    <div ref={rootRef} className="flex flex-col gap-1">
      <span className={fieldLabelClass()}>{label}</span>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
        className={selectTriggerClass(open, hasValue)}
      >
        <span className="block min-w-0 flex-1 overflow-hidden">{trigger}</span>
        <ChevronDown className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
      </button>
      {open ? <div className={selectPanelClass()}>{panel}</div> : null}
      {error ? (
        <p className="text-[11.5px] text-destructive">{error}</p>
      ) : null}
    </div>
  );
};
