import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  PhoneCall,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

function LyraaMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
        <g transform="translate(2, 12)">
          <rect x="0" y="-2.5" width="2" height="5" rx="1" fill="hsl(var(--sidebar-accent))" opacity="0.85" />
          <rect x="4" y="-5" width="2" height="10" rx="1" fill="#fff" opacity="0.92" />
          <rect x="8" y="-7.5" width="2" height="15" rx="1" fill="#fff" />
          <rect x="12" y="-4" width="2" height="8" rx="1" fill="#fff" opacity="0.92" />
          <rect x="16" y="-6" width="2" height="12" rx="1" fill="#fff" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

const mainMenu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "AI Training", icon: Brain, path: "/ai-training" },
  { label: "Calls", icon: PhoneCall, path: "/calls" },
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
  const isActive = (path) => location.pathname.startsWith(path);
  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    } ${collapsed ? "justify-center px-2" : ""}`;

  const sectionTitle = (title: string) =>
    !collapsed ? (
      <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5 mt-5 text-[hsl(var(--sidebar-muted))]">
        {title}
      </p>
    ) : <div className="mt-4" />;
  const user = useAppSelector((state) => (state.auth as { user: { name?: string; email?: string } | null }).user);
  return (
    <aside
      className={`flex flex-col bg-sidebar h-screen sticky top-0 transition-all duration-200 ${collapsed ? "w-[60px]" : "w-56"
        }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-sidebar-border shrink-0">
        <LyraaMark />
        {!collapsed && (
          <span className="font-bold text-[16px] text-foreground tracking-tight lowercase">
            lyraa
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {sectionTitle("Main Menu")}
        {mainMenu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
            <item.icon className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {sectionTitle("Others")}
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
            <div className="w-8 h-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name
                ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email || "User"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
