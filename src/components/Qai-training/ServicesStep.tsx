import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const SUGGESTED = ["Customer Support", "Lead Qualification", "Appointment Booking", "Sales Inquiry", "Technical Support", "Billing Support"];

interface Props {
  services: string[];
  onChange: (services: string[]) => void;
}

export function ServicesStep({ services, onChange }: Props) {
  const [newService, setNewService] = useState("");

  const add = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !services.includes(trimmed)) onChange([...services, trimmed]);
    setNewService("");
  };

  const remove = (s: string) => onChange(services.filter((x) => x !== s));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-4 border rounded-xl min-h-[60px]">
        {services.map((s) => (
          <Badge key={s} variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
            {s}
            <button onClick={() => remove(s)}><X className="w-3 h-3" /></button>
          </Badge>
        ))}
        <div className="flex gap-1.5 items-center">
          <Input
            placeholder="Add service..."
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add(newService)}
            className="h-8 w-40 border-dashed text-sm"
          />
          <Button size="sm" variant="ghost" onClick={() => add(newService)} className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Suggested</span>
        {SUGGESTED.filter((s) => !services.includes(s)).slice(0, 4).map((s) => (
          <Button key={s} size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => add(s)}>
            <Plus className="w-3 h-3 mr-1" /> {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
