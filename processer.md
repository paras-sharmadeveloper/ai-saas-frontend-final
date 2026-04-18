
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import aiAvatar from "@/assets/ai-avatar.png";
import { WelcomeStep } from "@/components/ai-training/WelcomeStep";
import { CompanyStep } from "@/components/ai-training/CompanyStep";
import { ServicesStep } from "@/components/ai-training/ServicesStep";
import { ToneStep } from "@/components/ai-training/ToneStep";
import { QuestionsStep } from "@/components/ai-training/QuestionsStep";
import { ReviewStep } from "@/components/ai-training/ReviewStep";
import { StepIndicator } from "@/components/ai-training/StepIndicator";
import { AvatarDisplay } from "@/components/ai-training/AvatarDisplay";
import { generateSystemPrompt } from "@/components/ai-training/generatePrompt";
import type { AITrainingState, Step, ServiceItem } from "@/components/ai-training/types";
import { Volume2 } from "lucide-react";

const STEPS: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "company", label: "Company Info" },
  { key: "services", label: "Services" },
  { key: "tone", label: "Voice & Tone" },
  { key: "questions", label: "Questions" },
  { key: "review", label: "Launch" },
];

const AI_MESSAGES: Record<Step, string> = {
  welcome: "Hey, I'm Vernal AI! 👋\nI'll help you set up your AI agent. Let's start — what's your company name?",
  company: "Great! Now tell me a bit more about your company. What's your website URL and a short description?",
  services: "I need to know what services you offer so I can handle calls properly. Add up to 5 services below.",
  tone: "Customize how I sound. Choose a tone, language, voice, and give me a name!",
  questions: "What qualifying questions should I ask callers? Also set escalation triggers and call goals.",
  review: "Thanks for sharing all that! 🎉\nEverything looks great. Review and launch your AI agent.",
};

