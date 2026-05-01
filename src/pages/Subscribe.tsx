import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Sparkles, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { billingService } from "@/services/billingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

const PLANS = [
  {
    id: "basic",
    label: "Basic",
    price: "$0",
    amount: 0,
    desc: "Get started for free",
    features: ["1 AI Agent", "100 calls/month", "1 phone number", "Email support"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$49",
    amount: 49,
    desc: "For growing businesses",
    features: ["5 AI Agents", "2,000 calls/month", "5 phone numbers", "Priority support", "Advanced analytics"],
    popular: true,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: "$199",
    amount: 199,
    desc: "For large teams",
    features: ["Unlimited Agents", "Unlimited calls", "Unlimited numbers", "24/7 support", "Custom integrations", "Dedicated CSM"],
  },
];

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
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
        toast.success("Subscription activated!");
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
      <div className="overflow-y-auto max-h-[55vh] pr-1">
        <PaymentElement />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-700 text-white shrink-0" disabled={!stripe || processing}>
        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Pay Now
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelect = async (plan: typeof PLANS[0]) => {
    if (plan.amount === 0) {
      toast.success("Free plan activated!");
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    setLoadingPlan(plan.id);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: plan.id });
      setClientSecret(client_secret);
      setSelectedPlan(plan.label);
      setDialogOpen(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to initiate payment";
      toast.error(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">Choose Your Plan</span>
          </div>
          <p className="text-muted-foreground text-sm">Select the plan that fits your needs. Upgrade or downgrade anytime.</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <Card key={p.id} className={`shadow-sm relative ${p.popular ? "border-primary ring-1 ring-primary/20" : ""}`}>
              {p.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                </div>
              )}
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{p.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  <p className="text-3xl font-bold mt-3 text-foreground">
                    {p.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary hover:bg-primary-700 text-white"
                  disabled={loadingPlan === p.id}
                  onClick={() => handleSelect(p)}
                >
                  {loadingPlan === p.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {p.amount === 0 ? "Get Started Free" : `Choose ${p.label}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You can change your plan anytime from the Billing page.
        </p>
      </div>

      {/* Stripe Checkout Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Subscribe to {selectedPlan}</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <div className="flex-1 overflow-hidden">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={() => {
                  setDialogOpen(false);
                  navigate("/admin/dashboard", { replace: true });
                }} />
              </Elements>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
