import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { AITrainingState, CallGoal } from "./types";

const CALL_GOALS: { id: CallGoal; label: string }[] = [
  { id: "lead_generation", label: "Lead Generation" },
  { id: "customer_support", label: "Customer Support" },
  { id: "appointment_booking", label: "Appointment Booking" },
  { id: "sales", label: "Sales" },
];

type Props = {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
};

export function QuestionsStep({ state, update }: Props) {
  const [newQ, setNewQ] = useState("");
  const [newTrigger, setNewTrigger] = useState("");

  const addQuestion = () => {
    if (newQ.trim() && !state.questions.includes(newQ.trim())) {
      update("questions", [...state.questions, newQ.trim()]);
      setNewQ("");
    }
  };

  const addTrigger = () => {
    if (newTrigger.trim() && !state.escalationTriggers.includes(newTrigger.trim())) {
      update("escalationTriggers", [...state.escalationTriggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Qualifying Questions */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Qualifying Questions</p>
        <div className="space-y-2">
          {state.questions.map((q, i) => (
            <div key={i} className="flex items-center gap-2 p-3 border rounded-xl">
              <span className="flex-1 text-sm">{q}</span>
              <button onClick={() => update("questions", state.questions.filter((_, j) => j !== i))}>
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Add a question..."
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addQuestion()}
              className="h-10 rounded-xl"
            />
            <Button variant="outline" onClick={addQuestion} className="h-10 rounded-xl shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Escalation Triggers */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Escalation Triggers</p>
        <p className="text-xs text-muted-foreground mb-2">What should a caller say to be transferred to a human?</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {state.escalationTriggers.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
              "{t}"
              <button onClick={() => update("escalationTriggers", state.escalationTriggers.filter((x) => x !== t))}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder='e.g. "speak to someone"'
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTrigger()}
            className="h-9 rounded-xl text-sm"
          />
          <Button variant="outline" size="sm" onClick={addTrigger} className="h-9 rounded-xl shrink-0">
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Call Goal */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Call Goal</p>
        <div className="grid grid-cols-2 gap-2">
          {CALL_GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => update("callGoal", g.id)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                state.callGoal === g.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
