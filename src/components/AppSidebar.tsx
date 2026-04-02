import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Phone,
  Bot,
  PhoneCall,
  Users,
  CreditCard,
  Settings,
  Headphones,
  HelpCircle,
  Brain,
} from "lucide-react";

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
  { label: "Help Center", icon: HelpCircle, path: "/help" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
      isActive(path)
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    } ${collapsed ? "justify-center px-2" : ""}`;

  const sectionTitle = (title: string) =>
    !collapsed ? (
      <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5 mt-5 text-[hsl(var(--sidebar-muted))]">
        {title}
      </p>
    ) : <div className="mt-4" />;

  return (
    <aside
      className={`flex flex-col bg-sidebar h-screen sticky top-0 transition-all duration-200 border-r border-sidebar-border ${
        collapsed ? "w-[60px]" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Headphones className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[15px] text-sidebar-primary-foreground tracking-tight">
            Vernal
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {sectionTitle("Menu")}
        {mainMenu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
            <item.icon className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {sectionTitle("Settings")}
        {otherMenu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
            <item.icon className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              AH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-primary-foreground truncate">
                Anwar Hussen
              </p>
              <p className="text-[11px] text-[hsl(var(--sidebar-muted))] truncate">
                anwar@vernal.ai
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
