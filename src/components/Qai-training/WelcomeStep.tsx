import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Props {
  onSubmit: (name: string) => void;
}

export function WelcomeStep({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter your company name..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="h-12 rounded-full px-5 text-base"
      />
      <Button size="icon" className="h-12 w-12 rounded-full shrink-0" onClick={handleSubmit}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
