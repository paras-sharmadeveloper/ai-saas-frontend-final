import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CreditCard, CheckCircle, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";
import { billingService } from "@/services/billingService";
import { dashboardService, type DashboardData } from "@/services/dashboardService";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

const BUSINESS_TYPES = ["E-commerce", "SaaS", "Agency", "Healthcare", "Real Estate", "Education", "Finance", "Retail", "Other"];
const HEARD_FROM = ["Google Search", "Social Media", "Friend / Referral", "Blog / Article", "Advertisement", "Other"];

const STEPS = [
  { id: 1, label: "Company Info", icon: Building2 },
  { id: 2, label: "Choose Plan", icon: CreditCard },
  { id: 3, label: "All Set!", icon: CheckCircle },
];

const PLANS = [
  { id: "pro", label: "Pro", price: "$49", desc: "For growing businesses", features: ["5 AI Agents", "2,000 calls/month"], popular: true },
  { id: "enterprise", label: "Enterprise", price: "$199", desc: "For large teams", features: ["Unlimited Agents", "Unlimited calls"] },
];

// Stripe payment form component
function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });
      if (error) {
        toast.error(error.message ?? "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        await billingService.confirmPayment(paymentIntent.id);
        toast.success("Payment successful!");
        onSuccess();
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="overflow-y-auto max-h-[300px] pr-1">
        <PaymentElement />
      </div>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!stripe || processing}>
        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Pay Now
      </Button>
    </form>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [assignedNumber, setAssignedNumber] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Guard: if already has phone number → go straight to dashboard
  useEffect(() => {
    dashboardService
      .getData()
      .then((d) => {

        // Always redirect to onboarding if no phone number assigned — no bypass
        if (d.phone_numbers?.length) {
          navigate("/dashboard", { replace: true });
        }

      })
      .catch(() => toast.error("Failed to load dashboard"))

  }, []);


  const [form, setForm] = useState({
    company_name: "",
    business_type: "",
    heard_from: "",
    website: "",
  });

  // Step 1: Save company info
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_type || !form.heard_from) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(API_ROUTES.company.onboarding, form);
      setStep(2);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save company info";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Handle plan selection
  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "basic") {
      // Free plan — no payment needed, assign number directly
      await handleFinalizeSetup();
      return;
    }
    setSubmitting(true);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: planId });
      setClientSecret(client_secret);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to initiate payment";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Final step: auto-assign Twilio number
  const handleFinalizeSetup = async () => {
    setSubmitting(true);
    try {
      // Auto-buy a Twilio number
      const res = await api.post(API_ROUTES.twilio.buyNumber, { country: "US" });
      const number = res.data?.phone_number ?? res.data?.number ?? null;
      setAssignedNumber(number);
      localStorage.setItem("onboarded", "true");
      setStep(3);
    } catch {
      localStorage.setItem("onboarded", "true");
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const goToDashboard = () => navigate("/dashboard", { replace: true });

  // Auto-redirect after step 3
  useEffect(() => {
    if (step !== 3) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); navigate("/dashboard", { replace: true }); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Lyraa</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome to Lyraa</h1>
          <p className="text-muted-foreground mt-1 text-sm">Let's get your AI voice agent set up in minutes</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${step === s.id ? "bg-primary text-primary-foreground" :
                step > s.id ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}>
                <s.icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Company Info */}
        {step === 1 && (
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Company Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    required
                    value={form.company_name}
                    onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Business Type <span className="text-destructive">*</span></Label>
                  <Select required value={form.business_type} onValueChange={(v) => setForm((f) => ({ ...f, business_type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select your business type" /></SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Website <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Input
                    placeholder="https://yourcompany.com"
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>How did you hear about us? <span className="text-destructive">*</span></Label>
                  <Select required value={form.heard_from} onValueChange={(v) => setForm((f) => ({ ...f, heard_from: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                    <SelectContent>
                      {HEARD_FROM.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <div className="space-y-4">
            {!clientSecret ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PLANS.map((p) => (
                    <Card
                      key={p.id}
                      className={`shadow-sm cursor-pointer transition-all ${selectedPlan === p.id ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/40"}`}
                      onClick={() => setSelectedPlan(p.id)}
                    >
                      <CardContent className="pt-5 space-y-3">
                        {p.popular && <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">Most Popular</div>}
                        <div>
                          <h3 className="font-bold">{p.label}</h3>
                          <p className="text-xs text-muted-foreground">{p.desc}</p>
                          <p className="text-2xl font-bold mt-2">{p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                        </div>
                        <ul className="space-y-1">
                          {p.features.map((f) => (
                            <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-success shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={submitting}
                  onClick={() => handlePlanSelect(selectedPlan)}
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedPlan === "basic" ? "Continue with Free Plan" : `Continue with ${PLANS.find((p) => p.id === selectedPlan)?.label}`}
                </Button>
              </>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handleFinalizeSetup} />
                  </Elements>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Full-screen Celebration */}
        {step === 3 && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center text-center p-6 overflow-hidden">
            {/* Stars scattered full screen */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.6 + Math.random() * 1.2}s`,
                    opacity: 0.8,
                  }}
                >
                  {["⭐", "✨", "🌟", "💫", "🎉", "🎊"][Math.floor(Math.random() * 6)]}
                </span>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md space-y-6">
              <CheckCircle className="w-24 h-24 text-success mx-auto" />
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome to Lyraa{form.company_name ? `, ${form.company_name}` : ""}! 🎉
                </h1>
                <p className="text-muted-foreground mt-3">
                  Your AI voice agent is ready to go.
                  {assignedNumber && (
                    <> Your assigned number is <span className="font-semibold text-foreground">{assignedNumber}</span>.</>
                  )}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard in <span className="font-bold text-foreground text-lg">{countdown}</span>s...
              </p>
              <Button
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-xl"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Go to Dashboard Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
