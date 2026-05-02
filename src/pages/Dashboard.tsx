import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, Users, PhoneMissed, Clock, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { dashboardService, type DashboardData } from "@/services/dashboardService";
import { billingService, type SubscriptionValidation } from "@/services/billingService";
import { api } from "@/services/api";
import { API_ROUTES } from "@/services/apiRoutes";

const intentColor = (intent?: string) => {
  if (intent === "lead") return "bg-green-100 text-green-700 border-0";
  if (intent === "complaint") return "bg-red-100 text-red-700 border-0";
  return "bg-blue-100 text-blue-700 border-0";
};

const BUSINESS_TYPES = ["E-commerce", "SaaS", "Agency", "Healthcare", "Real Estate", "Education", "Finance", "Retail", "Other"];
const HEARD_FROM = ["Google Search", "Social Media", "Friend / Referral", "Blog / Article", "Advertisement", "Other"];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [subscriptionValidation, setSubscriptionValidation] = useState<SubscriptionValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    business_type: "",
    heard_from: "",
    website: "",
  });

  useEffect(() => {
    dashboardService
      .getData()
      .then(async (d) => {
        setData(d);
        try {
          const res = await api.get(API_ROUTES.subscription.validate);
          if (res.data?.data === null || res.data?.data === undefined) {
            navigate("/subscribe-plan", { replace: true });
          }
        } catch {
          navigate("/subscribe-plan", { replace: true });
        }
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(API_ROUTES.company.onboarding, form);
      toast.success("Welcome aboard! Your setup is complete.");
      setShowOnboarding(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to save";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = data?.stats;
  const phoneNumbers = data?.phone_numbers ?? [];
  const recentCalls = data?.recent_calls ?? [];

  const statCards = [
    { label: "Total Calls", value: stats?.total_calls ?? 0, icon: Phone, color: "bg-primary/10 text-primary" },
    { label: "Total Leads", value: stats?.total_leads ?? 0, icon: Users, color: "bg-success/10 text-success" },
    { label: "Missed Calls", value: stats?.missed_calls ?? 0, icon: PhoneMissed, color: "bg-destructive/10 text-destructive" },
    { label: "Total Duration", value: stats?.total_duration ?? "—", icon: Clock, color: "bg-warning/10 text-warning" },
    // { label: "Total Customers", value: stats?.total_customers ?? 0, icon: Users,       color: "bg-blue-100 text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your AI voice agent platform</p>
        </div>
        <div className="flex items-center gap-2.5 bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground leading-none">Assigned Number</p>
            <p className="text-sm font-bold text-primary mt-0.5 tracking-wide">
              {phoneNumbers[0]?.number ?? "No number assigned"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Calls */}
      {recentCalls.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Recent Calls</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCalls.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/calls/${c.uuid}`)}>
                    <TableCell className="font-medium">{c.customer_name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                    <TableCell>{c.intent && <Badge className={intentColor(c.intent)}>{c.intent}</Badge>}</TableCell>
                    <TableCell><Badge className="bg-success/10 text-success border-0 capitalize">{c.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{c.duration ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{c.date ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={() => { }}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Welcome! Let's get you set up</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Just a few quick questions to personalize your experience</p>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleOnboardingSubmit} className="space-y-4 mt-2">
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

            <Button type="submit" className="w-full bg-primary hover:bg-primary-700 text-white" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Get Started
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
