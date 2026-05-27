import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  GitCompare,
  FolderKanban,
  Home,
  ClipboardList,
  Database,
  Users,
  Building2,
  ListChecks,
  BarChart3,
  FileSignature,
  Settings,
  Shield,
} from 'lucide-react';
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
          icon: LayoutDashboard,
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
          icon: LayoutDashboard,
          url: routeUrl.dashboard,
        },
        {
          id: 'draft_pick',
          label: 'Draft Picks',
          toShow: true,
          icon: FileText,
          url: routeUrl.draftPick,
        },
        {
          id: 'player_ranking',
          label: 'Talent Order',
          toShow: true,
          icon: ClipboardList,
          url: routeUrl.playerRanking,
        },
        {
          id: 'trade_analysis',
          label: 'Trade Analysis',
          toShow: true,
          icon: TrendingUp,
          url: routeUrl.tradeAnalysis,
          badge: sidebarBadges['tradeOffers'], // Example of using dynamic badge
        },
        {
          id: 'scenario_planner',
          label: 'Scenario Planner',
          toShow: true,
          icon: GitCompare,
          url: routeUrl.scenarioPlanning,
        },
        {
          id: 'project_list',
          label: 'Project List',
          toShow: true,
          icon: FolderKanban,
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
          icon: Home,
          url: routeUrl.playerHome,
        },
        {
          id: 'player_reports',
          label: 'Player Reports',
          toShow: false,
          icon: FileSignature,
          url: routeUrl.playerReports,
        },
        {
          id: 'player_profile',
          label: 'Player Profile',
          toShow: true,
          icon: ClipboardList,
          url: routeUrl.playerProfile,
        },
        {
          id: 'draft_board',
          label: 'Draft Board',
          toShow: true,
          icon: ClipboardList,
          url: routeUrl.draftBoard,
        },
        {
          id: 'player_database',
          label: 'Player Database',
          toShow: true,
          icon: Database,
          url: routeUrl.playerDatabase,
        },
        {
          id: 'player_manager',
          label: 'Player Manager',
          toShow: true,
          icon: Users,
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
          icon: Building2,
          url: routeUrl.smartList,
        },
        {
          id: 'contract_status',
          label: 'Contract Status',
          toShow: false,
          icon: FileSignature,
          url: routeUrl.contractStatus,
        },
        {
          id: 'tpp',
          label: 'TPP',
          toShow: false,
          icon: BarChart3,
          url: routeUrl.tpp,
        },
        {
          id: 'list_projection',
          label: 'List Projection',
          toShow: false,
          icon: ListChecks,
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
          icon: Building2,
          url: routeUrl.organisation,
        },
        {
          id: 'users',
          label: 'Users',
          toShow: isStaff,
          icon: Users,
          url: '/users',
        },
        {
          id: 'permissions',
          label: 'Permissions',
          toShow: isStaff,
          icon: Shield,
          url: '/permissions',
        },
      ],
    },
  ];
}