export default function AITraining() {
  const [step, setStep] = useState<Step>("welcome");
  const [state, setState] = useState<AITrainingState>({
    companyName: "",
    website: "",
    description: "",
    scannedContent: "",
    services: [],
    tone: "friendly",
    language: "english",
    agentName: "",
    selectedVoiceId: "",
    questions: ["What is your budget?", "When do you need this?"],
    escalationTriggers: ["speak to someone", "human", "manager"],
    callGoal: "lead_generation",
  });
  const [saving, setSaving] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState("");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const generatedPrompt = useMemo(() => generateSystemPrompt(state), [state]);

  useEffect(() => {
    if (!isEditingPrompt) setEditablePrompt(generatedPrompt);
  }, [generatedPrompt, isEditingPrompt]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].key);
  };
  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].key);
  };

  const update = <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleLaunch = () => {
    setSaving(true);
    const payload = {
      ...state,
      systemPrompt: isEditingPrompt ? editablePrompt : generatedPrompt,
    };
    console.log("Creating agent with:", payload);
    setTimeout(() => {
      setSaving(false);
      toast.success("AI Agent configured successfully! 🚀");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] relative">
      <StepIndicator steps={STEPS} currentIndex={stepIndex} onStepClick={(key) => setStep(key)} />

      <div ref={contentRef} className="flex-1 flex flex-col items-center justify-start w-full max-w-2xl px-4 py-6 space-y-6 overflow-y-auto">
        <AvatarDisplay />

        <p className="text-center text-lg md:text-xl font-medium max-w-md whitespace-pre-line">
          {AI_MESSAGES[step]}
        </p>

        <div className="w-full max-w-lg space-y-4">
          {step === "welcome" && (
            <WelcomeStep onSubmit={(name) => { update("companyName", name); goNext(); }} />
          )}
          {step === "company" && (
            <CompanyStep state={state} update={update} />
          )}
          {step === "services" && (
            <ServicesStep services={state.services} onChange={(s) => update("services", s)} />
          )}
          {step === "tone" && (
            <ToneStep state={state} update={update} />
          )}
          {step === "questions" && (
            <QuestionsStep state={state} update={update} />
          )}
          {step === "review" && (
            <ReviewStep
              state={state}
              prompt={isEditingPrompt ? editablePrompt : generatedPrompt}
              isEditingPrompt={isEditingPrompt}
              onToggleEdit={() => setIsEditingPrompt(!isEditingPrompt)}
              onPromptChange={setEditablePrompt}
            />
          )}
        </div>
      </div>

      {step !== "welcome" && (
        <div className="flex items-center gap-4 pb-6">
          <Button size="icon" variant="outline" className="rounded-full h-12 w-12" onClick={goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {step === "review" ? (
            <Button className="rounded-full h-12 w-12" size="icon" onClick={handleLaunch} disabled={saving}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            </Button>
          ) : (
            <Button className="rounded-full h-12 w-12" size="icon" onClick={goNext}>
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}



<!-- Step Indicator  -->

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


<!-- AvatarDisplay -->

import { Volume2 } from "lucide-react";
import aiAvatar from "@/assets/ai-avatar.png";

export function AvatarDisplay() {
  return (
    <div className="relative">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/10">
        <img src={aiAvatar} alt="AI Assistant" className="w-full h-full object-cover" />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background border rounded-full px-2 py-1 shadow-sm">
        <div className="flex gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          ))}
        </div>
        <Volume2 className="w-3.5 h-3.5 text-foreground" />
      </div>
    </div>
  );
}


<!-- WelcomeStep -->


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type Props = { onSubmit: (name: string) => void };

export function WelcomeStep({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
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


<!-- CompanyStep -->

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


<!-- ServicesStep -->

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { ServiceItem } from "./types";

const SUGGESTED = [
  "Customer Support", "Lead Qualification", "Appointment Booking",
  "Sales Inquiry", "Technical Support", "Billing Support",
];

type Props = {
  services: ServiceItem[];
  onChange: (s: ServiceItem[]) => void;
};

export function ServicesStep({ services, onChange }: Props) {
  const [newName, setNewName] = useState("");

  const addService = (name: string) => {
    if (!name.trim() || services.length >= 5 || services.some((s) => s.name === name)) return;
    onChange([...services, { name, description: "" }]);
    setNewName("");
  };

  const removeService = (name: string) => onChange(services.filter((s) => s.name !== name));

  const updateDesc = (name: string, desc: string) =>
    onChange(services.map((s) => (s.name === name ? { ...s, description: desc } : s)));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.name} className="p-3 border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="px-3 py-1 text-sm">{s.name}</Badge>
              <button onClick={() => removeService(s.name)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            <Input
              placeholder="What does this service involve?"
              value={s.description}
              onChange={(e) => updateDesc(s.name, e.target.value)}
              className="h-9 text-sm rounded-lg"
            />
          </div>
        ))}
      </div>

      {services.length < 5 && (
        <div className="flex gap-2">
          <Input
            placeholder="Add service..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addService(newName.trim())}
            className="h-10 rounded-xl text-sm"
          />
          <Button variant="outline" onClick={() => addService(newName.trim())} className="h-10 rounded-xl shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Suggested</span>
        {SUGGESTED.filter((s) => !services.some((sv) => sv.name === s)).slice(0, 4).map((s) => (
          <Button key={s} size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => addService(s)} disabled={services.length >= 5}>
            <Plus className="w-3 h-3 mr-1" /> {s}
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{services.length}/5 services added</p>
    </div>
  );
}


<!-- ToneStep -->

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, Loader2 } from "lucide-react";
import type { AITrainingState } from "./types";

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { id: "professional", label: "Professional", desc: "Formal and business-like" },
  { id: "casual", label: "Casual", desc: "Relaxed and conversational" },
];

const LANGUAGES = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "hinglish", label: "Hinglish" },
];

type VoiceInfo = { voice_id: string; name: string; gender: string; accent: string; preview_url?: string };

const MOCK_VOICES: VoiceInfo[] = [
  { voice_id: "v1", name: "Sarah", gender: "female", accent: "American, warm", preview_url: "" },
  { voice_id: "v2", name: "Emily", gender: "female", accent: "British, professional", preview_url: "" },
  { voice_id: "v3", name: "Priya", gender: "female", accent: "Indian, friendly", preview_url: "" },
  { voice_id: "v4", name: "James", gender: "male", accent: "American, confident", preview_url: "" },
  { voice_id: "v5", name: "Oliver", gender: "male", accent: "British, calm", preview_url: "" },
  { voice_id: "v6", name: "Raj", gender: "male", accent: "Indian, energetic", preview_url: "" },
];

type Props = {
  state: AITrainingState;
  update: <K extends keyof AITrainingState>(key: K, value: AITrainingState[K]) => void;
};

export function ToneStep({ state, update }: Props) {
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [voiceError, setVoiceError] = useState(false);
  const [voiceTab, setVoiceTab] = useState<"female" | "male">("female");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to GET /api/elevenlabs/voices
    const timer = setTimeout(() => {
      setVoices(MOCK_VOICES);
      setLoadingVoices(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredVoices = voices.filter((v) => v.gender === voiceTab);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Tone */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Tone</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => update("tone", t.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                state.tone === t.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="font-semibold text-sm">{t.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Language</p>
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => update("language", l.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                state.language === l.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Name */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Agent Name</p>
        <Input
          placeholder="What should the agent call itself? (e.g. Aria, Max)"
          value={state.agentName}
          onChange={(e) => update("agentName", e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      {/* Voice Selection */}
      <div>
        <p className="text-sm font-medium mb-2 text-muted-foreground">Voice</p>
        <div className="flex gap-2 mb-3">
          {(["female", "male"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setVoiceTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                voiceTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab === "female" ? "Female Voices" : "Male Voices"}
            </button>
          ))}
        </div>

        {loadingVoices ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : voiceError ? (
          <div className="p-4 border border-destructive/30 rounded-xl text-sm text-destructive text-center">
            Unable to load voices, please try again
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredVoices.map((v) => (
              <button
                key={v.voice_id}
                onClick={() => update("selectedVoiceId", v.voice_id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  state.selectedVoiceId === v.voice_id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{v.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(v.voice_id); }}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                  >
                    {playingId === v.voice_id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">{v.accent}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

<!-- QuestionsStep -->


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


<!-- ReviewStep -->


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
