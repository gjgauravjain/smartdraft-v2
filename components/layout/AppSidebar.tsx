"use client";

import React from "react";
import Link from "next/link";
import { useAppSidebarWizard } from "./useAppSidebarWizard";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

function AppSidebarToggle() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "absolute -right-3 top-1/2 -translate-y-1/2 z-50",
        "w-6 h-6 rounded-full bg-background border border-sidebar-border shadow-md",
        "flex items-center justify-center text-muted-foreground",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
        "hidden md:flex",
      )}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ChevronRight className="h-3 w-3" />
      ) : (
        <ChevronLeft className="h-3 w-3" />
      )}
    </button>
  );
}

function AppSidebarHeader({
  selectedTeam,
  teams,
  setSelectedTeam,
}: {
  selectedTeam: ReturnType<typeof useAppSidebarWizard>["selectedTeam"];
  teams: ReturnType<typeof useAppSidebarWizard>["teams"];
  setSelectedTeam: ReturnType<typeof useAppSidebarWizard>["setSelectedTeam"];
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  return (
    <SidebarHeader className="border-b border-sidebar-border p-0">
      <div className="flex bg-tertiary items-center gap-2 px-0 py-3 relative">
        {isCollapsed && !isMobile ? (
          <div className="flex w-full items-center justify-center">
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-white text-xs font-bold tracking-wider">
              SD
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-full px-4 items-center">
            <p className="text-lg font-bold text-white">Smart Draft</p>
          </div>
        )}
        {!isCollapsed && <AppSidebarToggle />}
      </div>

      <div className={cn("px-4 py-2", isCollapsed && !isMobile && "px-0 py-0")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isCollapsed && !isMobile ? (
              <div className="px-0 py-2 flex justify-center">
                <div
                  title={selectedTeam?.teamNames}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar border border-sidebar-border cursor-pointer hover:bg-sidebar-accent transition-colors"
                >
                  <img
                    src={selectedTeam?.image}
                    alt={selectedTeam?.teamNames}
                    className="w-5 h-5 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <button className="flex items-center gap-2 w-full px-2 py-2 rounded-lg border border-sidebar-border hover:bg-sidebar-accent transition-colors">
                <div>
                  <img
                    src={selectedTeam?.image}
                    alt={selectedTeam?.teamNames}
                    className="w-4 h-4 rounded-full"
                  />
                </div>
                <span className="font-medium text-sidebar-foreground flex-1 text-left">
                  {selectedTeam?.teamNames || "Select Team"}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {teams?.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={cn(
                  "cursor-pointer",
                  team.id === selectedTeam?.id && "bg-accent/60",
                )}
              >
                <img
                  src={team.image}
                  alt={team.teamNames}
                  className="w-6 h-6 rounded-full mr-2"
                />
                {team.teamNames}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarHeader>
  );
}

export function AppSidebar() {
  const {
    menuSections,
    isActiveLink,
    user,
    selectedTeam,
    setSelectedTeam,
    teams,
  } = useAppSidebarWizard();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar border-r border-sidebar-border"
    >
      <AppSidebarHeader
        selectedTeam={selectedTeam}
        teams={teams}
        setSelectedTeam={setSelectedTeam}
      />

      <SidebarContent className="px-0 gap-0! group-data-[collapsible=icon]:overflow-y-auto">
        {menuSections.map((section, index) => (
          <React.Fragment key={section.id}>
            {isCollapsed && index > 0 && <SidebarSeparator className="my-1" />}
            <SidebarGroup className="py-0! mt-2 px-0">
              {section.menuLabel && (
                <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.menuLabel}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 px-2">
                  {section.subMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.label}
                          className={`
                            relative h-10 rounded-lg transition-all
                            ${
                              isActiveLink(item.url)
                                ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }
                          `}
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-3"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-medium flex-1">
                              {item.label}
                            </span>
                            {item.badge && (
                              <div className="w-6 h-6 rounded-full bg-destructive text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                                {item.badge}
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </React.Fragment>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Org Admin"
              className="h-10 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">Org Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton
              tooltip={user?.username}
              className="h-10 rounded-lg hover:bg-sidebar-accent/50"
            >
              <div className="w-6 h-6 rounded-full bg-destructive text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.username}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {
                    teams.find(
                      (team) => team.id.toString() === user?.teamId.toString(),
                    )?.teamNames
                  }
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
