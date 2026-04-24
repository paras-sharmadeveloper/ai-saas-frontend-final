import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
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
  isGeneratingPrompt: boolean;
  onToggleEdit: () => void;
  onPromptChange: (v: string) => void;
};

export function ReviewStep({ state, prompt, isEditingPrompt, isGeneratingPrompt, onToggleEdit, onPromptChange }: Props) {
  return (
    <div className="space-y-4">
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">System Prompt</p>
          {!isGeneratingPrompt && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Edit Prompt</span>
              <Switch checked={isEditingPrompt} onCheckedChange={onToggleEdit} />
            </div>
          )}
        </div>

        {isGeneratingPrompt ? (
          <div className="min-h-[200px] rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating your AI prompt...</p>
          </div>
        ) : (
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            readOnly={!isEditingPrompt}
            className={`min-h-[200px] rounded-xl text-xs font-mono ${!isEditingPrompt ? "bg-muted/50 cursor-default" : ""
              }`}
          />
        )}
      </div>
    </div>
  );
}