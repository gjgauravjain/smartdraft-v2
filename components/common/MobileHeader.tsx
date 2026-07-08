import { Bell, Menu, Search } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  notificationCount?: number;
  onSearch?: () => void;
  onNotifications?: () => void;
  additionalActions?: React.ReactNode;
}

export function MobileHeader({
  title,
  subtitle,
  notificationCount = 0,
  onSearch,
  onNotifications,
  additionalActions,
}: MobileHeaderProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <div className="flex h-14 items-center gap-2.5 border-b border-border bg-card px-3.5">
      <button
        onClick={() => setOpenMobile(true)}
        className="flex h-8 w-8 items-center justify-center text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-foreground">
          {title}
        </div>
        {subtitle && (
          <div className="truncate text-[11px] text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>

      {onSearch && (
        <button
          onClick={onSearch}
          className="flex h-8 w-8 items-center justify-center text-foreground"
        >
          <Search className="h-5 w-5" />
        </button>
      )}
      {onNotifications && (
        <button
          onClick={onNotifications}
          className="relative flex h-8 w-8 items-center justify-center text-foreground"
        >
          <Bell className="h-5 w-5" />

          {notificationCount > 0 && (
            <span className="absolute right-0 top-0 flex h-3 min-w-3 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold text-primary-foreground">
              {notificationCount}
            </span>
          )}
        </button>
      )}

      {additionalActions}
    </div>
  );
}
