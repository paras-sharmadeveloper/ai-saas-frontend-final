import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Bell, Search, PanelLeft, ChevronDown, Sparkles, ArrowUpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { useAppSelector } from "@/redux/hooks";


export default function DashboardLayout() {
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");
    navigate("/login");
  };
  const user = useAppSelector((state) => state.auth.user);

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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="w-8 h-8 bg-warning text-warning-foreground">
                  <AvatarFallback className="bg-warning text-warning-foreground text-sm font-semibold">{user?.name
                    ? user.name
                      .split(" ")
                      .map((n) => n[0])
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
