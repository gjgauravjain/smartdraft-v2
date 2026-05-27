"use client";

import Link from "next/link";
import { useAppSidebarWizard } from "./use-app-sidebar-wizard";
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
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { menuSections, isActiveLink, user, selectedTeam, setSelectedTeam, teams, setIsSideBarOpen, isSideBarOpen } =
    useAppSidebarWizard();

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border  p-0">
        <div className="flex bg-tertiary items-center gap-2 px-4 py-3">
          <div className="flex justify-between w-full items-center">
            <p className="text-lg font-bold text-white">
              Smart Draft
            </p>
            <div>
              <ChevronLeft onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="h-4 w-4 text-white ml-2 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {teams?.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={cn(
                    "cursor-pointer",
                    team.id === selectedTeam?.id && "bg-sidebar-accent",
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

      <SidebarContent className="px-0 gap-0!">
        {menuSections.map((section) => (
          <SidebarGroup key={section.id} className="py-0! mt-2 px-0">
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
                            <div className="w-6 h-6 rounded-full bg-destructive text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
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
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Org Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-destructive text-primary-foreground flex items-center justify-center text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-sidebar-foreground">
                  {user?.username}
                </div>
                <div className="text-xs text-muted-foreground">
                  {teams.find((team) => team.id.toString() === user?.teamId.toString())?.teamNames}
                </div>
              </div>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
