import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Download, Sparkles, Loader2, Crown, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { billingService, type MyPlan, type Invoice, type Plan } from "@/services/billingService";
import { useSubscription } from "@/context/SubscriptionContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

type BillingCycle = "monthly" | "annual";

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
        toast.success("Payment successful! Plan upgraded.");
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

function formatPrice(plan: Plan) {
  return `$${plan.price}`;
}

export default function Billing() {
  const [myPlan, setMyPlan] = useState<MyPlan | null>(null);
  const { subscriptionValidation, refreshSubscription } = useSubscription();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  useEffect(() => {
    Promise.all([
      billingService.getMyPlan().catch(() => null),
      billingService.getAllPlans().catch(() => []),
      billingService.getInvoices().catch(() => []),
    ]).then(([plan, plansList, invoiceList]) => {
      if (plan) setMyPlan(plan);
      if (Array.isArray(plansList)) {
        const activePlans = plansList.filter(p => p.is_active !== false);
        setPlans(activePlans);
      }
      if (Array.isArray(invoiceList)) setInvoices(invoiceList);
    }).finally(() => setLoading(false));
  }, []);

  const isCurrentPlan = (planKey: string) => {
    // Check against subscription validation data
    if (subscriptionValidation?.data?.plan) {
      return subscriptionValidation.data.plan.toLowerCase() === planKey.toLowerCase();
    }
    // Fallback to myPlan
    return myPlan?.plan?.toLowerCase() === planKey.toLowerCase();
  };

  const handleUpgrade = async (plan: Plan) => {
    const price = parseFloat(plan.price);

    if (price === 0) {
      toast.success(`Switched to ${plan.name} plan`);
      return;
    }
    setLoadingPlan(plan.plan_key);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: plan.plan_key, billing_cycle: plan.billing });
      setClientSecret(client_secret);
      setSelectedPlan(plan.name);
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

  const handleDownloadInvoice = (inv: Invoice) => {
    const url = inv.invoice_pdf ?? inv.hosted_invoice_url;
    if (url) window.open(url, "_blank");
    else toast.error("Invoice PDF not available");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const visiblePlans = plans.filter((p) => p.billing === cycle);
  const tabs: { key: BillingCycle; label: string }[] = [
    { key: "monthly", label: "Monthly" },
    { key: "annual", label: "Annual" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription & Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your plan and payment methods</p>
      </div>

      {/* Free Trial Banner - Show by default or when on free trial */}
      {subscriptionValidation?.data?.status === "trial" && (
        <Card className="shadow-sm border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Free Trial</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">$0</span> · 
                    <span className="font-medium text-foreground"> {subscriptionValidation.data.trial_days_left} days left</span> · 
                    Trial ends {new Date(subscriptionValidation.data.trial_ends_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground border-0">Active Trial</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paid Subscription Banner */}
      {subscriptionValidation?.access_type === "subscription" && subscriptionValidation.data.plan_name && (
        <Card className="shadow-sm border-primary/30 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{subscriptionValidation.data.plan_name} Plan</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="font-medium text-foreground">${subscriptionValidation.data.amount}</span> · 
                    <span className="font-medium text-foreground"> {subscriptionValidation.data.days_remaining} days left</span> · 
                    Renews {new Date(subscriptionValidation.data.ends_at!).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Badge className="bg-success/10 text-success border-0 capitalize">{subscriptionValidation.data.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Banner - Show only for valid paid plans */}
      {myPlan && myPlan.plan && myPlan.plan !== "" && myPlan.plan?.toLowerCase() !== "free_trial" && myPlan.plan?.toLowerCase() !== "free" && subscriptionValidation?.data?.status !== "trial" && !subscriptionValidation?.data?.plan_name && (
        <Card className="shadow-sm border-primary/30 bg-primary/5">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground capitalize">{myPlan.plan} Plan</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Status: <span className="capitalize font-medium text-foreground">{myPlan.status}</span>
                    {(myPlan.expiry ?? myPlan.current_period_end) && (
                      <> · Renews {new Date((myPlan.expiry ?? myPlan.current_period_end)!).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
              </div>
              <Badge className="bg-success/10 text-success border-0 capitalize">{myPlan.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCycle(tab.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${cycle === tab.key
                ? "bg-[#4f46e5] text-white shadow"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visiblePlans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.plan_key);
          const price = formatPrice(plan);
          return (
            <Card key={plan.plan_key} className={`shadow-sm relative ${isCurrent ? "border-primary ring-1 ring-primary/20" : ""}`}>
              {(isCurrent || plan.most_popular) && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground border-0 text-[10px] px-2.5">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isCurrent ? "Current Plan" : "Most Popular"}
                  </Badge>
                </div>
              )}
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.description || `For ${plan.name.toLowerCase()} users`}</p>
                  <p className="text-3xl font-bold mt-3 text-foreground">
                    {price}
                    <span className="text-sm font-normal text-muted-foreground"> /month</span>
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {plan.features && plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#4f46e5] shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || loadingPlan === plan.plan_key}
                  onClick={() => !isCurrent && handleUpgrade(plan)}
                >
                  {loadingPlan === plan.plan_key && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Billing History */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Billing History</CardTitle></CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No invoices yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs text-muted-foreground">{inv.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {inv.date ? new Date(inv.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {typeof inv.amount === "number" ? `$${(inv.amount / 100).toFixed(2)}` : inv.amount}
                    </TableCell>
                    <TableCell>
                      <Badge className={inv.status === "paid" ? "bg-success/10 text-success border-0 capitalize" : "bg-muted text-muted-foreground border-0 capitalize"}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(inv)}>
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Stripe Checkout Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Upgrade to {selectedPlan}</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <div className="flex-1 overflow-hidden">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={async () => {
                  setDialogOpen(false);
                  // Refresh both myPlan and subscription validation
                  await Promise.all([
                    billingService.getMyPlan().then(setMyPlan).catch(() => null),
                    refreshSubscription(),
                  ]);
                }} />
              </Elements>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
