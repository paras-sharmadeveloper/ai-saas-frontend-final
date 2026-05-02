import { useState,useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { PanelLeft, ChevronDown, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useSubscription } from "@/context/SubscriptionContext";
import { API_ROUTES } from "@/services/apiRoutes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { useAppSelector } from "@/redux/hooks";
import { api } from "@/services/api";

import { dashboardService, type DashboardData } from "@/services/dashboardService";


export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { subscriptionValidation } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");
    navigate("/login");
  };

    useEffect(() => {
      dashboardService
        .getData()
        .then(async (d) => {
          setData(d);
          try {
            const res = await api.get(API_ROUTES.subscription.validate);
            if (res.data?.data === null || res.data?.data === undefined) {
              navigate("/subscribe-plan", { replace: true });
            }
          } catch {
            navigate("/subscribe-plan", { replace: true });
          }
        })
        .catch(() => toast.error("Failed to load dashboard"))
        .finally(() => setLoading(false));
    }, []);
  
  const user = useAppSelector((state: any) => state.auth.user) as { name?: string } | null;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
      hour < 18 ? "Good afternoon" :
        "Good evening";
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground hidden md:inline">
              {greeting}, {user?.name || "User"} 👋
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Subscription Information Banner */}
            {subscriptionValidation?.valid && (
              <>
                {/* Trial Plan */}
                {subscriptionValidation.access_type === "trial" && subscriptionValidation.data.trial_days_left !== undefined && (
                  <button
                    onClick={() => navigate("/subscribe-plan")}
                    className="flex items-center gap-3 px-6 py-2 bg-orange-100 rounded-xl border border-orange-300 w-[420px] hover:bg-orange-200 transition-colors cursor-pointer"
                  >
                    <Clock className="w-6 h-6 text-orange-600" />
                    <span className="text-base font-semibold text-orange-700">
                      {subscriptionValidation.data.trial_days_left} days left
                    </span>
                    <span className="text-sm text-orange-600 hidden lg:inline">
                      · Expires{" "}
                      {subscriptionValidation.data.trial_ends_at && new Date(
                        subscriptionValidation.data.trial_ends_at
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </button>
                )}

                {/* Paid Subscription */}
                {subscriptionValidation.access_type === "subscription" && subscriptionValidation.data.plan_name && (
                  <button
                    onClick={() => navigate("/subscribe-plan")}
                    className="flex items-center gap-3 px-6 py-2 bg-orange-100 rounded-xl border border-orange-300 w-[420px] hover:bg-orange-200 transition-colors cursor-pointer"
                  >
                    <Clock className="w-6 h-6 text-orange-600" />
                    <span className="text-base font-semibold text-orange-700">
                      {subscriptionValidation.data.plan_name} Plan
                    </span>
                    <span className="text-sm text-orange-600 hidden lg:inline">
                      · {subscriptionValidation.data.days_remaining} days left · Renews{" "}
                      {subscriptionValidation.data.ends_at && new Date(
                        subscriptionValidation.data.ends_at
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </button>
                )}
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="w-8 h-8 bg-warning text-warning-foreground">
                  <AvatarFallback className="bg-warning text-warning-foreground text-sm font-semibold">{user?.name
                    ? user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                    : "U"}</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/settings")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/billing")}>Billing</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
