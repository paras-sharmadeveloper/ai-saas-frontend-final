import { api } from "./api";
import { API_ROUTES } from "./apiRoutes";

export interface DashboardStats {
  total_calls: number;
  total_leads: number;
  missed_calls: number;
  avg_duration: string;
  total_customers: number;
}

export interface DashboardPhoneNumber {
  number: string;
  status: string;
  agent_name: string;
}

export interface DashboardRecentCall {
  id: number;
  customer_name: string | null;
  phone: string;
  status: string;
  intent?: string;
  duration?: string;
  date?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  phone_numbers: DashboardPhoneNumber[];
  recent_calls: DashboardRecentCall[];
}

export const dashboardService = {
  getData: () =>
    api.get<DashboardData>(API_ROUTES.dashboard.base).then((r) => r.data),
};
