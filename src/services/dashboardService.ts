import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface DashboardStats {
  totalCalls: number;
  totalCustomers: number;
  activeAgents: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const { stats, recentActivity } = API_ROUTES.dashboard;

export const dashboardService = {
  getStats: () =>
    api.get<DashboardStats>(stats).then((r) => r.data),

  getRecentActivity: () =>
    api.get<RecentActivity[]>(recentActivity).then((r) => r.data),
};
