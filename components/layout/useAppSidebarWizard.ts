"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { getSideMenuOptions, getOrgAdminMenuItem, getSuperadminMenuOptions } from "@/lib/sidebar-config";
import { useStore } from "@/store/useStore";
import { useGetTeams } from "@/app/api/react-query/common";

export function useAppSidebarWizard() {
  const pathname = usePathname();
  const {
    selectedTeam,
    setSelectedTeam,
    setIsSideBarOpen,
    isSideBarOpen,
    currentOrganisation,
    setCurrentOrganisation,
  } = useStore();
  const { user } = useStore();

  const sidebarBadges = useMemo<Record<string, string>>(
    () => ({
      tradeOffers: "3",
    }),
    [],
  );

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

  const menuSections = useMemo(
    () =>
      getSideMenuOptions(sidebarBadges)
        .map((section) => ({
          ...section,
          subMenu: section.subMenu.filter((item) => item.toShow === true),
        }))
        .filter((section) => !section.hide && section.subMenu.length > 0),
    [sidebarBadges],
  );

  const orgAdminItem = useMemo(() => getOrgAdminMenuItem(), []);

  const superadminItems = useMemo(
    () => getSuperadminMenuOptions(!!user?.isSuperuser),
    [user?.isSuperuser],
  );

  const isActiveLink = (url: string) => {
    return pathname === url;
  };

  const getVisibleMenuItems = (sectionId: string) => {
    const section = menuSections.find((s) => s.id === sectionId);
    if (!section) return [];

    return section.subMenu;
  };

  return {
    menuSections,
    orgAdminItem,
    superadminItems,
    isActiveLink,
    getVisibleMenuItems,
    setSelectedTeam,
    selectedTeam,
    teams: data || [],
    setIsSideBarOpen,
    isSideBarOpen,
    user,
    organisations: user?.organisations || [],
    currentOrganisation,
    setCurrentOrganisation,
  };
}
