import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ActionMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onClick?: () => void;
};

export function ActionMenuItem({
  icon,
  label,
  destructive,
  disabled,
  disabledReason,
  onClick,
}: ActionMenuItemProps) {
  const content = (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) {
          onClick?.();
        }
      }}
      className={cn(
        "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-[12px]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-accent/60",
        destructive ? "text-destructive" : "text-foreground",
      )}
    >
      <span className="mr-2 inline-flex h-3 w-3 shrink-0 items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );

  if (!disabled || !disabledReason) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block w-full">{content}</span>
      </TooltipTrigger>
      <TooltipContent side="left">{disabledReason}</TooltipContent>
    </Tooltip>
  );
}
