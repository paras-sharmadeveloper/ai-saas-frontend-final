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
  HelpCircle,
  Mic,
  AudioWaveform,
  Music,
  Video,
  Layers,
  Radio,
} from "lucide-react";

const mainMenu = [
  { label: "Home", icon: LayoutDashboard, path: "/" },
  { label: "Explore Voices", icon: Mic, path: "/ai-agents" },
  { label: "Text to Speech", icon: AudioWaveform, path: "/ai-training" },
  { label: "Voice Changer", icon: Music, path: "/calls" },
  { label: "Sound Effects", icon: Layers, path: "/phone-numbers" },
  { label: "Image & Video", icon: Video, path: "/customers" },
  { label: "Voice Isolator", icon: Radio, path: "/voice-isolator" },
];

const productsMenu = [
  { label: "Studio", icon: Bot, path: "/studio" },
  { label: "Dubbing", icon: Brain, path: "/dubbing" },
  { label: "Music", icon: Music, path: "/music" },
  { label: "Productions", icon: PhoneCall, path: "/productions" },
];

const otherMenu = [
  { label: "Help Center", icon: HelpCircle, path: "/help" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
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
      className={`flex flex-col bg-sidebar h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? "w-[60px]" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Headphones className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[15px] text-sidebar-primary-foreground tracking-tight">
            Vernal
          </span>
        )}
      </div>

      {/* Creative Platform label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <div className="flex items-center gap-2 text-sidebar-primary text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-sidebar-primary" />
            Creative Platform
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto">
        {sectionTitle("Main Menu")}
        {mainMenu.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass(item.path)}>
            <item.icon className="w-[17px] h-[17px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {sectionTitle("Products")}
        {productsMenu.map((item) => (
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
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground text-xs font-bold shrink-0">
              AH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-primary-foreground truncate">
                Anwar Hussen
              </p>
              <p className="text-[11px] text-[hsl(var(--sidebar-muted))] truncate">
                anwarhussen38@gm...
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
