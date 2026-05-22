'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSideMenuOptions } from '@/lib/sidebar-config';
import { useStore } from '@/store/useStore';

export function useAppSidebarWizard() {
  const pathname = usePathname();
  const [isStaff] = useState(false); // TODO: Get from auth state

  const menuSections = getSideMenuOptions(isStaff);

  const isActiveLink = (url: string) => {
    return pathname === url;
  };

  const getVisibleSections = () => {
    return menuSections.filter((section) => !section.hide);
  };

  const getVisibleMenuItems = (sectionId: string) => {
    const section = menuSections.find((s) => s.id === sectionId);
    if (!section) return [];
    
    return section.subMenu.filter((item) => item.toShow);
  };

  return {
    menuSections: getVisibleSections(),
    isActiveLink,
    getVisibleMenuItems,
  };
}
