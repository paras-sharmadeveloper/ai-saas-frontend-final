import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { name: "Free", price: "$0", features: ["100 calls/month", "1 AI Agent", "Basic analytics", "Email support"], current: false, action: "Downgrade" },
  { name: "Pro", price: "$49", features: ["2,000 calls/month", "5 AI Agents", "Advanced analytics", "Priority support", "Custom training"], current: true, action: "Current Plan" },
  { name: "Enterprise", price: "$149", features: ["Unlimited calls", "Unlimited AI Agents", "Custom integrations", "Dedicated support", "SLA guarantee", "API access"], current: false, action: "Contact Sales" },
];

const invoices = [
  { id: "INV-001", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2026", amount: "$49.00", status: "Paid" },
];

export default function Billing() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.name} className={p.current ? "border-primary ring-2 ring-primary/20" : ""}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-3xl font-bold mt-1">{p.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              </div>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={p.current ? "outline" : "default"} disabled={p.current}
                onClick={() => !p.current && toast.success(`${p.action} initiated`)}>
                {p.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Method</CardTitle>
          <Button variant="outline" onClick={() => toast.success("Payment method update initiated")}>Update Payment Method</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Billing History</CardTitle></CardHeader>
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
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell><Badge className="bg-success/10 text-success border-0">{inv.status}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="outline"><Download className="w-3 h-3 mr-1" /> Download</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
