import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { AITrainingState } from "./types";

const GOAL_LABELS: Record<string, string> = {
  lead_generation: "Lead Generation",
  customer_support: "Customer Support",
  appointment_booking: "Appointment Booking",
  sales: "Sales",
};

type Props = {
  state: AITrainingState;
  prompt: string;
  isEditingPrompt: boolean;
  onToggleEdit: () => void;
  onPromptChange: (v: string) => void;
};

export function ReviewStep({ state, prompt, isEditingPrompt, onToggleEdit, onPromptChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Review card */}
      <div className="p-4 border rounded-xl space-y-2">
        {[
          ["Company", state.companyName || "—"],
          ["Website", state.website || "—"],
          ["Description", state.description || "—"],
          ["Agent Name", state.agentName || "—"],
          ["Tone", state.tone],
          ["Language", state.language],
          ["Services", `${state.services.length} added`],
          ["Questions", `${state.questions.length} added`],
          ["Escalation Triggers", `${state.escalationTriggers.length} set`],
          ["Call Goal", GOAL_LABELS[state.callGoal] || state.callGoal],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium capitalize">{value}</span>
          </div>
        ))}
      </div>

      {/* Prompt preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">System Prompt</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Edit Prompt</span>
            <Switch checked={isEditingPrompt} onCheckedChange={onToggleEdit} />
          </div>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          readOnly={!isEditingPrompt}
          className={`min-h-[200px] rounded-xl text-xs font-mono ${!isEditingPrompt ? "bg-muted/50 cursor-default" : ""}`}
        />
      </div>
    </div>
  );
}
