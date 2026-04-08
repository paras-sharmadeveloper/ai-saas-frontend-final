import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Get started with basics",
    features: ["1 AI Agent", "100 calls/month", "1 phone number", "Email support"],
    current: false,
    action: "Upgrade",
  },
  {
    name: "Pro",
    price: "$49",
    desc: "For growing businesses",
    features: ["5 AI Agents", "2,000 calls/month", "5 phone numbers", "Priority support", "Advanced analytics"],
    current: true,
    action: "Current Plan",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    desc: "For large teams",
    features: ["Unlimited Agents", "Unlimited calls", "Unlimited numbers", "24/7 support", "Custom integrations", "Dedicated CSM"],
    current: false,
    action: "Upgrade",
  },
];

const invoices = [
  { id: "INV-001", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-004", date: "Dec 1, 2025", amount: "$49.00", status: "Paid" },
];

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription & Billing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your plan and payment methods</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <Card key={p.name} className={`shadow-sm relative ${p.current ? "border-primary ring-1 ring-primary/20" : ""}`}>
            {p.popular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground border-0 text-[10px] px-2.5">
                  <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                </Badge>
              </div>
            )}
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                <p className="text-3xl font-bold mt-3 text-foreground">
                  {p.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
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
                className="w-full"
                variant={p.current ? "outline" : "default"}
                disabled={p.current}
                onClick={() => !p.current && toast.success(`Upgrade initiated`)}
              >
                {p.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Payment Method</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Your saved payment method</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Update payment initiated")}>Update</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 bg-muted rounded-xl p-4">
            <div className="w-12 h-8 rounded-md bg-card border border-border flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Visa ending in 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/2028</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Billing History</CardTitle></CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="font-medium">{inv.amount}</TableCell>
                  <TableCell><Badge className="bg-success/10 text-success border-0">{inv.status}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 