import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { billingService } from "@/services/billingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

function LyraaMark({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-[#4f46e5] flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <g transform="translate(2, 12)">
          <rect x="0" y="-2.5" width="2" height="5" rx="1" fill="#fff" opacity="0.85" />
          <rect x="4" y="-5" width="2" height="10" rx="1" fill="#fff" opacity="0.92" />
          <rect x="8" y="-7.5" width="2" height="15" rx="1" fill="#fff" />
          <rect x="12" y="-4" width="2" height="8" rx="1" fill="#fff" opacity="0.92" />
          <rect x="16" y="-6" width="2" height="12" rx="1" fill="#fff" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

type BillingCycle = "monthly" | "annual" | "test";

interface PlanDef {
  id: string;
  label: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: "$" | "₹";
  features: string[];
  popular?: boolean;
  cta: string;
  tabs: BillingCycle[];
}

const PLANS: PlanDef[] = [
  // --- Monthly / Annual plans ---
  {
    id: "starter",
    label: "Starter",
    subtitle: "For solo operators and new businesses.",
    monthlyPrice: 49,
    annualPrice: 41.65,
    currency: "$",
    features: ["200 minutes/month", "Australian voice", "Calendar sync", "SMS follow-ups", "Email support"],
    cta: "Start free trial",
    tabs: ["monthly", "annual"],
  },
  {
    id: "growth",
    label: "Growth",
    subtitle: "For growing service businesses.",
    monthlyPrice: 129,
    annualPrice: 109.65,
    currency: "$",
    features: ["800 minutes/month", "All Starter features", "CRM integrations", "Invoicing + quoting", "Smart call routing", "Priority support"],
    popular: true,
    cta: "Start free trial",
    tabs: ["monthly", "annual"],
  },
  {
    id: "scale",
    label: "Scale",
    subtitle: "For established operators and teams.",
    monthlyPrice: 349,
    annualPrice: 296.65,
    currency: "$",
    features: ["Unlimited minutes", "All Growth features", "Multi-location", "Custom voice training", "API access", "Dedicated manager"],
    cta: "Book a demo",
    tabs: ["monthly", "annual"],
  },
  // --- Test plans ---
  // {
  //   id: "free",
  //   label: "Free",
  //   subtitle: "Try it out, zero cost.",
  //   monthlyPrice: 0,
  //   annualPrice: 0,
  //   currency: "₹",
  //   features: ["1 AI Agent", "50 calls/month", "Basic voice", "Email support"],
  //   cta: "Get started free",
  //   tabs: ["test"],
  // },
  {
    id: "test_rupee",
    label: "Test Plan",
    subtitle: "Two-dollar payment for testing.",
    monthlyPrice: 2,
    annualPrice: 2,
    currency: "$",
    features: ["Same as Starter", "Test payment only", "$2 charge"],
    cta: "Pay $2 now",
    tabs: ["test"],
  },
];

function formatPrice(plan: PlanDef, cycle: BillingCycle) {
  const price = cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  return `${plan.currency}${price}`;
}

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="min-h-[260px]">
        <PaymentElement />
      </div>
      <Button
        type="submit"
        className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-base font-semibold rounded-xl"
        disabled={!stripe || processing}
      >
        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Pay Now
      </Button>
    </form>
  );
}

export default function SubscribePlan() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .get(API_ROUTES.subscription.validate)
      .then((res) => {
        if (res.data?.data !== null && res.data?.data !== undefined) {
          navigate("/dashboard", { replace: true });
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, []);

  // When switching tabs, reset selected plan to the first visible one
  const handleCycleChange = (newCycle: BillingCycle) => {
    setCycle(newCycle);
    const first = PLANS.find((p) => p.tabs.includes(newCycle));
    if (first) setSelectedPlan(first.id);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const visiblePlans = PLANS.filter((p) => p.tabs.includes(cycle));

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;

    const price = cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

    if (price === 0) {
      setSubmitting(true);
      try {
        await api.post(API_ROUTES.subscription.validate, { plan: planId });
        toast.success("Free plan activated!");
        navigate("/dashboard", { replace: true });
      } catch {
        toast.error("Could not activate free plan");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: planId, billing_cycle: cycle });
      setClientSecret(client_secret);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to initiate payment";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { key: BillingCycle; label: string }[] = [
    { key: "monthly", label: "Monthly" },
    { key: "annual", label: "Annual" },
    { key: "test", label: "Test" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <LyraaMark />
            <span className="font-bold text-xl lowercase tracking-tight">lyraa</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-500 mt-1 text-sm">Select a plan and complete payment to get started</p>
        </div>

        {!clientSecret ? (
          <>
            {/* Billing toggle */}
            <div className="flex justify-center">
              <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCycleChange(tab.key)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      cycle === tab.key
                        ? "bg-[#4f46e5] text-white shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan cards */}
            <div
              className={`grid gap-6 ${
                visiblePlans.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto w-full"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {visiblePlans.map((plan) => {
                const price = formatPrice(plan, cycle);
                const isSelected = selectedPlan === plan.id;
                const isPopular = plan.popular;

                return (
                  <div key={plan.id} className="relative flex flex-col pt-5">
                    {isPopular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-[#4f46e5] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <Card
                      className={`flex-1 cursor-pointer transition-all rounded-2xl ${
                        isPopular
                          ? "border-2 border-[#4f46e5] shadow-lg"
                          : isSelected
                          ? "border-2 border-[#4f46e5]/50 shadow-md"
                          : "border border-gray-200 hover:border-[#4f46e5]/40 shadow-sm"
                      } bg-white`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <CardContent className="pt-6 pb-6 px-6 flex flex-col gap-5">
                        <div>
                          <p className="text-[11px] font-bold text-[#4f46e5] uppercase tracking-widest">
                            {plan.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{plan.subtitle}</p>
                          <p className="text-4xl font-extrabold text-gray-900 mt-3">
                            {price}
                            {plan.monthlyPrice !== 0 && (
                              <span className="text-sm font-normal text-gray-400"> /month</span>
                            )}
                          </p>
                        </div>

                        <Button
                          className={`w-full rounded-xl text-sm font-semibold h-11 ${
                            isPopular
                              ? "bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                              : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                          }`}
                          disabled={submitting && selectedPlan === plan.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan.id);
                          }}
                        >
                          {submitting && selectedPlan === plan.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>{plan.cta}{isPopular ? " →" : ""}</>
                          )}
                        </Button>

                        <ul className="space-y-2.5">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-[#4f46e5] shrink-0 mt-0.5" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-sm rounded-2xl">
              <CardContent className="pt-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Complete Payment</h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm onSuccess={() => navigate("/dashboard", { replace: true })} />
                </Elements>
              </CardContent>
            </Card>
            <button
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline w-full text-center"
              onClick={() => setClientSecret(null)}
            >
              ← Back to plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
