import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AITrainingState } from "./types";

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { id: "professional", label: "Professional", desc: "Formal and business-like" },
  { id: "casual", label: "Casual", desc: "Relaxed and conversational" },
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Portuguese"];
const GOALS = [
  { id: "lead_generation", label: "Lead Generation" },
  { id: "customer_support", label: "Customer Support" },
  { id: "appointment_booking", label: "Appointment Booking" },
  { id: "sales", label: "Sales" },
];

interface Props {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
}

export function ToneStep({ state, update }: Props) {
  return (
    <div className="space-y-4">
      {/* Tone selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TONE_OPTIONS.map((t) => (
          <button
            key={t.id}
            onClick={() => update("tone", t.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              state.tone === t.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"
            }`}
          >
            <div className="font-semibold text-sm">{t.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>

      <Input
        placeholder="Agent name (e.g. Aria, Max)"
        value={state.agentName}
        onChange={(e) => update("agentName", e.target.value)}
        className="h-11 rounded-xl"
      />

      <Select value={state.language} onValueChange={(v) => update("language", v)}>
        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Language" /></SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => <SelectItem key={l} value={l.toLowerCase()}>{l}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={state.callGoal} onValueChange={(v) => update("callGoal", v)}>
        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Call Goal" /></SelectTrigger>
        <SelectContent>
          {GOALS.map((g) => <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
