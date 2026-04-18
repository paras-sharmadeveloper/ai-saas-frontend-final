import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { AITrainingState } from "./types";

interface Props {
  state: AITrainingState;
  prompt: string;
  isEditingPrompt: boolean;
  onToggleEdit: () => void;
  onPromptChange: (v: string) => void;
}

export function ReviewStep({ state, prompt, isEditingPrompt, onToggleEdit, onPromptChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="p-4 border rounded-xl space-y-2">
        {[
          ["Company", state.companyName],
          ["Website", state.website],
          ["Agent Name", state.agentName],
          ["Tone", state.tone],
          ["Language", state.language],
          ["Goal", state.callGoal?.replace("_", " ")],
          ["Services", state.services.length ? `${state.services.length} added` : "—"],
          ["Questions", state.questions.length ? `${state.questions.length} added` : "—"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium capitalize">{value || "—"}</span>
          </div>
        ))}
      </div>

      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">System Prompt</span>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={onToggleEdit}>
            <Pencil className="w-3 h-3" />
            {isEditingPrompt ? "Auto" : "Edit"}
          </Button>
        </div>
        {isEditingPrompt ? (
          <Textarea className="text-xs min-h-[120px] font-mono" value={prompt} onChange={(e) => onPromptChange(e.target.value)} />
        ) : (
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/40 rounded-lg p-3">{prompt}</pre>
        )}
      </div>
    </div>
  );
}
