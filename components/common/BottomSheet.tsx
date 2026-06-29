"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  headerExtra,
  footer,
  children,
  className,
}: BottomSheetProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute left-0 right-0 bottom-0 flex max-h-[68%] flex-col overflow-hidden rounded-t-[18px] bg-card shadow-[0_-8px_32px_rgba(0,0,0,0.3)] transition-transform duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-y-0" : "translate-y-full",
          className,
        )}
      >
        <div className="flex shrink-0 justify-center px-0 pt-2 pb-1">
          <div className="h-1 w-[38px] rounded-full bg-border" />
        </div>

        <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-4 pb-3 pt-1">
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-foreground">{title}</div>
            {subtitle && (
              <div className="mt-px text-[11.5px] text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {headerExtra}

        <div className="min-h-0 overflow-y-auto">{children}</div>

        {footer}
      </div>
    </div>,
    document.body,
  );
}
