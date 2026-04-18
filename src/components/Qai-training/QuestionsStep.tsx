import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { AITrainingState } from "./types";

interface Props {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
}

export function QuestionsStep({ state, update }: Props) {
  const [newQ, setNewQ] = useState("");
  const [newTrigger, setNewTrigger] = useState("");

  const addQuestion = () => {
    if (newQ.trim() && !state.questions.includes(newQ.trim())) {
      update("questions", [...state.questions, newQ.trim()]);
      setNewQ("");
    }
  };

  const removeQuestion = (i: number) => update("questions", state.questions.filter((_, j) => j !== i));

  const addTrigger = () => {
    if (newTrigger.trim() && !state.escalationTriggers.includes(newTrigger.trim())) {
      update("escalationTriggers", [...state.escalationTriggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  const removeTrigger = (i: number) => update("escalationTriggers", state.escalationTriggers.filter((_, j) => j !== i));

  return (
    <div className="space-y-5">
      {/* Questions */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Qualifying Questions</p>
        {state.questions.map((q, i) => (
          <div key={i} className="flex items-center gap-2 p-3 border rounded-xl">
            <span className="flex-1 text-sm">{q}</span>
            <button onClick={() => removeQuestion(i)}><X className="w-4 h-4 text-muted-foreground hover:text-destructive" /></button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input placeholder="Add a question..." value={newQ} onChange={(e) => setNewQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addQuestion()} className="h-11 rounded-xl" />
          <Button variant="outline" onClick={addQuestion} className="h-11 rounded-xl shrink-0"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </div>

      {/* Escalation triggers */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Escalation Triggers</p>
        <div className="flex flex-wrap gap-2">
          {state.escalationTriggers.map((t, i) => (
            <span key={i} className="flex items-center gap-1 bg-muted text-sm px-3 py-1 rounded-full">
              {t}
              <button onClick={() => removeTrigger(i)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="e.g. speak to manager" value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTrigger()} className="h-11 rounded-xl" />
          <Button variant="outline" onClick={addTrigger} className="h-11 rounded-xl shrink-0"><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </div>
      </div>
    </div>
  );
}
