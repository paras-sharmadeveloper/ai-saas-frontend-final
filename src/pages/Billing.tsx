import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Download, Sparkles, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { billingService, type MyPlan, type Plan, type Invoice } from "@/services/billingService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

const PLAN_META: Record<string, { label: string; desc: string; features: string[]; popular?: boolean }> = {
  free:       { label: "Free",       desc: "Get started with basics",  features: ["1 AI Agent", "100 calls/month", "1 phone number", "Email support"] },
  basic:      { label: "Basic",      desc: "Get started with basics",  features: ["1 AI Agent", "100 calls/month", "1 phone number", "Email support"] },
  pro:        { label: "Pro",        desc: "For growing businesses",   features: ["5 AI Agents", "2,000 calls/month", "5 phone numbers", "Priority support", "Advanced analytics"], popular: true },
  monthly:    { label: "Pro",        desc: "For growing businesses",   features: ["5 AI Agents", "2,000 calls/month", "5 phone numbers", "Priority support", "Advanced analytics"], popular: true },
  enterprise: { label: "Enterprise", desc: "For large teams",          features: ["Unlimited Agents", "Unlimited calls", "Unlimited numbers", "24/7 support", "Custom integrations", "Dedicated CSM"] },
};

const STATIC_PLANS: Plan[] = [
  { id: "basic",      name: "basic",      price: 0,   currency: "usd", interval: "month" },
  { id: "pro",        name: "pro",        price: 49,  currency: "usd", interval: "month" },
  { id: "enterprise", name: "enterprise", price: 199, currency: "usd", interval: "month" },
];

const getMeta = (p: Plan) =>
  PLAN_META[p.id?.toLowerCase()] ??
  PLAN_META[p.name?.toLowerCase()] ??
  { label: p.name, desc: "", features: p.features ?? [] };

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
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white shrink-0" disabled={!stripe || processing}>
        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Pay Now
      </Button>
    </form>
  );
}

export default function Billing() {
  const [myPlan, setMyPlan] = useState<MyPlan | null>(null);
  const [plans, setPlans] = useState<Plan[]>(STATIC_PLANS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      billingService.getMyPlan().catch(() => null),
      billingService.getPlans().catch(() => []),
      billingService.getInvoices().catch(() => []),
    ]).then(([plan, planList, invoiceList]) => {
      if (plan) setMyPlan(plan);
      if (Array.isArray(planList) && planList.length > 0) setPlans(planList);
      if (Array.isArray(invoiceList)) setInvoices(invoiceList);
    }).finally(() => setLoading(false));
  }, []);

  const isCurrentPlan = (p: Plan) =>
    myPlan?.plan?.toLowerCase() === p.name?.toLowerCase() ||
    myPlan?.plan?.toLowerCase() === p.id?.toLowerCase();

  const handleUpgrade = async (p: Plan) => {
    if (!p.price || Number(p.price) === 0) {
      toast.success(`Switched to ${p.name} plan`);
      return;
    }
    setLoadingPlan(p.id);
    try {
      const { client_secret } = await billingService.createPaymentIntent({ plan: p.id });
      setClientSecret(client_secret);
      setSelectedPlan(getMeta(p).label);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription & Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan Banner */}
      {myPlan && (
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isCurrent = isCurrentPlan(p);
          const meta = getMeta(p);
          return (
            <Card key={p.id} className={`shadow-sm relative ${isCurrent ? "border-primary ring-1 ring-primary/20" : ""}`}>
              {(isCurrent || meta.popular) && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground border-0 text-[10px] px-2.5">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isCurrent ? "Current Plan" : "Most Popular"}
                  </Badge>
                </div>
              )}
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{meta.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{meta.desc}</p>
                  <p className="text-3xl font-bold mt-3 text-foreground">
                    ${Number(p.price) === 0 ? "0" : p.price}
                    <span className="text-sm font-normal text-muted-foreground">/{p.interval ?? "month"}</span>
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {meta.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || loadingPlan === p.id}
                  onClick={() => !isCurrent && handleUpgrade(p)}
                >
                  {loadingPlan === p.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isCurrent ? "Current Plan" : Number(p.price) === 0 ? "Select" : "Upgrade"}
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
                <CheckoutForm onSuccess={() => {
                  setDialogOpen(false);
                  billingService.getMyPlan().then(setMyPlan).catch(() => null);
                }} />
              </Elements>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
