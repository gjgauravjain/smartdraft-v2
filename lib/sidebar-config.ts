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

export function getSideMenuOptions(isStaff: boolean = false, sidebarBadges: Record<string, string> = {}): MenuSection[] {
  return [
    {
      menuLabel: '',
      hide: true,
      id: 'home',
      subMenu: [
        {
          id: 'home',
          label: 'Dashboard',
          toShow: false,
          icon: SD_ICON_COMPONENTS.home,
          url: routeUrl.dashboard,
        },
      ],
    },
    {
      menuLabel: 'Draft',
      id: 'smart_draft',
      subMenu: [
        {
          id: 'home',
          label: 'Draft Summary',
          toShow: true,
          icon: SD_ICON_COMPONENTS.dhome,
          url: routeUrl.dashboard,
        },
        {
          id: 'draft_pick',
          label: 'Draft Picks',
          toShow: true,
          icon: SD_ICON_COMPONENTS.picks,
          url: routeUrl.draftPick,
        },
        {
          id: 'player_ranking',
          label: 'Talent Order',
          toShow: true,
          icon: SD_ICON_COMPONENTS.order,
          url: routeUrl.playerRanking,
        },
        {
          id: 'trade_analysis',
          label: 'Trade Analysis',
          toShow: true,
          icon: SD_ICON_COMPONENTS.trade,
          url: routeUrl.tradeAnalysis,
          badge: sidebarBadges['tradeOffers'], // Example of using dynamic badge
        },
        {
          id: 'scenario_planner',
          label: 'Scenario Planner',
          toShow: true,
          icon: SD_ICON_COMPONENTS.scenario,
          url: routeUrl.scenarioPlanning,
        },
        {
          id: 'project_list',
          label: 'Project List',
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
          id: 'players_home',
          label: 'Players Home',
          toShow: false,
          icon: SD_ICON_COMPONENTS.home,
          url: routeUrl.playerHome,
        },
        {
          id: 'player_reports',
          label: 'Player Reports',
          toShow: false,
          icon: SD_ICON_COMPONENTS.notes,
          url: routeUrl.playerReports,
        },
        {
          id: 'player_profile',
          label: 'Player Profile',
          toShow: true,
          icon: SD_ICON_COMPONENTS.player,
          url: routeUrl.playerProfile,
        },
        {
          id: 'draft_board',
          label: 'Draft Board',
          toShow: true,
          icon: SD_ICON_COMPONENTS.board,
          url: routeUrl.draftBoard,
        },
        {
          id: 'player_database',
          label: 'Player Database',
          toShow: true,
          icon: SD_ICON_COMPONENTS.database,
          url: routeUrl.playerDatabase,
        },
        {
          id: 'player_manager',
          label: 'Player Manager',
          toShow: true,
          icon: SD_ICON_COMPONENTS.player,
          url: routeUrl.playerManager,
        },
      ],
    },
    {
      id: 'smart_list',
      menuLabel: 'List',
      hide: false,
      subMenu: [
        {
          id: 'club_summary',
          label: 'Club Summary',
          toShow: true,
          icon: SD_ICON_COMPONENTS.list,
          url: routeUrl.smartList,
        },
        {
          id: 'contract_status',
          label: 'Contract Status',
          toShow: false,
          icon: SD_ICON_COMPONENTS.contracts,
          url: routeUrl.contractStatus,
        },
        {
          id: 'tpp',
          label: 'TPP',
          toShow: false,
          icon: SD_ICON_COMPONENTS.contracts,
          url: routeUrl.tpp,
        },
        {
          id: 'list_projection',
          label: 'List Projection',
          toShow: false,
          icon: SD_ICON_COMPONENTS.projection,
          url: routeUrl.listProjection,
        },
      ],
    },
    {
      id: 'settings',
      menuLabel: 'Settings',
      hide: !isStaff,
      subMenu: [
        {
          id: 'organisation',
          label: 'Organisations',
          toShow: isStaff,
          icon: SD_ICON_COMPONENTS.building,
          url: routeUrl.organisation,
        },
        {
          id: 'users',
          label: 'Users',
          toShow: isStaff,
          icon: SD_ICON_COMPONENTS.player,
          url: '/users',
        },
        {
          id: 'permissions',
          label: 'Permissions',
          toShow: isStaff,
          icon: SD_ICON_COMPONENTS.shield,
          url: '/permissions',
        },
      ],
    },
  ];
}
