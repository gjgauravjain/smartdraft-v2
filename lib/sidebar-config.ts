import { SD_ICON_COMPONENTS } from '@/components/common/icons';
import { routeUrl } from './route-url';

export interface SubMenuItem {
  id: string;
  label: string;
  toShow: boolean;
  icon: React.ElementType;
  url: string;
  badge?: string;
}

export interface MenuSection {
  id: string;
  menuLabel: string;
  hide?: boolean;
  subMenu: SubMenuItem[];
  badge?: string;
}

export function getSideMenuOptions(
  sidebarBadges: Record<string, string> = {},
): MenuSection[] {
  return [
    {
      menuLabel: '',
      id: 'home',
      subMenu: [
        {
          id: 'home',
          label: 'Home',
          toShow: true,
          icon: SD_ICON_COMPONENTS.home,
          url: routeUrl.home,
        },
      ],
    },
    {
      menuLabel: 'Draft',
      id: 'smart_draft',
      subMenu: [
        {
          id: 'draft_home',
          label: 'Draft Home',
          toShow: true,
          icon: SD_ICON_COMPONENTS.dhome,
          url: routeUrl.draftSummary,
        },
        {
          id: 'draft_pick',
          label: 'Draft Picks',
          toShow: true,
          icon: SD_ICON_COMPONENTS.picks,
          url: routeUrl.draftPick,
        },
        {
          id: 'scenario_planner',
          label: 'Scenario Planner',
          toShow: true,
          icon: SD_ICON_COMPONENTS.scenario,
          url: routeUrl.scenarioPlanning,
        },
        {
          id: 'trade_offers',
          label: 'Trade Offers',
          toShow: true,
          icon: SD_ICON_COMPONENTS.trade,
          url: routeUrl.tradeOffer,
          badge: sidebarBadges.tradeOffers,
        },
        {
          id: 'project_list',
          label: 'Projects',
          toShow: true,
          icon: SD_ICON_COMPONENTS.list,
          url: routeUrl.projectList,
        },
      ],
    },
    {
      id: 'smart_player',
      menuLabel: 'Player',
      subMenu: [
        {
          id: 'player_profile',
          label: 'Player Profile',
          toShow: true,
          icon: SD_ICON_COMPONENTS.player,
          url: routeUrl.playerProfile,
        },
        {
          id: 'player_ranking',
          label: 'Talent Order',
          toShow: true,
          icon: SD_ICON_COMPONENTS.order,
          url: routeUrl.playerRanking,
        },
        {
          id: 'notes_and_forms',
          label: 'Notes & Forms',
          toShow: true,
          icon: SD_ICON_COMPONENTS.notes,
          url: routeUrl.notesAndForms,
        },
        {
          id: 'player_database',
          label: 'Player Database',
          toShow: true,
          icon: SD_ICON_COMPONENTS.database,
          url: routeUrl.playerDatabase,
        },
      ],
    },
    {
      id: 'smart_list',
      menuLabel: 'List',
      subMenu: [
        {
          id: 'club_summary',
          label: 'Club Summary',
          toShow: true,
          icon: SD_ICON_COMPONENTS.list,
          url: routeUrl.smartList,
        },
        {
          id: 'list_projection',
          label: 'List Projection',
          toShow: true,
          icon: SD_ICON_COMPONENTS.projection,
          url: routeUrl.listProjection,
        },
        {
          id: 'heads_of_agreement',
          label: 'Heads of Agreement',
          toShow: true,
          icon: SD_ICON_COMPONENTS.contracts,
          url: routeUrl.headsOfAgreement,
        },
      ],
    },
  ];
}

export function getOrgAdminMenuItem(): SubMenuItem {
  return {
    id: 'org_admin',
    label: 'Org Admin',
    toShow: true,
    icon: SD_ICON_COMPONENTS.settings,
    url: routeUrl.orgAdmin,
  };
}

export function getSuperadminMenuOptions(isSuperuser: boolean): SubMenuItem[] {
  if (!isSuperuser) {
    return [];
  }

  return [
    {
      id: 'organisation',
      label: 'Organisations',
      toShow: true,
      icon: SD_ICON_COMPONENTS.building,
      url: routeUrl.organisation,
    },
    {
      id: 'users',
      label: 'Users',
      toShow: true,
      icon: SD_ICON_COMPONENTS.player,
      url: routeUrl.users,
    },
  ];
}
