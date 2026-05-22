'use client';

import Link from 'next/link';
import { useAppSidebarWizard } from './use-app-sidebar-wizard';
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
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';

function SidebarHeaderContent() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        GTX
      </div>
      <span className="text-sm text-muted-foreground">Smart Draft</span>
    </div>
  );
}

function SidebarFooterContent() {
  return (
    <div className="px-4 py-2 text-xs text-muted-foreground">
      © 2026 GTX Smart Draft
    </div>
  );
}

export function AppSidebar() {
  const { menuSections, isActiveLink, getVisibleMenuItems } = useAppSidebarWizard();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent>
        {menuSections.map((section) => {
          const visibleItems = getVisibleMenuItems(section.id);
          
          if (visibleItems.length === 0) {
            return null;
          }

          return (
            <SidebarGroup key={section.id}>
              {section.menuLabel && (
                <SidebarGroupLabel>{section.menuLabel}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveLink(item.url);

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            {isActive && (
                              <ChevronRight className="ml-auto h-4 w-4" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}
