import { Volume2 } from "lucide-react";
import aiAvatar from "@/assets/ai-avatar.png";

export function AvatarDisplay() {
  return (
    <div className="relative">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/10">
        <img src={aiAvatar} alt="AI Assistant" className="w-full h-full object-cover" />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background border rounded-full px-2 py-1 shadow-sm">
        <div className="flex gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          ))}
        </div>
        <Volume2 className="w-3.5 h-3.5 text-foreground" />
      </div>
    </div>
  );
}
