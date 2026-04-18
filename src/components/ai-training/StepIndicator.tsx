import { Check } from "lucide-react";
import type { Step } from "./types";

type Props = {
  steps: { key: Step; label: string }[];
  currentIndex: number;
  onStepClick: (key: Step) => void;
};

export function StepIndicator({ steps, currentIndex, onStepClick }: Props) {
  return (
    <div className="flex items-center gap-3 pt-4 pb-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <button
            onClick={() => onStepClick(s.key)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              i <= currentIndex ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
              i < currentIndex ? "bg-primary border-primary text-primary-foreground" :
              i === currentIndex ? "border-primary text-primary" :
              "border-muted-foreground/30 text-muted-foreground"
            }`}>
              {i < currentIndex ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className="hidden md:inline">{s.label}</span>
          </button>
          {i < steps.length - 1 && (
            <div className={`w-6 h-0.5 rounded ${i < currentIndex ? "bg-primary" : "bg-muted-foreground/20"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
