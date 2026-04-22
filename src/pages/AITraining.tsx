import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WelcomeStep } from "@/components/ai-training/WelcomeStep";
import { CompanyStep } from "@/components/ai-training/CompanyStep";
import { ServicesStep } from "@/components/ai-training/ServicesStep";
import { ToneStep } from "@/components/ai-training/ToneStep";
import { QuestionsStep } from "@/components/ai-training/QuestionsStep";
import { ReviewStep } from "@/components/ai-training/ReviewStep";
import { StepIndicator } from "@/components/ai-training/StepIndicator";
import { AvatarDisplay } from "@/components/ai-training/AvatarDisplay";
import { generateSystemPrompt } from "@/components/ai-training/generatePrompt";
import type { AITrainingState, Step } from "@/components/ai-training/types";
import { aiTrainingService } from "@/services/aiTrainingService";

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

  const handleLaunch = async () => {
    setSaving(true);
    const payload = {
      company_name:  state.companyName,
      business_type: state.services.map(s => s.name).join(", "),
      system_prompt: isEditingPrompt ? editablePrompt : generatedPrompt,
      first_message: `Hi! I'm ${state.agentName || "your AI assistant"}. How can I help you today?`,
      language:      state.language,
      // extra fields stored in DB
      website:              state.website,
      description:          state.description,
      tone:                 state.tone,
      agent_name:           state.agentName,
      selected_voice_id:    state.selectedVoiceId,
      questions:            state.questions,
      escalation_triggers:  state.escalationTriggers,
      call_goal:            state.callGoal,
      services:             state.services,
    };
    try {
      const { api } = await import("@/services/api");
      const { API_ROUTES } = await import("@/services/apiRoutes");
      await api.post(API_ROUTES.agentCreate.create, payload);
      toast.success("AI Agent configured successfully! 🚀");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to save configuration";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
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
