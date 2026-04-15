import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Volume2, Send, ArrowLeft, ArrowRight, Check, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import aiAvatar from "@/assets/ai-avatar.png";

type Step = "welcome" | "company" | "services" | "tone" | "questions" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "company", label: "Company Info" },
  { key: "services", label: "Services" },
  { key: "tone", label: "Voice & Tone" },
  { key: "questions", label: "Questions" },
  { key: "review", label: "Launch" },
];

const SUGGESTED_SERVICES = [
  "Customer Support", "Lead Qualification", "Appointment Booking",
  "Sales Inquiry", "Technical Support", "Billing Support",
];

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { id: "professional", label: "Professional", desc: "Formal and business-like" },
  { id: "casual", label: "Casual", desc: "Relaxed and conversational" },
];

const AI_MESSAGES: Record<Step, string> = {
  welcome: "Hey, I'm Vernal AI! 👋\nI'll help you set up your AI agent. Let's start — what's your company name?",
  company: "Great! Now tell me a bit more about your company. What's your website URL and a short description?",
  services: "I need to know what services you offer so I can handle calls properly. Add your services below.",
  tone: "You can customize how I sound. Choose a tone that suits your business best.",
  questions: "What qualifying questions should I ask callers? Add questions I should ask to understand their needs.",
  review: "Thanks for sharing all that! 🎉\nEverything looks great. You can review and launch your AI agent.",
};

export default function AITraining() {
  const [step, setStep] = useState<Step>("welcome");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [tone, setTone] = useState("friendly");
  const [questions, setQuestions] = useState<string[]>(["What is your budget?", "When do you need this?"]);
  const [newQuestion, setNewQuestion] = useState("");
  const [saving, setSaving] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].key);
  };
  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].key);
  };

  const handleWelcomeSubmit = () => {
    if (!inputValue.trim()) return;
    setCompanyName(inputValue.trim());
    setInputValue("");
    goNext();
  };

  const handleLaunch = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("AI Agent configured successfully! 🚀");
    }, 1500);
  };

  const addService = (s: string) => {
    if (s && !services.includes(s)) setServices([...services, s]);
    setNewService("");
  };

  const addQuestion = () => {
    if (newQuestion.trim() && !questions.includes(newQuestion.trim())) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] relative">
      {/* Step indicator */}
      <div className="flex items-center gap-3 pt-4 pb-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.key)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                i <= stepIndex ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                i < stepIndex ? "bg-primary border-primary text-primary-foreground" :
                i === stepIndex ? "border-primary text-primary" :
                "border-muted-foreground/30 text-muted-foreground"
              }`}>
                {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden md:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 rounded ${i < stepIndex ? "bg-primary" : "bg-muted-foreground/20"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-4 py-6 space-y-6">
        {/* Avatar */}
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

        {/* AI message */}
        <p className="text-center text-lg md:text-xl font-medium max-w-md whitespace-pre-line">
          {AI_MESSAGES[step]}
        </p>

        {/* Step content */}
        <div className="w-full max-w-lg space-y-4">
          {step === "welcome" && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter your company name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleWelcomeSubmit()}
                className="h-12 rounded-full px-5 text-base"
              />
              <Button size="icon" className="h-12 w-12 rounded-full shrink-0" onClick={handleWelcomeSubmit}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === "company" && (
            <div className="space-y-3">
              <Input
                placeholder="Company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 rounded-xl"
              />
              <Input
                placeholder="Website URL (e.g. https://example.com)"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="h-11 rounded-xl"
              />
              <Input
                placeholder="Short description of your business"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          )}

          {step === "services" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 p-4 border rounded-xl min-h-[60px]">
                {services.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 px-3 py-1.5 text-sm">
                    {s}
                    <button onClick={() => setServices(services.filter((x) => x !== s))}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <div className="flex gap-1.5 items-center">
                  <Input
                    placeholder="Add service..."
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addService(newService.trim())}
                    className="h-8 w-40 border-dashed text-sm"
                  />
                  <Button size="sm" variant="ghost" onClick={() => addService(newService.trim())} className="h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Suggested</span>
                {SUGGESTED_SERVICES.filter((s) => !services.includes(s)).slice(0, 4).map((s) => (
                  <Button key={s} size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => addService(s)}>
                    <Plus className="w-3 h-3 mr-1" /> {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === "tone" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    tone === t.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === "questions" && (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 p-3 border rounded-xl">
                  <span className="flex-1 text-sm">{q}</span>
                  <button onClick={() => setQuestions(questions.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                  className="h-11 rounded-xl"
                />
                <Button variant="outline" onClick={addQuestion} className="h-11 rounded-xl shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-3">
              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{companyName || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Website</span>
                  <span className="font-medium">{website || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tone</span>
                  <span className="font-medium capitalize">{tone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium">{services.length} added</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{questions.length} added</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
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
