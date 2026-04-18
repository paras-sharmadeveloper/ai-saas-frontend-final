import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AITrainingState } from "./types";

interface Props {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
}

export function CompanyStep({ state, update }: Props) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Company name"
        value={state.companyName}
        onChange={(e) => update("companyName", e.target.value)}
        className="h-11 rounded-xl"
      />
      <Input
        placeholder="Website URL (e.g. https://example.com)"
        value={state.website}
        onChange={(e) => update("website", e.target.value)}
        className="h-11 rounded-xl"
      />
      <Textarea
        placeholder="Short description of your business"
        value={state.description}
        onChange={(e) => update("description", e.target.value)}
        className="rounded-xl min-h-[80px]"
      />
    </div>
  );
}
