import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { billingService } from "@/services/billingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

const PLANS = [
  {
    id: "pro",
    label: "Pro",
    price: "$49",
    desc: "For growing businesses",
    features: ["5 AI Agents", "2,000 calls/month"],
    popular: true,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: "$199",
    desc: "For large teams",
    features: ["Unlimited Agents", "Unlimited calls"],
  },
];

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
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-xl"
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
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // On mount: call validate API — if data is not null redirect to dashboard, else show plans
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

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: selectedPlan });
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

  const handleSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const currentPlan = PLANS.find((p) => p.id === selectedPlan);

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
          <h1 className="text-2xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-1 text-sm">Select a plan and complete payment to get started</p>
        </div>

        {!clientSecret ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLANS.map((p) => (
                <Card
                  key={p.id}
                  className={`shadow-sm cursor-pointer transition-all ${
                    selectedPlan === p.id
                      ? "border-primary ring-1 ring-primary/20"
                      : "hover:border-primary/40"
                  }`}
                  onClick={() => setSelectedPlan(p.id)}
                >
                  <CardContent className="pt-5 space-y-3">
                    {p.popular && (
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base">{p.label}</h3>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                      <p className="text-2xl font-bold mt-2">
                        {p.price}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {p.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-success shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-xl"
              disabled={submitting}
              onClick={handleContinue}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continue with {currentPlan?.label}
            </Button>
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm onSuccess={handleSuccess} />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
