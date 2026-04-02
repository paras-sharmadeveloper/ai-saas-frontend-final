import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, PhoneMissed, Clock, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  { label: "Total Calls", value: "2,847", change: "+12.5%", positive: true, icon: Phone },
  { label: "Total Leads", value: "1,234", change: "+8.2%", positive: true, icon: Users },
  { label: "Missed Calls", value: "45", change: "-3.1%", positive: false, icon: PhoneMissed },
  { label: "Avg Call Duration", value: "4m 32s", change: "+0.8%", positive: true, icon: Clock },
];

const recentCalls = [
  { customer: "Sarah Johnson", phone: "+1 (555) 123-4567", type: "Lead", status: "Completed", duration: "5:23", date: "2 min ago" },
  { customer: "Michael Chen", phone: "+1 (555) 234-5678", type: "Support", status: "Completed", duration: "3:45", date: "15 min ago" },
  { customer: "Emma Wilson", phone: "+1 (555) 345-6789", type: "Lead", status: "Missed", duration: "—", date: "1 hr ago" },
  { customer: "James Brown", phone: "+1 (555) 456-7890", type: "Sales", status: "Completed", duration: "8:12", date: "2 hrs ago" },
  { customer: "Lisa Davis", phone: "+1 (555) 567-8901", type: "Complaint", status: "In Progress", duration: "2:10", date: "3 hrs ago" },
];

const statusColor = (s: string) => {
  if (s === "Completed") return "bg-success/10 text-success border-0";
  if (s === "Missed") return "bg-destructive/10 text-destructive border-0";
  return "bg-accent text-accent-foreground border-0";
};

const typeColor = (t: string) => {
  if (t === "Lead") return "bg-primary/10 text-primary border-0";
  if (t === "Support") return "bg-accent text-accent-foreground border-0";
  if (t === "Sales") return "bg-success/10 text-success border-0";
  return "bg-warning/10 text-warning border-0";
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your AI voice agent platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  s.positive ? "bg-success/10" : "bg-destructive/10"
                }`}>
                  <s.icon className={`w-5 h-5 ${s.positive ? "text-success" : "text-destructive"}`} />
                </div>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${s.positive ? "text-success" : "text-destructive"}`}>
                {s.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {s.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((c, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{c.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                  <TableCell><Badge className={typeColor(c.type)}>{c.type}</Badge></TableCell>
                  <TableCell><Badge className={statusColor(c.status)}>{c.status}</Badge></TableCell>
                  <TableCell>{c.duration}</TableCell>
                  <TableCell className="text-muted-foreground">{c.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
