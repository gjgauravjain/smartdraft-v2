"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDashboardLayout } from "./useDashboardLayout";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isSideBarOpen, setIsSideBarOpen, isMobile } = useDashboardLayout();
  return (
    <SidebarProvider open={isSideBarOpen} onOpenChange={setIsSideBarOpen}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {!isMobile && (
            <div className="sticky top-0 z-40">
              <div className="flex items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <DashboardHeader />
              </div>
            </div>
          )}

          <main className={cn("flex-1 overflow-auto")}>{children}</main>
          {isMobile && <BottomNav />}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
