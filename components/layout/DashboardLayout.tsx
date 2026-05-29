"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSubHeader } from "./DashboardSubHeader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDashboardLayout } from "./useDashboardLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { projects, isSideBarOpen, setIsSideBarOpen, selectedProject, setSelectedProject, isMobile } = useDashboardLayout();
  return (
    <SidebarProvider open={isSideBarOpen} onOpenChange={setIsSideBarOpen}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* ── Sticky header stack ── */}
          <div className="sticky top-0 z-40">
            {/* Row 1 – global search + notifications + quick links */}
            <div className="flex items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              
              <DashboardHeader 
              sidebarOpen={isSideBarOpen || isMobile}
              />
            </div>

            {/* Row 2 – contextual subheader (optional) */}
            <DashboardSubHeader
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
            />
          </div>

          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}