import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Phone,
  Bot,
  Brain,
  PhoneCall,
  Users,
  CreditCard,
  Settings,
  Headphones,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const mainMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Phone Numbers", icon: Phone, path: "/phone-numbers" },
  { label: "AI Agents", icon: Bot, path: "/ai-agents" },
  { label: "AI Training", icon: Brain, path: "/ai-training" },
  { label: "Calls", icon: PhoneCall, path: "/calls" },
  { label: "Customers", icon: Users, path: "/customers" },
];

const otherMenu = [
  { label: "Billing", icon: CreditCard, path: "/billing" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  const linkClass = (path: string) => {
    const active = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-secondary"
    } ${collapsed ? "justify-center" : ""}`;
  };

  return (
    <aside
      className={`flex flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Headphones className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-lg text-foreground">Vernal</span>}
      </div>

      {/* Main menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
            Main Menu
          </p>
        )}
        {mainMenu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        <div className="pt-4">
          {!collapsed && (
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
              Others
            </p>
          )}
          {otherMenu.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer usage */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-sidebar-border">
          <p className="text-xs font-semibold text-primary">Pro Plan</p>
          <p className="text-xs text-muted-foreground">1,847 / 2,000 calls</p>
          <Progress value={92} className="mt-2 h-2" />
        </div>
      )}
    </aside>
  );
}
