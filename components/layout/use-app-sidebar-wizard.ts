"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSideMenuOptions } from "@/lib/sidebar-config";
import { useAuth, useStore } from "@/store/useStore";
import { useGetTeams } from "@/app/api/react-query/common";

export function useAppSidebarWizard() {
  const pathname = usePathname();
  const { selectedTeam, setSelectedTeam, setIsSideBarOpen, isSideBarOpen } =
    useStore();
  const { user } = useStore();

  const [sidebarBadges, setSidebarBadges] = useState<Record<string, string>>({
    tradeOffers: "3",
  });

  const { data } = useGetTeams();

  useEffect(() => {
    if (data && data.length > 0) {
      const defaultTeam = data.find(
        (team) => team.id.toString() === user?.teamId.toString(),
      );
      if (defaultTeam) {
        setSelectedTeam(defaultTeam);
        return;
      }
      setSelectedTeam(data[0]);
    }
  }, [data, user]);

  const menuSections = getSideMenuOptions(!user?.isStaff, sidebarBadges);

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
    setSelectedTeam,
    selectedTeam,
    teams: data || [],
    setIsSideBarOpen,
    isSideBarOpen,
    user,
  };
}
