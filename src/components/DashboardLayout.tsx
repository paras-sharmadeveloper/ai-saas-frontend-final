import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Bell, Search, PanelLeft, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-5 bg-card sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-56 h-9 bg-muted border-0 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">AH</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate("/settings")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/billing")}>Billing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login")}>Sign out</DropdownMenuItem>
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
