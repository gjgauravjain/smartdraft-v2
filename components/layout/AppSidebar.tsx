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
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrganisationType } from "@/app/api/type/common";

function AppSidebarEdgeHandle() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "absolute -right-3 top-[40%] cursor-pointer -translate-y-1/2 z-50",
        "w-6 h-6 rounded-full bg-background border border-sidebar-border shadow-md",
        "flex items-center justify-center text-muted-foreground",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
        "hidden md:flex",
      )}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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

function AppSidebarHeaderToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      aria-label="Collapse sidebar"
      title="Collapse sidebar"
    >
      <ChevronLeft className="h-3.5 w-3.5" />
    </button>
  );
}

function AppSidebarHeader({
  organisations,
  selectedOrganisation,
  setSelectedOrganisation,
}: {
  organisations: OrganisationType[];
  selectedOrganisation: string;
  setSelectedOrganisation: (org: string) => void;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const showCollapsed = isCollapsed && !isMobile;

  const selectedOrgTitle =
    organisations.find(
      (org) =>
        org.organisationId.toString() === selectedOrganisation.toString(),
    )?.organisationTitle || "CURRENT ORG";

  return (
    <SidebarHeader className="border-b border-sidebar-border p-0">
      <div className="flex bg-tertiary items-center gap-2 px-0 py-2 relative">
        {showCollapsed ? (
          <div className="flex w-full items-center justify-center">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white text-[10px] font-bold tracking-wider">
              SD
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <p className="text-base font-bold text-white">Smart Draft</p>
            <AppSidebarHeaderToggle />
          </div>
        )}
      </div>

      <div
        className={cn(
          "px-3 py-1.5",
          showCollapsed && "flex justify-center px-0",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {showCollapsed ? (
              <button
                title={selectedOrgTitle}
                className="flex items-center justify-center w-8 h-7 rounded-md bg-sidebar border border-sidebar-border cursor-pointer hover:bg-sidebar-accent transition-colors text-[10px] font-semibold text-sidebar-foreground"
              >
                {selectedOrgTitle.slice(0, 2).toUpperCase()}
              </button>
            ) : (
              <button className="flex items-center gap-1.5 w-full min-w-0 h-7 px-2 rounded-md border border-sidebar-border hover:bg-sidebar-accent transition-colors">
                <span className="text-xs text-sidebar-foreground flex-1 min-w-0 text-left truncate">
                  {selectedOrgTitle}
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground rotate-90 shrink-0" />
              </button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {organisations.map((org) => (
              <DropdownMenuItem
                key={org.organisationId}
                onClick={() =>
                  setSelectedOrganisation(org.organisationId.toString())
                }
                className={cn(
                  "cursor-pointer text-xs",
                  org.organisationId.toString() ===
                    selectedOrganisation.toString() && "bg-accent/60",
                )}
              >
                {org.organisationTitle}
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
    orgAdminItem,
    superadminItems,
    isActiveLink,
    user,
    teams,
    organisations,
    currentOrganisation,
    setCurrentOrganisation,
  } = useAppSidebarWizard();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const OrgAdminIcon = orgAdminItem.icon;

  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar border-r border-sidebar-border"
    >
      <div className="relative flex h-full min-h-0 flex-1 flex-col">
        <AppSidebarEdgeHandle />
        <AppSidebarHeader
          organisations={organisations}
          selectedOrganisation={currentOrganisation}
          setSelectedOrganisation={setCurrentOrganisation}
        />

        <SidebarContent className="px-0 gap-0! overflow-hidden">
          {menuSections.map((section, index) => (
            <React.Fragment key={section.id}>
              {isCollapsed && index > 0 && (
                <SidebarSeparator className="my-0.5" />
              )}
              <SidebarGroup className="py-0! mt-1 px-0">
                {section.menuLabel && (
                  <SidebarGroupLabel className="h-5 px-3 text-[10px] font-medium text-text4 uppercase tracking-wider">
                    {section.menuLabel}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0 px-1.5">
                    {section.subMenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            asChild
                            size="sm"
                            tooltip={item.label}
                            className={cn(
                              "relative h-7 rounded-md px-2 transition-all",
                              isActiveLink(item.url)
                                ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                            )}
                          >
                            <Link
                              href={item.url}
                              className="flex items-center gap-2"
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs font-medium flex-1">
                                {item.label}
                              </span>
                              {item.badge && (
                                <div className="w-5 h-5 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
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

        <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-1.5 py-2">
          <SidebarMenu className="gap-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="sm"
                tooltip={orgAdminItem.label}
                className={cn(
                  "h-7 rounded-md transition-all",
                  isActiveLink(orgAdminItem.url)
                    ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <Link
                  href={orgAdminItem.url}
                  className="flex items-center gap-2"
                >
                  <OrgAdminIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs font-medium">
                    {orgAdminItem.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {superadminItems.length > 0 && (
              <>
                <SidebarGroupLabel className="mt-1 h-5 px-1 text-[10px] font-medium text-text4 uppercase tracking-wider">
                  Superadmin
                </SidebarGroupLabel>
                {superadminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        size="sm"
                        tooltip={item.label}
                        className={cn(
                          "h-7 rounded-md transition-all",
                          isActiveLink(item.url)
                            ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-sidebar-accent dark:text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-xs font-medium">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton
                size="sm"
                tooltip={user?.username}
                className="h-8 rounded-md hover:bg-sidebar-accent/50"
              >
                <div className="w-5 h-5 rounded-full bg-destructive text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs font-medium text-sidebar-foreground truncate">
                    {user?.username}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {
                      teams.find(
                        (team) =>
                          team.id.toString() === user?.teamId.toString(),
                      )?.teamNames
                    }
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
