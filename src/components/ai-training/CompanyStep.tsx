import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, CheckCircle2 } from "lucide-react";
import type { AITrainingState } from "./types";

type Props = {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
};

export function CompanyStep({ state, update }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(!!state.scannedContent);

  const handleScan = () => {
    if (!state.website.trim()) return;
    setScanning(true);
    // Simulate website scanning
    setTimeout(() => {
      update("scannedContent", `Scanned content from ${state.website}`);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Company name"
        value={state.companyName}
        onChange={(e) => update("companyName", e.target.value)}
        className="h-11 rounded-xl"
      />
      <div className="flex gap-2">
        <Input
          placeholder="Website URL (e.g. https://example.com)"
          value={state.website}
          onChange={(e) => { update("website", e.target.value); setScanned(false); }}
          className="h-11 rounded-xl flex-1"
        />
        <Button
          variant="outline"
          className="h-11 rounded-xl shrink-0 gap-2"
          onClick={handleScan}
          disabled={scanning || !state.website.trim()}
        >
          {scanning ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
          ) : scanned ? (
            <><CheckCircle2 className="w-4 h-4 text-primary" /> Scanned</>
          ) : (
            <><Globe className="w-4 h-4" /> Scan Website</>
          )}
        </Button>
      </div>
      {scanning && (
        <p className="text-xs text-muted-foreground animate-pulse">Scanning your website...</p>
      )}
      {scanned && !scanning && (
        <p className="text-xs text-primary flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Website scanned! I'll use this to train your agent.
        </p>
      )}
      <Input
        placeholder="Short description of your business"
        value={state.description}
        onChange={(e) => update("description", e.target.value)}
        className="h-11 rounded-xl"
      />
    </div>
  );
}
