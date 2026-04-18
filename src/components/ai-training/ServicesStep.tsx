import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { ServiceItem } from "./types";

const SUGGESTED = [
  "Customer Support", "Lead Qualification", "Appointment Booking",
  "Sales Inquiry", "Technical Support", "Billing Support",
];

type Props = {
  services: ServiceItem[];
  onChange: (s: ServiceItem[]) => void;
};

export function ServicesStep({ services, onChange }: Props) {
  const [newName, setNewName] = useState("");

  const addService = (name: string) => {
    if (!name.trim() || services.length >= 5 || services.some((s) => s.name === name)) return;
    onChange([...services, { name, description: "" }]);
    setNewName("");
  };

  const removeService = (name: string) => onChange(services.filter((s) => s.name !== name));

  const updateDesc = (name: string, desc: string) =>
    onChange(services.map((s) => (s.name === name ? { ...s, description: desc } : s)));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.name} className="p-3 border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-3 py-1 text-sm">{s.name}</Badge>
              <button onClick={() => removeService(s.name)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            <Input
              placeholder="What does this service involve?"
              value={s.description}
              onChange={(e) => updateDesc(s.name, e.target.value)}
              className="h-9 text-sm rounded-lg"
            />
          </div>
        ))}
      </div>

      {services.length < 5 && (
        <div className="flex gap-2">
          <Input
            placeholder="Add service..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addService(newName.trim())}
            className="h-10 rounded-xl text-sm"
          />
          <Button variant="outline" onClick={() => addService(newName.trim())} className="h-10 rounded-xl shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Suggested</span>
        {SUGGESTED.filter((s) => !services.some((sv) => sv.name === s)).slice(0, 4).map((s) => (
          <Button key={s} size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => addService(s)} disabled={services.length >= 5}>
            <Plus className="w-3 h-3 mr-1" /> {s}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{services.length}/5 services added</p>
    </div>
  );
}
