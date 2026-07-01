"use client";

import {
  Bell,
  Plus,
  Search,
  ChevronDown,
  Command,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { SidebarTrigger } from "../ui/sidebar";
import { AuthContexts } from "@/providers";

function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <Button variant="outline" size="icon" className="relative h-9 w-9">
      <Bell className="h-4 w-4" />
      {count > 0 && (
        <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
          {count}
        </Badge>
      )}
    </Button>
  );
}

function QuickLinks() {
  const { logoutUser } = AuthContexts();

  const links = [
    {
      name: "Logout",
      action: () => logoutUser(),
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1.5 text-sm font-semibold">
          <Plus className="h-4 w-4" />
          Quick links
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {links.map((link) => (
          <DropdownMenuItem key={link.name} onClick={link.action}>
            {link.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DashboardHeaderProps = {
  sidebarOpen?: boolean;
};
export function DashboardHeader({ sidebarOpen }: DashboardHeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <header className="sticky w-full top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white dark:bg-background px-4">
      <div className="flex-1 flex items-center gap-4">
        {!sidebarOpen && (
          <SidebarTrigger className="ml-2 cursor-pointer shrink-0" />
        )}
        <div className="flex h-9 w-full max-w-120 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-ring focus-within:border-ring">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <input
            type="search"
            aria-label="Search players, picks, transactions"
            placeholder="Search players, picks, transactions..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="pointer-events-none flex items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <NotificationBell count={3} />
        <QuickLinks />
      </div>
    </header>
  );
}
